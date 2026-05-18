# ✍️ Blog Posts

Blog content lives in `public/blog.json`. It is loaded asynchronously at runtime — **no rebuild required** to add new posts.

## Adding a New Post

Open `public/blog.json` and add a new entry to the array:

```json
{
  "id": "my-new-post",
  "title": "Why I Switched to ICP for My DApp",
  "excerpt": "A short teaser — 1–2 sentences shown on the blog list card.",
  "date": "2025-06-01",
  "readTime": "5 min read",
  "tags": ["ICP", "Web3", "Motoko"],
  "category": "Web3",
  "featured": false,
  "content": "Full content goes here. Use \\n\\n for paragraph breaks."
}
```

The `id` becomes the URL: `/#/blog/my-new-post`

## Writing Style (Khazix Writer Voice)

All posts use a **conversational, first-person** voice — no bullet-point lectures.

- ☕ Write like explaining to a friend over coffee
- Hook the reader in the first sentence — a question, surprise, or personal story
- Short paragraphs (2–4 sentences max)
- Code snippets welcome — keep them brief and copy-paste ready
- End with a takeaway or call to action
- **Avoid:** passive voice, corporate jargon, bullet lists as the main content vehicle

## Categories

| Category | Use for |
|----------|---------|
| `Web3` | Blockchain, DApps, Solidity, ICP, NFTs, tokens |
| `AI` | LLMs, MCP services, automation, neural nets |
| `FullStack` | React, Node.js, databases, REST/GraphQL APIs |
| `Career` | Personal growth, freelancing, remote work, mindset |
| `Tutorial` | Step-by-step technical how-to guides |

## Featured Posts

Set `"featured": true` to pin the post to the hero spotlight on the Blog page. Keep to 1–2 featured posts at a time.

## Existing Posts (20 total)

| # | ID | Category |
|---|----|----------|
| 1 | `building-icp-dapp` | Web3 |
| 2 | `web3-vs-web2` | Web3 |
| 3 | `motoko-first-steps` | Web3 |
| 4 | `nft-marketplace-lessons` | Web3 |
| 5 | `defi-wallet-ux` | Web3 |
| 6 | `ai-trading-signals` | AI |
| 7 | `smart-contract-auditing-ai` | AI |
| 8 | `blockchain-analytics-ai` | AI |
| 9 | `mcp-news-aggregator` | AI |
| 10 | `llm-portfolio-assistant` | AI |
| 11 | `react-performance-tips` | FullStack |
| 12 | `node-microservices` | FullStack |
| 13 | `postgres-indexing` | FullStack |
| 14 | `vite-build-optimisation` | FullStack |
| 15 | `canvas-animations-react` | FullStack |
| 16 | `freelance-web3-journey` | Career |
| 17 | `remote-work-southeast-asia` | Career |
| 18 | `open-source-contributions` | Career |
| 19 | `learning-solidity-2024` | Tutorial |
| 20 | `deploy-react-github-pages` | Tutorial |
