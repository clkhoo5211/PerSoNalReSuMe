#!/bin/bash
# Run from inside the cloned PerSoNalReSuMe.wiki folder

cat > Home.md << 'ENDOFFILE'
# 👋 Welcome to the PerSoNalReSuMe Wiki

> **Live site →** https://clkhoo5211.github.io/PerSoNalReSuMe/
> **Repository →** https://github.com/clkhoo5211/PerSoNalReSuMe

This wiki is the single source of truth for everything about Khoo Cheng Long's personal portfolio — architecture decisions, content guides, deployment steps, and customisation notes.

---

## 📚 Table of Contents

| Page | Description |
|------|-------------|
| [🏗️ Architecture](Architecture) | Tech stack, folder structure, routing |
| [🎨 Day Themes](Day-Themes) | 7 rotating daily design themes |
| [🖼️ Project Animations](Project-Animations) | Per-project canvas animation guide |
| [✍️ Blog Posts](Blog-Posts) | How to add / edit blog content |
| [🚀 Deployment](Deployment) | Build, deploy to GitHub Pages |
| [⚙️ Configuration](Configuration) | EmailJS, Giscus, TipJar wallet setup |
| [🗺️ Roadmap](Roadmap) | Planned features & known issues |

---

## ⚡ Quick Start

```bash
git clone https://github.com/clkhoo5211/PerSoNalReSuMe.git
cd PerSoNalReSuMe
npm install
npm run dev        # http://localhost:5173
```

## 🛠️ Stack at a Glance

| Layer | Tech |
|-------|------|
| Framework | React 19 + Vite 8 |
| Animation | Framer Motion + Canvas 2D RAF |
| Routing | React Router v7 (HashRouter) |
| Styling | Plain CSS + CSS custom properties |
| Comments | Giscus (GitHub Discussions) |
| Hosting | GitHub Pages (gh-pages branch) |
ENDOFFILE

cat > Architecture.md << 'ENDOFFILE'
# 🏗️ Architecture

## Folder Structure

```
src/
├── components/
│   ├── BackgroundCanvas.jsx   # Interactive daily background (7 scenes)
│   ├── ProjectCardCanvas.jsx  # Per-project canvas animations (19 unique)
│   ├── Hero.jsx / Hero.css
│   ├── About.jsx / About.css  # Timeline, Skills, Education, Competencies
│   ├── Projects.jsx
│   ├── ProjectCard.jsx
│   ├── ProjectDetail.jsx
│   ├── ProjectMediaViewer.jsx
│   ├── Blog.jsx / BlogDetail.jsx
│   ├── Contact.jsx
│   ├── LinkTree.jsx
│   ├── Navbar.jsx
│   ├── GiscusComments.jsx
│   └── TipJar.jsx
├── data/
│   ├── profile.js     # Personal info, experience, education, skills
│   ├── projects.js    # All 19 projects with metadata
│   ├── dayThemes.js   # 7 daily colour themes + canvas palettes
│   └── blog.json      # Blog post content
├── styles.css
└── App.jsx
public/
├── blog.json
└── CL_Khoo_Resume.pdf
```

## Routing

Uses **HashRouter** — all URLs are `/#/path`.

| Route | Component |
|-------|-----------|
| `/#/` | HomePage (all sections) |
| `/#/projects/:id` | ProjectDetail |
| `/#/blog/:id` | BlogDetail |
| `/#/tip` | TipJar |
| `/#/links` | LinkTree |

> ⚠️ Never use `<a href="#section">` for in-page anchors — HashRouter treats these as route paths and blanks the page. Always use `element.scrollIntoView()` instead.

## Theme System

Two independent axes:

1. **Light / Dark** — toggled by user, stored in `localStorage`, applies `body.light` class.
2. **Day Theme** — auto-selected by `new Date().getDay()`, injects CSS custom property overrides onto `:root`.

## Canvas Architecture

- `BackgroundCanvas` — fixed full-viewport, z-index 0, pointer-events none, 30fps RAF loop.
- `ProjectCardCanvas` — per-card, 28fps RAF loop, keyed by `project.id`.
- Glow via `globalCompositeOperation = 'lighter'` (cheaper than shadowBlur).
- Motion blur via low-alpha `fillRect` clear each frame.

## Performance Rules

