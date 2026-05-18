# 🎨 Day Themes

The portfolio automatically switches its colour scheme every day of the week. Themes are defined in `src/data/dayThemes.js`.

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
// src/data/dayThemes.js
export function getTodayTheme(dayOverride) {
  const d = dayOverride ?? new Date().getDay();
  return DAY_THEMES[d];
}
```

`App.jsx` calls this once on mount and applies `theme.css` properties to `document.documentElement.style`. A `DayThemeBadge` pill (bottom-right corner) shows the current theme name and emoji.

## Theme Object Structure

```js
{
  day: 'Monday',
  name: 'Blueprint',
  emoji: '🔷',
  desc: 'Precision engineering mode',
  css: {
    '--primary': '#38bdf8',
    '--secondary': '#818cf8',
    '--accent': '#2dd4bf',
    // ...other CSS vars
  },
  canvas: {
    bg: '#020c1a',
    c1: '#38bdf8',
    c2: '#818cf8',
    c3: '#2dd4bf',
    c4: '#0ea5e9',
  }
}
```

## Interactive Mouse Controls

Each background scene reacts to mouse movement and clicks:

| Scene | Mouse Move | Click |
|-------|-----------|-------|
| Deep Space | Stars attracted to cursor (gravity well) | Supernova shockwave + 50 particles |
| Blueprint | Nodes activate & light up near cursor | Ripple wave from click point |
| Neon Dusk | Orbs repelled from cursor position | Spawn new neon orb |
| Emerald Grid | Heat field parts the code rain columns | Column clear effect |
| Solar Flare | Lorentz-force magnetic deflection | Solar flare burst |
| Neon Coral | Fountain emitter follows cursor X/Y | 60-spark fireworks display |
| Aurora Weekend | Y position = amplitude, X = phase shift | Amplitude spike wave |

## Adding / Modifying a Theme

1. Open `src/data/dayThemes.js`
2. Edit the entry for the desired day index (`0` = Sunday … `6` = Saturday)
3. Update `css` for UI colours and `canvas` for background scene colours
4. The `BackgroundCanvas` `buildDay{N}` / `drawDay{N}` functions use `dp.c1`–`dp.c4`
