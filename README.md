# AgentOffer Examples

Canonical HTTP payloads for AgentOffer integrations.

## Current contract

Choose the flow you are implementing. The `v1.0/` directory carries the
release boundary while current example filenames remain stable and
unversioned. These payloads do not claim deployment or runtime availability.

## Start here

- [Query request and response](v1.0/http/offer-query.json)
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