| Rule | Reason |
|------|--------|
| `contain: layout style` on accordion items | Prevents reflow propagating up |
| Only `transform + opacity` animated | Compositor thread — no CPU repaint |
| No `filter: drop-shadow` on emoji | Triggers full GPU layer rasterisation |
| No `height: auto` in Framer Motion | Forces layout recalc → white flash |
| Body fallback `background: #080c14` | No white flash before canvas paints |
ENDOFFILE

cat > Day-Themes.md << 'ENDOFFILE'
# 🎨 Day Themes

The portfolio automatically switches its colour scheme every day of the week, defined in `src/data/dayThemes.js`.

## Theme Schedule

| Day | Index | Name | Primary Colour | Canvas Scene |
|-----|-------|------|----------------|-------------|
| Sunday | 0 | Deep Space | Purple `#a78bfa` | Star gravity + supernova on click |
| Monday | 1 | Blueprint | Cyan `#38bdf8` | Grid nodes + ripple on click |
| Tuesday | 2 | Neon Dusk | Violet `#818cf8` | Orbs with mouse repulsion |
| Wednesday | 3 | Emerald Grid | Green `#34d399` | Matrix code rain + heat field |
| Thursday | 4 | Solar Flare | Amber `#fbbf24` | Particle storm + magnetic deflection |
| Friday | 5 | Neon Coral | Rose `#f472b6` | Fountain follows cursor + fireworks |
| Saturday | 6 | Aurora Weekend | Teal `#2dd4bf` | Aurora waves + amplitude spike |

## How It Works

```js
export function getTodayTheme(dayOverride) {
  const d = dayOverride ?? new Date().getDay();
  return DAY_THEMES[d];
}
```

`App.jsx` applies `theme.css` to `document.documentElement.style` on mount.

## Theme Object Structure

```js
{
  day: 'Monday',
  name: 'Blueprint',
  emoji: '🔷',
  css: {
    '--primary': '#38bdf8',
    '--secondary': '#818cf8',
  },
  canvas: { bg: '#020c1a', c1: '#38bdf8', c2: '#818cf8', c3: '#2dd4bf', c4: '#0ea5e9' }
}
```

## Mouse Interactions Per Scene

| Scene | Mouse Move | Click |
|-------|-----------|-------|
| Deep Space | Stars attracted to cursor | Supernova shockwave + 50 particles |
| Blueprint | Nodes light up near cursor | Ripple wave |
| Neon Dusk | Orbs repelled from cursor | Spawn new orb |
| Emerald Grid | Heat field parts code rain | Column clear |
| Solar Flare | Lorentz magnetic deflection | Solar flare burst |
| Neon Coral | Fountain emitter follows cursor | 60-spark fireworks |
| Aurora Weekend | Y=amplitude, X=phase shift | Amplitude spike |

## Dev Override

To force a specific theme during development, pass a day index to `getTodayTheme(3)` in `App.jsx`.
ENDOFFILE

cat > Project-Animations.md << 'ENDOFFILE'
# 🖼️ Project Animations

Every project card has a unique canvas animation keyed by `project.id` in `src/components/ProjectCardCanvas.jsx`.

## Full Animation Map

### Web3
| Project ID | Animation |
|------------|-----------|
| `trading-platform` | Live candlestick chart + volume histogram |
| `crypto-exchange` | Animated order book — bids/asks with moving quantities |
| `icp-dapp` | ICP subnet topology — rotating node connections with data pulses |
| `nft-marketplace` | NFT gallery cards with shimmer reveal + bid counter |
| `mywallet` | Balance gauge + scrolling transaction history + QR pulse |
| `blockchain-ecommerce` | Product → cart → chain confirmation flow |
| `smart-contracts` | Solidity code with syntax-highlighted typewriter effect |

### AI
| Project ID | Animation |
|------------|-----------|
| `ai-trading-signal` | Radar sweep + confidence meter + signal bars |
| `ai-smart-contract-auditor` | Code scan beam + vulnerability alert badges |
| `ai-blockchain-analytics` | Dashboard — animated charts, metrics, heatmap |
| `news-mcp` | Neural net bg + 5-stage MCP pipeline + live scrolling feed + typewriter |

