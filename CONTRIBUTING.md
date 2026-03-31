# Contributing

Thanks for helping improve AgentOffer Examples.

## Scope

This repository owns practical request/response payloads, SDK code snippets, and agent integration examples for AgentOffer Protocol.

## Where to Send Changes

- **New examples** for existing category types: direct pull request
- **Fixes** to existing examples (typos, outdated fields, incorrect values): direct pull request
- **Examples for new categories** that don't exist yet: wait for the category to be added via [RFC](https://github.com/agentoffernetwork/rfcs)

## Pull Request Expectations

- All examples must validate against the current [JSON Schema](https://github.com/agentoffernetwork/schema)
- Confirm which protocol version the example targets (e.g., v0.1)
- Use realistic but fictional data -- do not include real company names, URLs, or tracking IDs
- Follow existing JSON formatting conventions (2-space indent, consistent key ordering)

## Issue Routing

- `bug` -- example contains incorrect fields, invalid values, or fails schema validation
- `enhancement` -- request for new example scenarios, additional category coverage, or SDK snippets
- `question` -- clarification about example structure or how to use examples in integration

## Validating Examples

```bash
# Install ajv-cli
npm install -g ajv-cli

# Validate a single offer
ajv validate -s ../schema/json-schema/offer-schema-v0.1.json -d http/notion-offer.json

# Validate all offers
for f in http/*-offer.json; do
  ajv validate -s ../schema/json-schema/offer-schema-v0.1.json -d "$f"
done
```

## Code of Conduct

By participating in this project, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).
