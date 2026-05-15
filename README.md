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

## Start Here

1. Start with [`offer-query-request.json`](http/offer-query-request.json) to understand how agents search for offers.
2. Read [`offer-response.json`](http/offer-response.json) to see the canonical `request_id` + `offers[]` response envelope.
3. Inspect [`notion-offer.json`](http/notion-offer.json) for a compact software/SaaS offer.
4. Compare [`product-offer.json`](http/product-offer.json) for a fuller offer with optional fields.
5. Use the [Schema](https://github.com/agentoffernetwork/schema) repository to validate any adapted payload.

All examples use placeholder domains and public-safe sample values. Do not place real bearer tokens, partner secrets, or private customer data in example files.

## Choose the Right Surface

AgentOffer has two directions that are easy to mix up:

| Direction | Who sends the request? | Use these examples | Related docs |
|-----------|------------------------|--------------------|--------------|
| Agent-facing Query API | Your agent, app, SDK, or backend calls AON | [`http/offer-query-request.json`](http/offer-query-request.json), [`http/offer-response.json`](http/offer-response.json), per-category offer files | [Query API](https://github.com/agentoffernetwork/protocol/blob/main/specs/query-api.md), [API Reference](https://docs.agentoffernetwork.com/api/offer-query) |
| Partner-facing OfferProvider API | AON calls a Partner-hosted `offer_fetch_url` | [`http/offer-provider/`](http/offer-provider) | [OfferProvider API](https://github.com/agentoffernetwork/protocol/blob/main/specs/offer-provider-api.md), [Partner Integration Guide](https://docs.agentoffernetwork.com/guides/partner-integration) |
| Postback callbacks | AON and Partners report attribution events | [`http/postback/`](http/postback) | [Postback](https://github.com/agentoffernetwork/protocol/blob/main/specs/postback.md) |

If you are building an AI product, start with the Agent-facing Query API. If you are supplying inventory to AON, start with the Partner-facing OfferProvider API.

Query API and OfferProvider examples use `constraints.category_types` for
deterministic constraints. They intentionally do not include lifecycle, bid,
currency, price, brand, or country request constraints; AON returns active
eligible offers by default.

## Examples by Task

| Task | Start with | Related spec | Validate with |
|------|------------|--------------|---------------|
| Build the first Query API request | [`http/offer-query-request.json`](http/offer-query-request.json) | [`query-api.md`](https://github.com/agentoffernetwork/protocol/blob/main/specs/query-api.md) | `offer-query-schema-v0.1.json` |
| Understand the Query API response | [`http/offer-response.json`](http/offer-response.json) | [`query-api.md`](https://github.com/agentoffernetwork/protocol/blob/main/specs/query-api.md) | `offer-schema-v0.1.json` for each `offers[]` item |
| Inspect a minimal offer | [`http/notion-offer.json`](http/notion-offer.json) | [`offer-schema.md`](https://github.com/agentoffernetwork/protocol/blob/main/specs/offer-schema.md) | `offer-schema-v0.1.json` |
| Inspect a full product-style offer | [`http/product-offer.json`](http/product-offer.json) | [`offer-schema.md`](https://github.com/agentoffernetwork/protocol/blob/main/specs/offer-schema.md) | `offer-schema-v0.1.json` |
| Explore category-specific offers | Category files under [`http/`](http) | [`category-taxonomy.md`](https://github.com/agentoffernetwork/protocol/blob/main/specs/category-taxonomy.md) | `offer-schema-v0.1.json` |
| Inspect postback payloads | [`http/postback/`](http/postback) | [`postback.md`](https://github.com/agentoffernetwork/protocol/blob/main/specs/postback.md) | Postback schemas in the schema repo |
| Implement partner offer fetch | [`http/offer-provider/basic-query.json`](http/offer-provider/basic-query.json) | [`offer-provider-api.md`](https://github.com/agentoffernetwork/protocol/blob/main/specs/offer-provider-api.md) | `offer-provider-request-v0.1.json`, `offer-provider-response-v0.1.json` |

## What's Inside

### HTTP Examples

| File | Category | Action | Notes |
|------|----------|--------|-------|
| [`notion-offer.json`](http/notion-offer.json) | software_saas | web_redirect | **Minimal** -- REQUIRED + RECOMMENDED only |
| [`product-offer.json`](http/product-offer.json) | electronics | web_redirect | Full offer with all OPTIONAL fields |
| [`content-offer.json`](http/content-offer.json) | education | web_redirect | Online course content offer |
| [`offline-service-offer.json`](http/offline-service-offer.json) | travel_hospitality | web_redirect | CPA bid model |
| [`financial-service-offer.json`](http/financial-service-offer.json) | financial_service | web_redirect | Regulatory attributes |
| [`entertainment-offer.json`](http/entertainment-offer.json) | entertainment | app_deep_link | Deep link action type |
| [`health-beauty-offer.json`](http/health-beauty-offer.json) | health_beauty | web_redirect | Common attributes example |
| [`fashion-offer.json`](http/fashion-offer.json) | fashion | web_redirect | Common attributes example |
| [`food-grocery-offer.json`](http/food-grocery-offer.json) | food_grocery | web_redirect | Common attributes example |
| [`home-garden-offer.json`](http/home-garden-offer.json) | home_garden | web_redirect | Common attributes example |
| [`automotive-offer.json`](http/automotive-offer.json) | automotive | web_redirect | Common attributes example |
| [`offer-query-request.json`](http/offer-query-request.json) | -- | -- | Structured query with intent + context |
| [`offer-response.json`](http/offer-response.json) | -- | -- | Response envelope with request_id |

### Additional Example Sets

The current repository focuses on **canonical HTTP payload examples** for the current protocol surfaces.

- These examples align with the current canonical 11-category public surface defined in the protocol taxonomy document.
- SDK-specific walkthroughs live with the published SDK packages and [AON Docs](https://docs.agentoffernetwork.com/sdk).
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
| **OfferProvider** | `offer-provider/` | Partner-hosted offer fetch request and response examples |
| **Postback** | `postback/` | Attribution callback examples |

## Validating Examples

### Validate a Query API request body

```bash
npx --yes --package=ajv-cli@5 --package=ajv-formats@3 -- \
  ajv validate \
  -s ../schema/json-schema/offer-query-schema-v0.1.json \
  -d your-query-request.json \
  --spec=draft2020
```

Use the query example as a starting point, then validate the exact request body your integration will send.

### Validate an offer example

```bash
npx --yes --package=ajv-cli@5 --package=ajv-formats@3 -- \
  ajv validate \
  -s ../schema/json-schema/offer-schema-v0.1.json \
  -d http/notion-offer.json \
  --spec=draft2020
```

## Safe Placeholders

| Value type | Use in examples | Do not use |
|------------|-----------------|------------|
| API token | `YOUR_API_KEY` | Real bearer token |
| URL | `https://example.com/...` or product-specific `.example` domains | Private partner URL |
| User identity | `user_pseudo_id`, sample session IDs | Raw email, phone, or customer ID |
| Money | Decimal strings such as `"10.00"` | Locale-formatted strings such as `"$10"` |

## Related Repositories

| Repository | Purpose |
|------------|---------|
| [`agentoffernetwork/protocol`](https://github.com/agentoffernetwork/protocol) | Human-readable specification |
| [`specs/category-taxonomy.md`](https://github.com/agentoffernetwork/protocol/blob/main/specs/category-taxonomy.md) | Current canonical category registry and boundary rules |
| [`agentoffernetwork/schema`](https://github.com/agentoffernetwork/schema) | JSON Schema and TypeScript types |
| [`agentoffernetwork/rfcs`](https://github.com/agentoffernetwork/rfcs) | Protocol change proposals |

## Status

- **Version:** `v0.1`
- **Status:** `Draft`
- **Release posture:** `Public beta for canonical payload examples`

## Contributing

- **New examples** for existing categories -- open a PR
- **Examples for additional future categories** -- wait for the category to be added via [RFC](https://github.com/agentoffernetwork/rfcs)
- **Bug fixes** in existing examples -- open a PR

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

Licensed under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