### FullStack
| Project ID | Animation |
|------------|-----------|
| `erp-system` | Module flowchart — HR, Finance, Inventory, CRM nodes |
| `mobile-apps` | Phone wireframe + animated UI screen transitions |
| `traditional-ecommerce` | Store front → product listing → checkout funnel |
| `rewarding-system` | Points counter + tier progress ring + badge unlock |
| `shopping-cart` | Cart add/remove animation + total price ticker |
| `kopitiam-system` | QR order → kitchen display → served status flow |
| `invoicing-system` | Invoice generator — line items, tax, PDF stamp |
| `super-app` | App icons orbiting a central logo |

## Adding a New Animation

```js
// 1. Write the function
function drawMyProject(ctx, w, h, t) {
  // t increments +0.18 per frame (28fps)
  // Math.sin(t * 0.05) = slow oscillation
  // (t * 0.008) % 1   = 0→1 loop over ~7s
}

// 2. Register it
const DRAW_FN = {
  'my-project-id': drawMyProject,
};
```

## Performance Tips

| Tip | Why |
|-----|-----|
| `globalCompositeOperation = 'lighter'` | Additive glow without shadowBlur |
| `fillStyle = 'rgba(0,0,0,0.18)'; fillRect(...)` | Motion blur — cheaper than clearRect |
| Keep `t` multiplier ≤ 0.08 | Cinematic speed, not jittery |
| Always reset `ctx.globalAlpha = 1` | Prevent fade leaking into next draw |
ENDOFFILE

cat > Blog-Posts.md << 'ENDOFFILE'
# ✍️ Blog Posts

Blog content is in `public/blog.json` — loaded at runtime, **no rebuild needed** to add posts.

## Adding a Post

```json
{
  "id": "my-post-slug",
  "title": "Post Title Here",
  "excerpt": "1–2 sentence teaser shown on the blog list.",
  "date": "2025-06-01",
  "readTime": "5 min read",
  "tags": ["ICP", "Web3"],
  "category": "Web3",
  "featured": false,
  "content": "Full content. Use \\n\\n for paragraph breaks."
}
```

The `id` becomes the URL: `/#/blog/my-post-slug`

## Writing Style (Khazix Writer Voice)

- ☕ Conversational, first-person — like explaining to a friend
- Hook in the first sentence (question, surprise, or personal story)
- Short paragraphs (2–4 sentences max)
- No bullet-point lectures as the main content format
- End with a takeaway or call to action

## Categories

| Category | Use for |
|----------|---------|
| `Web3` | Blockchain, DApps, Solidity, ICP, NFTs |
| `AI` | LLMs, MCP services, automation |
| `FullStack` | React, Node.js, databases, APIs |
| `Career` | Growth, freelancing, remote work |
| `Tutorial` | Step-by-step technical guides |

## Current Posts (20 total)

`building-icp-dapp` · `web3-vs-web2` · `motoko-first-steps` · `nft-marketplace-lessons` · `defi-wallet-ux` · `ai-trading-signals` · `smart-contract-auditing-ai` · `blockchain-analytics-ai` · `mcp-news-aggregator` · `llm-portfolio-assistant` · `react-performance-tips` · `node-microservices` · `postgres-indexing` · `vite-build-optimisation` · `canvas-animations-react` · `freelance-web3-journey` · `remote-work-southeast-asia` · `open-source-contributions` · `learning-solidity-2024` · `deploy-react-github-pages`
ENDOFFILE

cat > Deployment.md << 'ENDOFFILE'
# 🚀 Deployment

## Deploy to GitHub Pages

```bash
npm run build     # outputs to dist/
npm run deploy    # pushes dist/ to gh-pages branch
```

**Live URL:** https://clkhoo5211.github.io/PerSoNalReSuMe/

## Local Development

```bash
npm install
npm run dev    # → http://localhost:5173
```

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | All development — source code |
| `gh-pages` | Auto-generated build — never edit manually |

## Build Output (gzip)

| File | Size |
|------|------|
| index.html | ~0.4 kB |
| index.css | ~11 kB |
| framer-motion chunk | ~44 kB |
| index.js (main) | ~118 kB |
| giscus chunk | ~9 kB |

Total first-load JS: **~172 kB gzip**

## Notes

