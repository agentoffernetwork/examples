# AgentOffer Examples

Canonical HTTP payloads and fixed protocol vectors for AgentOffer integrations.

**Current normative contract: Protocol v0.2**

These files illustrate the checked-in v0.2 source contract. They do not prove
hosted runtime availability. Validate them with the schema repository gate
instead of treating an example as an independent field definition.

## v0.2 examples

| Surface | Files |
|---|---|
| Minimal Query request | `http/offer-query-request-v0.2-minimal.json` |
| Full Query request | `http/offer-query-request-v0.2-full.json` |
| Protocol Query success | `http/offer-response-v0.2.json` |
| Hosted Query wrapper | `http/offer-query-hosted-response-v0.2.json` |
| Provider request | `http/offer-provider/basic-query-v0.2.json`, `full-query-v0.2.json` |
| Provider response | `http/offer-provider/success-v0.2.json`, `error-bad-request-v0.2.json` |
| Partner conversion | `http/postback/partner/basic-conversion-v0.2.json` |
| Agent conversion | `http/postback/agent/basic-conversion.json` and fixed signing vectors |

The protocol Query success payload is exactly `{request_id, offers[]}`.
`offer-query-hosted-response-v0.2.json` demonstrates that a hosted service may
place this payload inside `data`; the outer `{code,message,data,extra}` object
is transport-specific and must not validate as the protocol payload.

The Provider success body is the raw protocol success payload, without a
hosted wrapper. Provider error examples use the Provider error envelope.

Both Postback directions use required `event_name` and exclude legacy
`conversion_type` and `bid_amount` fields.

## Validate

From `protocol/github-repos/schema`:

```bash
npm ci --ignore-scripts
npm run test:v0.2-baseline
```

The manifest in
`schema/fixtures/protocol-v0.2-contract-vectors.json` identifies every
fixture, specification reference, enforcement layer, and expected result.

## Safe placeholder rules

- Use `.example` domains and synthetic identifiers.
- Never commit real bearer tokens, callback secrets, user email addresses, or
  phone numbers.
- Use decimal strings where the protocol schema requires decimal strings.
- Preserve the exact compact Agent Postback body when reproducing HMAC vectors.

## Historical material

Unversioned and v0.1 examples are retained for historical inspection only.
They are not the current new-integration path and are not part of the v0.2
baseline gate.

Licensed under [Apache License 2.0](LICENSE).
