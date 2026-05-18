# 🗺️ Roadmap

## ✅ Completed

### Core Setup
- [x] React 19 + Vite 8 scaffold with HashRouter
- [x] Dark / Light theme toggle with `localStorage` persistence
- [x] Body fallback colours — no white flash on page load

### Design System
- [x] 7 rotating daily design themes (Sunday–Saturday)
- [x] 7 interactive daily background canvas scenes
- [x] Mouse gravity / repulsion / magnetic deflection per scene
- [x] Click reactions (supernova, fireworks, ripple, flare) per scene
- [x] Day theme badge pill (bottom-right corner)

### About Section
- [x] Interactive experience timeline — expandable accordion (no flash)
- [x] Education cards — all 4 levels: University → Pre-Uni → Secondary → Primary
- [x] Tab-switched technical skills with animated pill chips
- [x] Core competencies mosaic tiles with hover descriptions + glow
- [x] Hover flash bug fixed (compositor-only transitions only)

### Projects Section
- [x] 19 unique per-project canvas animations (keyed by `project.id`)
- [x] Project quick-view modal using correct per-project animation
- [x] Full project detail pages using correct per-project animation
- [x] Project categories: Web3, FullStack, AI
- [x] AI projects: Trading Signal, Smart Contract Auditor, Analytics
- [x] FullStack projects: E-Commerce, Rewards, Cart, Kopitiam, Invoicing, Super App
- [x] AI News App with cinematic MCP animation (neural net + live feed)
- [x] Crypto exchange order book animation — quantities move in real time

### Blog
- [x] 20 blog posts (conversational Khazix-writer style)
- [x] Blog comments via Giscus (GitHub Discussions)
- [x] Giscus `mapping="specific"` fix for HashRouter

### Other
- [x] Quick Links page with staggered shimmer button animations
- [x] TipJar page (crypto wallet QR codes)
- [x] Hero CTA buttons — scroll instead of broken hash anchor
- [x] Light theme: hero name + tagline text visibility fixed
- [x] X.com (formerly Twitter) share button updated
- [x] Accordion expand flash eliminated (opacity+y instead of height:auto)

---

## 🔜 Planned

### High Priority
- [ ] Fill real **EmailJS** credentials in `Contact.jsx`
- [ ] Fill real **wallet addresses** in `TipJar.jsx`
- [ ] Add real **project screenshots / GIFs** to `media[]` in `projects.js`

### Medium Priority
- [ ] Google Analytics or Plausible tracking
- [ ] PWA manifest + offline support (service worker)
- [ ] Downloadable project case-study PDFs
- [ ] `/blog` search + filter by tag

### Low Priority / Ideas
- [ ] Internationalisation: English / Chinese (ZH)
- [ ] Admin UI to publish blog posts without editing JSON
- [ ] Project view count (Supabase or Cloudflare KV)
- [ ] Dark mode system preference auto-detect on first visit

---

## 🐛 Known Issues

| Issue | Severity | Status |
|-------|----------|--------|
| Giscus requires GitHub login to post comments | By design | — |
| Background canvas invisible on very old iOS (no Canvas 2D RAF support) | Minor | Falls back to solid body colour |
| Day theme badge may overlap mobile nav on very small screens (<360px) | Minor | Fix planned |
| Blog post content uses plain text — no Markdown rendering | Minor | MD parser to be added |
