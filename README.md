<p align="center">
  <h1 align="center">AgentOffer Examples</h1>
  <p align="center">
    Practical request, response, and integration examples for <a href="https://github.com/agentoffernetwork/protocol">AgentOffer Protocol</a>.
  </p>
</p>

<p align="center">
  <a href="https://www.apache.org/licenses/LICENSE-2.0"><img src="https://img.shields.io/badge/license-Apache--2.0-blue.svg" alt="License" /></a>
  <a href="#status"><img src="https://img.shields.io/badge/version-v0.1-orange.svg" alt="Version" /></a>
  <a href="#status"><img src="https://img.shields.io/badge/status-Draft-yellow.svg" alt="Status" /></a>
  <a href="https://github.com/agentoffernetwork/examples/issues"><img src="https://img.shields.io/github/issues/agentoffernetwork/examples.svg" alt="Issues" /></a>
</p>

---

## Quick Start

1. Start with [`offer-query-request.json`](http/offer-query-request.json) to understand how agents search for offers
2. Look at [`notion-offer.json`](http/notion-offer.json) for a minimal offer (REQUIRED + RECOMMENDED fields only)
3. Compare with [`product-offer.json`](http/product-offer.json) for a full offer with all OPTIONAL fields
4. See [`offer-response.json`](http/offer-response.json) for the query response envelope

## What's Inside

### HTTP Examples

| File | Category | Action | Notes |
|------|----------|--------|-------|
| [`notion-offer.json`](http/notion-offer.json) | software_saas | web_redirect | **Minimal** -- REQUIRED + RECOMMENDED only |
| [`product-offer.json`](http/product-offer.json) | electronics | web_redirect | Full offer with all OPTIONAL fields |
| [`content-offer.json`](http/content-offer.json) | education | web_redirect | Includes `requires_auth: true` |
| [`offline-service-offer.json`](http/offline-service-offer.json) | travel_hospitality | web_redirect | CPA commission model |
| [`financial-service-offer.json`](http/financial-service-offer.json) | financial_service | web_redirect | Regulatory attributes |
| [`entertainment-offer.json`](http/entertainment-offer.json) | entertainment | app_deep_link | Deep link action type |
| [`offer-query-request.json`](http/offer-query-request.json) | -- | -- | Structured query with intent + context |
| [`offer-response.json`](http/offer-response.json) | -- | -- | Response envelope with trace_id |

### SDK Examples (coming soon)

Code snippets showing how to use the [TypeScript SDK](https://www.npmjs.com/package/@agentoffernetwork/sdk) and [Python SDK](https://pypi.org/project/agentoffernetwork/) in real agent integrations.

### Agent Workflow Examples (coming soon)

End-to-end examples showing agents using AON for offer discovery, recommendation, and attribution tracking.

## Protocol Surfaces

These examples cover three protocol surfaces:

| Surface | File | Description |
|---------|------|-------------|
| **Query Request** | `offer-query-request.json` | Structured POST body with context, intent, and pagination |
| **Offer Object** | Per-category JSON files | Canonical offer unit with RFC 2119 field levels |
| **Query Response** | `offer-response.json` | Envelope wrapping returned offers with query metadata |

## Validating Examples

You can validate any offer example against the official JSON Schema:

```bash
# Install ajv-cli
npm install -g ajv-cli

# Validate an offer
ajv validate \
  -s ../schema/json-schema/offer-schema-v0.1.json \
  -d http/notion-offer.json \
  --spec=draft2020
```

## Related Repositories

| Repository | Purpose |
|------------|---------|
| [`agentoffernetwork/protocol`](https://github.com/agentoffernetwork/protocol) | Human-readable specification |
| [`agentoffernetwork/schema`](https://github.com/agentoffernetwork/schema) | JSON Schema and TypeScript types |
| [`agentoffernetwork/rfcs`](https://github.com/agentoffernetwork/rfcs) | Protocol change proposals |

## Status

- **Version:** `v0.1`
- **Status:** `Draft`

## Contributing

- **New examples** for existing categories -- open a PR
- **Examples for new categories** -- wait for the category to be added via [RFC](https://github.com/agentoffernetwork/rfcs)
- **Bug fixes** in existing examples -- open a PR

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

Licensed under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
