# AgentOffer Examples

Practical request, response, and integration examples for teams implementing AgentOffer Protocol.

## What Is Included

- `http/offer-query-request.json` structured query request for `POST /v1/offers/query`
- `http/offer-response.json` `offer response` envelope example
- `http/notion-offer.json` **minimal** SaaS offer example — REQUIRED + RECOMMENDED fields only (TeamFlow Team Plan)
- `http/product-offer.json` consumer electronics offer example (Aurex Nova Pro earbuds)
- `http/content-offer.json` education offer example (AI course)
- `http/offline-service-offer.json` travel & hospitality offer example (Manhattan hotel)
- `http/financial-service-offer.json` financial service offer example (Atlas Rewards credit card)
- `http/entertainment-offer.json` entertainment offer example with `app_deep_link` action (Arcadia Online game)
- `sdk/` reserved for future SDK snippets
- `agents/` reserved for future agent integration examples

## How To Use This Repository

- Start from `http/offer-query-request.json` to understand the structured query model
- Start from `http/notion-offer.json` to see the minimum viable `offer` (only REQUIRED + RECOMMENDED fields)
- See `http/product-offer.json` for a full offer with all OPTIONAL fields
- Use `http/offer-response.json` to understand query results and `trace_id`
- Compare the payloads with the normative documents in `agentoffernetwork/protocol`
- Use `agentoffernetwork/schema` when you need machine validation

## Protocol Surfaces

The examples cover three different protocol surfaces:

- **Query request** (`offer-query-request.json`): structured POST body with `context`, `intent`, and `pagination`
- **Offer object** (per-category JSON files): the canonical `offer` unit with REQUIRED/RECOMMENDED/OPTIONAL field levels (RFC 2119)
- **Query response** (`offer-response.json`): the envelope that wraps returned offers with query-scoped metadata

## Offer Category Coverage

The offer examples cover all six registered category types:

| File | offer_type | category.type | action.type | Notes |
|------|-----------|---------------|-------------|-------|
| `notion-offer.json` | online_service | software_saas | web_redirect | **Minimal** — REQUIRED + RECOMMENDED fields only |
| `product-offer.json` | physical_product | electronics | web_redirect | Full offer with all OPTIONAL fields |
| `content-offer.json` | content | education | web_redirect | Full offer with `requires_auth: true` |
| `offline-service-offer.json` | offline_service | travel_hospitality | web_redirect | Full offer with `commission.model: "cpa"` |
| `financial-service-offer.json` | online_service | financial_service | web_redirect | Full offer with regulatory attributes |
| `entertainment-offer.json` | online_service | entertainment (game) | app_deep_link | Full offer with deep link action |

## Current Model Snapshot

All offer examples follow the RFC 2119 requirement level model:

**REQUIRED**: `uuid`, `version`, `offer_info` (title, offer_type, category.type, description), `entity`, `action`

**RECOMMENDED** (field present, value may be empty): `material[]`, `category.attributes`, `category.commercial`

**OPTIONAL**: `targeting`, `commission`, `conversion_rule`, `frequency_capping`, `tags`, `priority`, `status`, `audit_status`

## Status

- Version: `v0.1`
- Status: `Draft`
