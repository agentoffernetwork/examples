# AgentOffer Examples

Canonical HTTP payloads for AgentOffer integrations.

## Current contract

Choose the flow you are implementing. The `v1.0/` directory carries the
release boundary while current example filenames remain stable and
unversioned. These payloads do not claim deployment or runtime availability.

## Start here

- [Query request and response](v1.0/http/offer-query.json)
- [Empty Query with independent alternative Offers](v1.0/http/offer-query-alternative-offers.json)
- [Partner Offer artifact](v1.0/http/offer-partner.json)
- [Offer control](v1.0/http/offer-control.json)
- [OfferProvider request](v1.0/http/offer-provider/request.json)
- [OfferProvider success](v1.0/http/offer-provider/success.json)
- [Provider Postback success](v1.0/http/postback/partner/basic-conversion.http)
- [Provider Postback rejection](v1.0/http/postback/partner/invalid-unknown-field.http)
- [Agent Postback success](v1.0/http/postback/agent/basic-conversion.http)
- [Agent Postback retry sequence](v1.0/http/postback/agent/retry-scenario.http)
- [OfferProvider HMAC signing vectors](v1.0/http/offer-provider/hmac-signing-cases.md)
- [Contract schemas](https://github.com/agentoffernetwork/schema)
- [Agent and Partner guides](https://github.com/agentoffernetwork/protocol)

The Query response example includes one optional
`offer_info.commercial.display_price` presentation value. Consumers overlay its
`amount` and `currency` onto the original `price` only for display; Partner and
OfferProvider supply examples intentionally omit the response-owned field.

The alternative example is **synthetic conformance data**, derived from the
complete Generic Hotel Offer in the main Query example. Its request searches
for an astronomy bookshop without explicit category constraints; its response
keeps `offers: []` and `empty_reason`, removes `match_reason`, and places the
Hotel in a separate `alternative_offers` entry. It also removes the original
static recommendation copy, which referred to the original hotel request.
`thinking_mode=false` intentionally retains the required `selection_reason`.

The example assumes a known United States viewer, genuine current same-country
popularity and qualified inventory solely to illustrate the wire shape. None
of those external facts is encoded or proven by this fixture, and neither
response language nor display currency establishes country. It is not an
observed runtime response or evidence of recommendation quality, inventory,
eligibility, service/SDK/Agent support, or actual display. The `request` and
`response` wrapper keys are for illustration: validate each child against its
own schema; the wrapper is not a Query response envelope.

Alternatives are optional (omit when unavailable), contain 1–3 unique stable
Offers, and only accompany `below_relevance_threshold` or `no_material`.
Each closed entry requires `basis: "regional_popularity"`, a truthful
`selection_reason` of 1–500 Unicode code points with a non-whitespace character,
and a complete Generic Offer without `match_reason`. Existing requests and
`force_offer` behavior remain unchanged. Old closed readers can reject the new
field and permissive readers can discard it; upgrade consumers before enabling
producers. See the [normative Query rules](https://github.com/agentoffernetwork/protocol/blob/main/v1.0/specs/query-api.md#optional-alternative-offers)
for explicit constraints, real gates, and Catalog/placement, Browse and sandbox
isolation. Main results, counts, engagement and Hook subjects are not redefined.

Hosted deployment responses are runtime-owned projections and are not published
as canonical examples in this repository.

## Provenance

Earlier releases remain available from immutable refs for audit and recovery.
They are not alternate current example paths.

## Safe placeholder rules

- Use `.example` domains and synthetic identifiers.
- Never commit real bearer tokens, callback secrets, user email addresses, or
  phone numbers.
- Use decimal strings where the protocol schema requires decimal strings.

Licensed under [Apache License 2.0](LICENSE).