- `base: '/PerSoNalReSuMe/'` in `vite.config.js` — required for GitHub Pages sub-path
- All routes use `/#/` prefix (HashRouter) — deep links work without a custom 404

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank page after deploy | Check `base` in `vite.config.js` |
| 404 on direct URL | All links must use `/#/` prefix |
| Canvas not visible | Old iOS — falls back to solid background colour |
ENDOFFILE

cat > Configuration.md << 'ENDOFFILE'
# ⚙️ Configuration

## EmailJS (Contact Form)

1. Sign up at https://www.emailjs.com
2. Create a Service → copy **Service ID**
3. Create a Template → copy **Template ID**
4. Account → API Keys → copy **Public Key**

Edit `src/components/Contact.jsx`:
```js
const SERVICE_ID  = 'service_xxxxxxx';
const TEMPLATE_ID = 'template_xxxxxxx';
const PUBLIC_KEY  = 'xxxxxxxxxxxxxxxxx';
```

Template variables to use: `{{from_name}}` `{{from_email}}` `{{subject}}` `{{message}}`

---

## Giscus (Blog Comments)

Edit `src/components/GiscusComments.jsx`:
```jsx
<Giscus
  repo="clkhoo5211/PerSoNalReSuMe"
  repoId="YOUR_REPO_ID"
  category="General"
  categoryId="YOUR_CATEGORY_ID"
  mapping="specific"          // ← must stay "specific" for HashRouter
  term={term || 'general'}
/>
```

Get `repoId` and `categoryId` from https://giscus.app

> **Why `mapping="specific"`?** HashRouter means `window.location.pathname` is always `/PerSoNalReSuMe/`. Using `specific` with the blog post ID as `term` gives each post its own Discussion thread.

---

## TipJar Wallet Addresses

Edit `src/components/TipJar.jsx`:
```js
const WALLETS = [
  { symbol: 'BTC',  address: 'YOUR_BTC_ADDRESS' },
  { symbol: 'ETH',  address: 'YOUR_ETH_ADDRESS' },
  { symbol: 'USDT', address: 'YOUR_USDT_ADDRESS' },
  { symbol: 'ICP',  address: 'YOUR_ICP_ADDRESS' },
];
```

---

## Résumé PDF

Replace `public/CL_Khoo_Resume.pdf` — the Navbar download link serves it automatically.
ENDOFFILE

cat > Roadmap.md << 'ENDOFFILE'
# 🗺️ Roadmap

## ✅ Completed

- [x] React 19 + Vite 8 + HashRouter
- [x] Dark / Light theme with localStorage
- [x] 7 rotating daily design themes (Sun–Sat)
- [x] 7 interactive daily background scenes (mouse + click)
- [x] Experience timeline accordion (no flash)
- [x] Education cards — all 4 levels (University → Primary)
- [x] Tab-switched skills + animated chips
- [x] Core competencies mosaic with hover descriptions
- [x] 19 unique per-project canvas animations
- [x] Quick-view modal + detail pages (correct animation each)
- [x] 3 AI projects + 7 FullStack projects added
- [x] AI News MCP — cinematic animation (neural net + live feed)
- [x] Crypto exchange order book — real-time moving quantities
- [x] 20 blog posts (Khazix writer style)
- [x] Giscus comments with `mapping="specific"` fix
- [x] Quick Links staggered shimmer animations
- [x] Hero CTA buttons — scrollIntoView (HashRouter fix)
- [x] Light theme hero name + tagline visibility fixed
- [x] X.com share button (Twitter rebrand)
- [x] No white flash on load or accordion expand

## 🔜 To Do

- [ ] Real EmailJS credentials in `Contact.jsx`
- [ ] Real wallet addresses in `TipJar.jsx`
- [ ] Real project screenshots/GIFs in `projects.js` `media[]`
- [ ] Google Analytics / Plausible
- [ ] PWA manifest + offline support
- [ ] Markdown rendering for blog post content
- [ ] Project case-study PDFs
- [ ] Search + tag filter on blog

## 🐛 Known Issues

| Issue | Status |
|-------|--------|
| Giscus requires GitHub login | By design |
| Canvas invisible on very old iOS | Falls back to solid bg colour |
| Day badge may overlap nav on <360px screens | Fix planned |
ENDOFFILE

echo "✅ All wiki pages written."
git add .
git commit -m "docs: full wiki — architecture, day themes, animations, blog, deployment, config, roadmap"
git push origin master
echo "✅ Wiki pushed to GitHub!"
