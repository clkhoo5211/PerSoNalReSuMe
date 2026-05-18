# 🖼️ Project Animations

Every project card renders a unique canvas animation keyed by `project.id`. These run in `src/components/ProjectCardCanvas.jsx` at 28fps.

## Animation Map (19 Projects)

### Web3 Category

| Project ID | Title | Animation |
|------------|-------|-----------|
| `trading-platform` | Blockchain Trading Platform | Live candlestick chart — OHLC bars + volume histogram, price ticker |
| `crypto-exchange` | Crypto Exchange | Animated order book — bids/asks with real-time quantity fluctuation |
| `icp-dapp` | ICP DApp | ICP subnet topology — animated rotating node connections with data pulses |
| `nft-marketplace` | NFT Marketplace | NFT gallery cards with shimmer reveal + bid counter |
| `mywallet` | MyWallet | Balance gauge + scrolling transaction history + QR code pulse |
| `blockchain-ecommerce` | Blockchain E-Commerce | Product → cart → chain confirmation flow animation |
| `smart-contracts` | Smart Contracts | Solidity code editor with syntax-highlighted typewriter effect |

### AI Category

| Project ID | Title | Animation |
|------------|-------|-----------|
| `ai-trading-signal` | AI Trading Signal | Radar sweep + confidence meter + signal strength bars |
| `ai-smart-contract-auditor` | AI Smart Contract Auditor | Code scan beam + vulnerability alert badges popping up |
| `ai-blockchain-analytics` | AI Blockchain Analytics | Dashboard — animated charts, live metrics, hexagonal heatmap |
| `news-mcp` | AI News App with MCP | Neural net background + 5-stage MCP pipeline + live scrolling feed with typewriter |

### FullStack Category

| Project ID | Title | Animation |
|------------|-------|-----------|
| `erp-system` | ERP System | Module flowchart — HR, Finance, Inventory, CRM nodes with live data flow |
| `mobile-apps` | Mobile Apps | Phone wireframe + animated UI screen transitions |
| `traditional-ecommerce` | Traditional E-Commerce | Store front → product listing → checkout funnel |
| `rewarding-system` | Rewards System | Points counter + tier progress ring + badge unlock |
| `shopping-cart` | Shopping Cart Engine | Cart add/remove animation + total price ticker |
| `kopitiam-system` | Kopitiam Pipeline | QR order → kitchen display → served status flow |
| `invoicing-system` | Invoicing System | Invoice generator — line items, tax calc, PDF stamp |
| `super-app` | Super App Platform | App icons orbiting a central logo with ripple effects |

## Adding a New Project Animation

### Step 1 — Write the draw function

```js
// src/components/ProjectCardCanvas.jsx

function drawMyProject(ctx, w, h, t) {
  // ctx = Canvas2D rendering context
  // w, h = canvas pixel dimensions
  // t   = frame counter (increments +0.18 per frame at 28fps)
  //       use Math.sin(t * 0.05) for slow oscillation
  //       use (t * 0.008) % 1 for 0→1 loop over ~7 seconds

  // 1. Paint background
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, w, h);

  // 2. Draw your animation...
}
```

### Step 2 — Register in DRAW_FN map

```js
const DRAW_FN = {
  // ... existing entries
  'my-project-id': drawMyProject,
};
```

### Step 3 — Add project to projects.js

```js
{
  id: 'my-project-id',   // must match DRAW_FN key
  title: 'My Project',
  category: 'FullStack',
  // ...
}
```

## Performance Tips

| Tip | Why |
|-----|-----|
| Use `globalCompositeOperation = 'lighter'` for glow | Additive blending — no `shadowBlur` needed |
| Motion blur: `fillStyle = 'rgba(0,0,0,0.18)'; fillRect(...)` | Cheaper than `clearRect` + repainting everything |
| Avoid `shadowBlur` in tight loops | Triggers GPU rasterisation every frame |
| Keep `t` multiplier small (`* 0.05`) | Cinematic slow speed, not jittery fast |
| Use `roundRect()` helper | Already defined at top of file |
| Check `ctx.globalAlpha` resets | Always restore to `1` after fade effects |
