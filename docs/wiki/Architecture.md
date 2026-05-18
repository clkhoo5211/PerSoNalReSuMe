# 🏗️ Architecture

## Folder Structure

```
src/
├── components/         # All React components
│   ├── BackgroundCanvas.jsx   # Interactive daily background (7 scenes)
│   ├── ProjectCardCanvas.jsx  # Per-project canvas animations (19 unique)
│   ├── Hero.jsx / Hero.css
│   ├── About.jsx / About.css  # Timeline, Skills, Education, Competencies
│   ├── Projects.jsx           # Project grid + filters
│   ├── ProjectCard.jsx        # Individual project card
│   ├── ProjectDetail.jsx      # Full project page
│   ├── ProjectMediaViewer.jsx # Quick-view modal
│   ├── Blog.jsx / BlogDetail.jsx
│   ├── Contact.jsx            # EmailJS contact form
│   ├── LinkTree.jsx           # Quick Links page
│   ├── Navbar.jsx
│   ├── GiscusComments.jsx
│   └── TipJar.jsx
├── data/
│   ├── profile.js     # Personal info, experience, education, skills
│   ├── projects.js    # All 19 projects with metadata
│   ├── dayThemes.js   # 7 daily colour themes + canvas palettes
│   └── blog.json      # Blog post content (JSON)
├── styles.css         # Global tokens, resets, utility classes
└── App.jsx            # Root: theme toggle, routing, day theme injection
public/
├── blog.json          # Blog data served as static asset
└── CL_Khoo_Resume.pdf # Résumé download
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

> ⚠️ **Important:** Never use `<a href="#section">` for in-page anchors — with HashRouter these become route paths and blank the page. Always use `element.scrollIntoView()` instead.

## Theme System

Two orthogonal theme axes:

1. **Light / Dark** — toggled by user, stored in `localStorage`, applies `body.light` class.
2. **Day Theme** — auto-selected by `new Date().getDay()`, injects CSS custom property overrides onto `:root` via `App.jsx` `useEffect`.

See [Day Themes](Day-Themes) for details.

## Canvas Architecture

- `BackgroundCanvas` — fixed, full-viewport, `z-index: 0`, `pointer-events: none`. Runs a 30fps RAF loop with 7 scene functions. Transitions between light/dark overlay with a lerp.
- `ProjectCardCanvas` — per-card canvas, 28fps RAF loop. Keyed by `project.id` (not category). 19 unique draw functions.
- Both use `globalCompositeOperation = 'lighter'` for glow (cheaper than `shadowBlur`).
- Motion blur via low-alpha `fillRect` clear (`rgba(0,0,0,0.18)`) each frame.

## Performance Decisions

| Decision | Reason |
|----------|--------|
| `contain: layout style` on accordion items | Prevents reflow from propagating up the tree |
| Only `transform + opacity` animated | Runs on compositor thread — no CPU repaint |
| No `filter: drop-shadow` on emoji | Triggers full GPU layer rasterisation → flash |
| No `height: auto` in Framer Motion | Forces layout recalculation → white flash |
| Body fallback `background: #080c14` | Prevents white flash before canvas paints |
| Canvas `opacity: 0` + CSS fade-in | Smooth canvas reveal instead of pop-in |
