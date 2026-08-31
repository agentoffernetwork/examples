import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const examplesRoot = join(repositoryRoot, 'v1.0');
const schemaRoot = process.env.AON_SCHEMA_ROOT;

assert(schemaRoot, 'AON_SCHEMA_ROOT must point to a checkout of schema/v1.0');

function collectFiles(directory, suffix) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) return collectFiles(entryPath, suffix);
    return entry.name.endsWith(suffix) ? [entryPath] : [];
  });
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function readHttpJson(filePath) {
  const contents = readFileSync(filePath, 'utf8');
  const bodyStart = contents.indexOf('\n\n');
  assert.notEqual(bodyStart, -1, `${filePath} must contain a request body`);

  const bodyAndNotes = contents.slice(bodyStart + 2);
  const noteStart = bodyAndNotes.indexOf('\n\n### ');
  const body = (noteStart === -1 ? bodyAndNotes : bodyAndNotes.slice(0, noteStart)).trim();
  return JSON.parse(body);
}

const ajv = new Ajv2020({
  allErrors: true,
  strictSchema: true,
  strictRequired: false,
  strictTypes: false,
});

addFormats(ajv);
ajv.addKeyword({ keyword: 'x-aon-maxUtf8Bytes', schemaType: 'number', valid: true });

const schemaDirectory = join(schemaRoot, 'json-schema');
const schemaDocuments = collectFiles(schemaDirectory, '.json').map(readJson);

for (const schemaDocument of schemaDocuments) {
  ajv.addSchema(schemaDocument);
}

for (const schemaDocument of schemaDocuments) {
  assert(ajv.getSchema(schemaDocument.$id), `Expected compiled schema ${schemaDocument.$id}`);
}

function validateDocument({ data, description, expectedValid, schemaFile }) {
  const schema = readJson(join(schemaDirectory, schemaFile));
  const validate = ajv.getSchema(schema.$id);
  assert(validate, `Expected schema ${schema.$id}`);

  const isValid = validate(data);
  assert.equal(
    isValid,
    expectedValid,
    `${description}: ${ajv.errorsText(validate.errors, { separator: '; ' })}`,
  );
}

for (const jsonFile of collectFiles(examplesRoot, '.json')) {
  readJson(jsonFile);
}

const httpRoot = join(examplesRoot, 'http');
const documentChecks = [
  ['offer-control.json', 'offer-control.json', true],
  ['offer-partner.json', 'offer-partner-schema.json', true],
  ['offer-provider/request.json', 'offer-provider-request.json', true],
  ['offer-provider/success.json', 'offer-provider-response.json', true],
  ['postback/agent/basic-conversion.json', 'postback-agent-payload.json', true],
  ['postback/partner/basic-conversion.json', 'postback-partner-payload.json', true],
  ['postback/partner/invalid-unknown-field.json', 'postback-partner-payload.json', false],
];

for (const [dataFile, schemaFile, expectedValid] of documentChecks) {
  validateDocument({
    data: readJson(join(httpRoot, dataFile)),
    description: dataFile,
    expectedValid,
    schemaFile,
  });
}

const offerQuery = readJson(join(httpRoot, 'offer-query.json'));
validateDocument({
  data: offerQuery.request,
  description: 'offer-query.json request',
  expectedValid: true,
  schemaFile: 'offer-query-schema.json',
});
validateDocument({
  data: offerQuery.response,
  description: 'offer-query.json response',
  expectedValid: true,
  schemaFile: 'offer-query-response.json',
});

validateDocument({
  data: readHttpJson(join(httpRoot, 'postback/agent/basic-conversion.http')),
  description: 'postback/agent/basic-conversion.http',
  expectedValid: true,
  schemaFile: 'postback-agent-payload.json',
});
validateDocument({
  data: readHttpJson(join(httpRoot, 'postback/partner/basic-conversion.http')),
  description: 'postback/partner/basic-conversion.http',
  expectedValid: true,
  schemaFile: 'postback-partner-payload.json',
});
validateDocument({
  data: readHttpJson(join(httpRoot, 'postback/partner/invalid-unknown-field.http')),
  description: 'postback/partner/invalid-unknown-field.http',
  expectedValid: false,
  schemaFile: 'postback-partner-payload.json',
});

console.log(`Validated ${schemaDocuments.length} schemas and v1.0 examples.`);
