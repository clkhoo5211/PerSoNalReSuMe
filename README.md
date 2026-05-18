# PerSoNalReSuMe — Personal Portfolio

> A modern personal profile + portfolio + linktree site built with React, Remotion, and Framer Motion. Auto-deployed to GitHub Pages with live AI news feed.

**Live site:** https://clkhoo5211.github.io/PerSoNalReSuMe/

---

## Features

| Feature | Details |
|---|---|
| 🎨 Design system | Navy/cyan/purple design tokens from DESIGN.md spec |
| 🌙 Dark / Light mode | Persistent via localStorage |
| 🤖 Remotion animations | Animated project cards using `@remotion/player` |
| 📰 AI news feed | Live feed from AIHot / HackerNews Algolia with SWR background refresh (无感刷新) |
| 🔗 LinkTree | Data-driven social links section |
| 🚀 Projects | Filterable project grid with category tags and modal detail views |
| 📝 Blog | Blog post list with modal detail view |
| 📬 Contact | Form with validation |
| ✨ Animations | Framer Motion scroll-triggered reveal animations throughout |
| 📱 Responsive | Mobile (hamburger nav), tablet, desktop |
| ⚙️ GitHub Actions | Auto-deploy on push + news data baked every 6h |

---

## Quick Start

```bash
npm install
npm run dev          # development server
npm run build        # production build → dist/
npm run preview      # preview production build
```

---

## Adding a New Project

Edit **`src/data/projects.js`** and append one object to the array:

```js
{
  id: 'my-new-project',          // unique kebab-case id
  title: 'My New Project',
  category: 'AI',                // 'AI' | 'Web3' | 'FullStack'
  status: 'Live',                // 'Live' | 'Beta' | 'Open Source'
  description: 'What it does.',
  tech: ['React', 'Claude API'],
  liveUrl: 'https://...',
  sourceUrl: 'https://github.com/...',
  media: [],
  featured: true,
}
```

The project grid re-renders automatically — no other files need changing.

---

## Customising Your Profile

Edit **`src/data/profile.js`**:

- `name`, `title`, `bio`, `location` — basic info
- `taglines[]` — hero typing effect cycles through these
- `social[]` — icon + URL pairs for social links
- `links[]` — linktree links (set `primary: true` for the highlighted CTA button)
- `skills{}` — category → skill array for the skills grid
- `experience[]` — timeline items

---

## Architecture

```
src/
  components/
    Navbar.jsx / .css        — sticky nav, active section highlight, theme toggle
    Hero.jsx / .css          — hero section with typing effect + particle field
    ParticleField.jsx        — canvas-based animated particle background
    About.jsx / .css         — bio, experience timeline, skills grid
    LinkTree.jsx / .css      — linktree-style quick links
    Projects.jsx / .css      — filterable project grid
    ProjectCard.jsx / .css   — individual card with Remotion Player + modal
    Blog.jsx / .css          — blog post list + modal
    NewsFeed.jsx / .css      — AI news with SWR polling + ticker + card grid
    Contact.jsx / .css       — contact form + social links
    Footer.jsx / .css        — footer
    Modal.jsx                — reusable modal wrapper
    remotion/
      ProjectAnimation.jsx   — Remotion animation composition for project cards
  data/
    profile.js               — all personal info
    projects.js              — projects array + categories
    blog.js                  — blog posts array
  hooks/
    useIntersectionObserver.js
    useNewsCache.js
  styles.css                 — global design tokens + utility classes
  App.jsx                    — root: theme state, section layout
  main.jsx                   — React entry point
public/
  news.json                  — baked by GitHub Actions every 6h
.github/workflows/
  deploy.yml                 — build + deploy to GitHub Pages on push
  fetch-news.yml             — cron: fetch AI news → commit news.json every 6h
```

---

## AI News Feed — How It Works (无感刷新)

Three-tier strategy:
1. **Same-origin `public/news.json`** — baked by GH Actions every 6h, zero CORS
2. **aihot.virxact.com** — AI-specific curated news fallback
3. **HackerNews Algolia** — free, no key, guaranteed CORS-safe

SWR: `refreshInterval: 5min`, `fallbackData` from localStorage cache.

---

## Design Tokens

| Token | Value |
|---|---|
| `--primary` | `#00D4FF` |
| `--secondary` | `#6366F1` |
| `--navy-900` | `#0F172A` |
| Font | Inter, JetBrains Mono |
| Breakpoints | 767px / 1199px / 1200px+ |

---

## Roadmap

- [ ] Replace placeholder data with real info
- [ ] Add real project media (videos, GIFs)
- [ ] Wire up contact form (Formspree / EmailJS)
- [ ] PDF pitch deck embedding (PDF.js)
- [ ] Internet Identity / Web3 demo
- [ ] Custom domain

## Changelog

| Tag | Notes |
|---|---|
| `v0.1.0` | Initial — design system, all sections, Remotion, news feed |
