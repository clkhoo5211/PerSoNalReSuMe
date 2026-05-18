# 🚀 Deployment

## GitHub Pages (Production)

The site deploys to GitHub Pages from the `gh-pages` branch.

### Deploy Command

```bash
npm run build     # outputs to dist/
npm run deploy    # pushes dist/ to gh-pages branch via gh-pages package
```

Live URL: **https://clkhoo5211.github.io/PerSoNalReSuMe/**

> All links use `/#/` prefix (HashRouter) so deep links work on GitHub Pages without a custom 404 page.

## Local Development

```bash
git clone https://github.com/clkhoo5211/PerSoNalReSuMe.git
cd PerSoNalReSuMe
npm install
npm run dev
# → http://localhost:5173
```

Hot module replacement (HMR) is on by default via Vite.

## Build Output

| File | Gzip Size |
|------|-----------|
| `index.html` | ~0.4 kB |
| `index.css` | ~11 kB |
| `framer-motion` chunk | ~44 kB |
| `index.js` (main bundle) | ~118 kB |
| `giscus` chunk | ~9 kB |

**Total first-load JS:** ~172 kB gzip

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Source code — all development goes here |
| `gh-pages` | Auto-generated build artefacts — never edit manually |

## Vite Config Notes

- `base: '/PerSoNalReSuMe/'` is set in `vite.config.js` for the GitHub Pages sub-path
- Asset URLs in `public/` are referenced as `/PerSoNalReSuMe/blog.json` at runtime
- No SSR — pure client-side SPA

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank page after deploy | Check `base` in `vite.config.js` matches repo name |
| 404 on direct URL | HashRouter `/#/` prefix required — check all `<Link>` components |
| Old build cached | Hard refresh (`Ctrl+Shift+R`) or clear gh-pages branch cache |
| Canvas not showing | Check browser console for `OffscreenCanvas` errors on old iOS |
