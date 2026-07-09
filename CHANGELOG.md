# Changelog

All notable changes to the AgentOffer Examples will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0] - 2026-03-28

### Added

- Query request example (`offer-query-request.json`)
- Query response envelope example (`offer-response.json`)
- Offer examples for all 6 category types:
  - `notion-offer.json` (software_saas, minimal)
  - `product-offer.json` (electronics, full)
  - `content-offer.json` (education)
  - `offline-service-offer.json` (travel_hospitality)
  - `financial-service-offer.json` (financial_service)
  - `entertainment-offer.json` (entertainment, app_deep_link)

## [0.1.1] - 2026-04-23

### Added

- Offer examples for the 5 newly canonical categories:
  - `health-beauty-offer.json`
  - `fashion-offer.json`
  - `food-grocery-offer.json`
  - `home-garden-offer.json`
  - `automotive-offer.json`

### Changed

- Expanded example coverage from 6 to 11 canonical categories

### Status

- Version: `v0.1`
- Status: `Draft`

## [Unreleased]

### Added

- Adult entertainment and iGaming examples for AON Taxonomy v1 sensitive
  category coverage:
  - `adult-entertainment-offer.json`
  - `igaming-offer.json`
- `offer_info.tags` in the query response example to demonstrate
  partner-supplied content matching hints.
- Top-level `content_language` in canonical offer examples to demonstrate
  BCP 47 content-language metadata separate from targeting language.
- Location Search API examples for text search, exact lookup, country-code
  migration, and Query API `location_ids` chain construction.
- Location resolve examples for ISO 3166-2 subdivision codes, Cloudflare
  visitor location headers, and Google Cloud Load Balancing location headers.
- Consumer action examples for `purchase`, `pay`, and `order` semantic
  boundaries.

### Changed

- Migrated offer examples from legacy `category.type + attributes.sub_type` to
  AON Taxonomy v1 `offer_info.category.id`.
- Migrated Query and OfferProvider examples from `constraints.category_types`
  to `constraints.category_ids`.
- Updated Query, adult entertainment, and financial service examples to use
  AON Location Registry v1 `location_id` values and age threshold eligibility
  fields.
