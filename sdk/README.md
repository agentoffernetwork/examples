# SDK Examples

Code snippets showing how to use the AgentOffer SDKs in real agent integrations.

## Status

> **Coming soon.** SDK integration examples will be added as the SDKs mature.

## Available SDKs

| SDK | Install | Docs |
|-----|---------|------|
| TypeScript | `npm install @agentoffernetwork/sdk` | [README](https://github.com/agentoffernetwork/sdk) |
| Python | `pip install agentoffernetwork` | [README](https://github.com/agentoffernetwork/sdk) |

## Planned Examples

- **TypeScript:** Search offers, format recommendations, report clicks
- **Python:** Same flow with async/await
- **LangChain:** Use AON as a LangChain Tool in an agent chain
- **CrewAI:** Assign AON tools to a CrewAI agent

## Quick Preview

```typescript
import { initialize } from '@agentoffernetwork/sdk';

const client = await initialize({
  apiKey: 'your-api-key',
  mode: 'mock', // use 'live' for production
});

const { offers } = await client.queryOffers({
  intent: { content: [{ type: 'text', text: 'project management tool' }] },
  limit: 5,
});

for (const offer of offers) {
  console.log(client.formatRecommendation(offer));
}
```

## Contributing

Want to add an SDK example? See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines. Examples should be self-contained and runnable.
