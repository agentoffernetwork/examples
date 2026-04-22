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
  <a href="https://github.com/agentoffernetwork/examples/actions/workflows/validate.yml"><img src="https://github.com/agentoffernetwork/examples/actions/workflows/validate.yml/badge.svg" alt="Validate" /></a>
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
| [`offline-service-offer.json`](http/offline-service-offer.json) | travel_hospitality | web_redirect | CPA bid model |
| [`financial-service-offer.json`](http/financial-service-offer.json) | financial_service | web_redirect | Regulatory attributes |
| [`entertainment-offer.json`](http/entertainment-offer.json) | entertainment | app_deep_link | Deep link action type |
| [`offer-query-request.json`](http/offer-query-request.json) | -- | -- | Structured query with intent + context |
| [`offer-response.json`](http/offer-response.json) | -- | -- | Response envelope with trace_id |

### Additional Example Sets

The current repository focuses on **canonical HTTP payload examples**.

- SDK-specific walkthroughs live with the published SDK packages and docs.
- More end-to-end agent workflow examples are planned as future additions to this repo.

This keeps the v0.1 examples surface honest: what is here today is ready to inspect and validate;
what is not yet here is intentionally called out as future work rather than implied availability.

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
# Validate an offer with temporary tooling (no local install required)
npx --yes --package=ajv-cli@5 --package=ajv-formats@3 -- \
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
- **Release posture:** `Public beta for canonical payload examples`

## Contributing

- **New examples** for existing categories -- open a PR
- **Examples for new categories** -- wait for the category to be added via [RFC](https://github.com/agentoffernetwork/rfcs)
- **Bug fixes** in existing examples -- open a PR

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

Licensed under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
