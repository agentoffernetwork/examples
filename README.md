# AgentOffer Examples

Canonical HTTP payloads for AgentOffer integrations.

## Current contract

Choose the flow you are implementing. The `v0.3/` directory carries the
release boundary while current example filenames remain stable and
unversioned. These payloads do not claim deployment or runtime availability.

## Start here

- [Query request and response](v0.3/http/offer-query.json)
- [Hosted query response](v0.3/http/offer-query-hosted-response.json)
- [Offer control](v0.3/http/offer-control.json)
- [Provider Postback success](v0.3/http/postback/partner/basic-conversion.http)
- [Provider Postback rejection](v0.3/http/postback/partner/invalid-unknown-field.http)
- [Agent Postback success](v0.3/http/postback/agent/basic-conversion.http)
- [Agent Postback retry sequence](v0.3/http/postback/agent/retry-scenario.http)
- [OfferProvider HMAC signing vectors](v0.3/http/offer-provider/hmac-signing-cases.md)
- [Contract schemas](https://github.com/agentoffernetwork/schema)
- [Agent and Partner guides](https://github.com/agentoffernetwork/protocol)

## Historical contracts

Historical v0.1 and v0.2 material is retained outside `main` on
`legacy/v0.1` and `legacy/v0.2`. Use the immutable `v0.1.0-legacy` and
`v0.2.0-legacy` tags for durable references.

## Safe placeholder rules

- Use `.example` domains and synthetic identifiers.
- Never commit real bearer tokens, callback secrets, user email addresses, or
  phone numbers.
- Use decimal strings where the protocol schema requires decimal strings.

Licensed under [Apache License 2.0](LICENSE).
