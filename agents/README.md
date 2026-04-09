# Agent Examples

End-to-end examples showing AI agents using AgentOffer Protocol for offer discovery, recommendation, and attribution tracking.

## Status

> **Coming soon.** Agent workflow examples will be added as framework integrations ship.

## Planned Examples

| Example | Framework | Description |
|---------|-----------|-------------|
| Shopping Assistant | LangChain | Agent that searches offers, asks clarifying questions, and presents recommendations |
| Travel Advisor | CrewAI | Multi-agent crew with a researcher and recommender working together |
| MCP Skill Demo | Claude / ChatGPT | Zero-code offer integration via MCP Skill |
| Custom Agent | Raw SDK | Minimal agent loop using the SDK directly |

## How Agents Use AON

```
User: "I need a project management tool for a small team"
  |
  v
Agent calls aon_get_category_schema("software_saas")
  --> Gets decision factors (budget, features, team size)
  |
Agent asks clarifying questions
  |
  v
Agent calls aon_search_offers(query, category, preferences)
  --> Gets ranked offers with tracking URLs
  |
Agent formats and presents recommendations
  |
  v
User clicks an offer link
  --> Agent calls aon_report_click(offer_id, tracking_url)
  --> Attribution tracked, bid earned
```

## Contributing

Want to add an agent example? See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines. Examples should demonstrate a complete user flow from intent to recommendation.
