import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const examplesRoot = resolve(here, '..');
const execute = process.argv.includes('--execute');
const injectedGroup = process.env.AON_CONTRACT_CI_INJECT_FAILURE;

function readJson(relativePath) {
  return JSON.parse(readFileSync(resolve(examplesRoot, relativePath), 'utf8'));
}

function assertObject(value, label) {
  assert(value !== null && typeof value === 'object' && !Array.isArray(value), `${label} must be an object`);
}

function assertExactKeys(value, keys, label) {
  assert.deepEqual(Object.keys(value).sort(), [...keys].sort(), `${label} has an unexpected envelope`);
}

function jsonFiles(directory = resolve(examplesRoot, 'http')) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return jsonFiles(path);
    return entry.name.endsWith('.json') ? [path] : [];
  });
}

async function runGroup(name, action) {
  process.stdout.write(`\n>>> examples contract-ci group: ${name}\n`);
  if (injectedGroup === `examples:${name}`) {
    throw new Error(`injected examples contract-ci failure: ${name}`);
  }
  await action();
  process.stdout.write(`PASS examples contract-ci group: ${name}\n`);
}

function checkJsonDocuments() {
  const files = jsonFiles();
  assert(files.length > 0, 'examples repository must contain JSON documents');
  for (const file of files) JSON.parse(readFileSync(file, 'utf8'));
}

function checkQueryExamples() {
  for (const path of ['http/offer-query-request-v0.2-minimal.json', 'http/offer-query-request-v0.2-full.json']) {
    const query = readJson(path);
    assertObject(query.context, `${path}.context`);
    assertObject(query.context.user_profile, `${path}.context.user_profile`);
    assert(Array.isArray(query.intent?.content) && query.intent.content.length > 0, `${path} needs intent content`);
    assert(query.intent.content.some((item) => item?.type === 'input_text' && typeof item.text === 'string'), `${path} needs input_text intent`);
  }
}

function checkOfferProviderExamples() {
  for (const path of ['http/offer-provider/basic-query-v0.2.json', 'http/offer-provider/full-query-v0.2.json']) {
    const request = readJson(path);
    assert.equal(typeof request.request_id, 'string', `${path} needs request_id`);
    assertObject(request.context?.user_profile, `${path} needs context.user_profile`);
    assert(Array.isArray(request.intent?.content) && request.intent.content.length > 0, `${path} needs intent content`);
  }
  const success = readJson('http/offer-provider/success-v0.2.json');
  assertExactKeys(success, ['request_id', 'offers'], 'OfferProvider success response');
  assert(Array.isArray(success.offers), 'OfferProvider success response offers must be an array');
  const error = readJson('http/offer-provider/error-bad-request-v0.2.json');
  assert.equal(error.code, 'BAD_REQUEST', 'OfferProvider error must identify BAD_REQUEST');
  assert.equal(typeof error.message, 'string', 'OfferProvider error needs a message');
}

function checkHostedResponseExamples() {
  const response = readJson('http/offer-response-v0.2.json');
  assertExactKeys(response, ['request_id', 'offers'], 'protocol Query success response');
  assert(Array.isArray(response.offers), 'protocol Query success offers must be an array');
  const hosted = readJson('http/offer-query-hosted-response-v0.2.json');
  assertExactKeys(hosted, ['code', 'message', 'data', 'extra'], 'hosted Query response');
  assert.equal(hosted.code, 'SUCCESS', 'hosted Query response must signal success');
  assertExactKeys(hosted.data, ['request_id', 'offers'], 'hosted Query data');
  assert(Array.isArray(hosted.data.offers), 'hosted Query data offers must be an array');
  for (const offer of hosted.data.offers) {
    assert.equal(offer.version, '2.0', 'hosted Query offers must use v0.2');
    assert.equal(typeof offer.offer_id, 'string', 'hosted Query offers need offer_id');
    assert(Array.isArray(offer.goals) && offer.goals.length > 0, 'hosted Query offers need conversion goals');
  }
}

function checkPostbackExamples() {
  const partner = readJson('http/postback/partner/basic-conversion-v0.2.json');
  for (const field of ['aon_tracking_id', 'event_name', 'amount', 'currency', 'event_id']) {
    assert.equal(typeof partner[field], 'string', `partner postback needs ${field}`);
  }
  assert.equal(Object.hasOwn(partner, 'conversion_type'), false, 'partner postback must not use conversion_type');
  const agent = readJson('http/postback/agent/basic-conversion.json');
  for (const field of ['event_id', 'event_type', 'aon_tracking_id', 'offer_id', 'agent_id', 'event_name', 'currency', 'timestamp']) {
    assert.equal(typeof agent[field], 'string', `agent postback needs ${field}`);
  }
  assert.equal(agent.event_type, 'conversion', 'agent postback must be a conversion event');
  assert.equal(Object.hasOwn(agent, 'conversion_type'), false, 'agent postback must not use conversion_type');
}

export async function runs_and_fails_complete_public_examples_contract_suite() {
  await runGroup('json', checkJsonDocuments);
  await runGroup('query', checkQueryExamples);
  await runGroup('offer-provider', checkOfferProviderExamples);
  await runGroup('hosted-response', checkHostedResponseExamples);
  await runGroup('postback', checkPostbackExamples);
}

function proveInjectedFailure() {
  const success = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--execute'], {
    cwd: examplesRoot,
    encoding: 'utf8',
  });
  assert.equal(success.status, 0, `examples suite must pass: ${success.stderr}`);
  assert.match(success.stdout, /PASS examples contract-ci group: postback/);
  const failure = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--execute'], {
    cwd: examplesRoot,
    encoding: 'utf8',
    env: { ...process.env, AON_CONTRACT_CI_INJECT_FAILURE: 'examples:query' },
  });
  assert.notEqual(failure.status, 0, 'an injected examples failure must fail the suite');
  assert.match(failure.stderr, /injected examples contract-ci failure: query/);
}

async function main() {
  if (execute) {
    try {
      await runs_and_fails_complete_public_examples_contract_suite();
    } catch (error) {
      const detail = error instanceof Error ? error.stack ?? error.message : String(error);
      console.error(`examples contract-ci FAILED\n${detail}`);
      process.exitCode = 1;
    }
    return;
  }
  await runs_and_fails_complete_public_examples_contract_suite();
  proveInjectedFailure();
  console.log('examples contract-ci suite T-027 OK');
}

await main();
