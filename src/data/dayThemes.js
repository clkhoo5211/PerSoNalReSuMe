/*
 * 7 daily design themes — one per day of the week.
 * new Date().getDay() → 0=Sun, 1=Mon, … 6=Sat
 * Each theme overrides CSS custom properties on :root and supplies
 * a canvas palette object passed to BackgroundCanvas.
 */

export const DAY_THEMES = [
  /* 0 — Sunday: Deep Space ─────────────────────────── */
  {
    day: 'Sunday',
    name: 'Deep Space',
    emoji: '🌌',
    desc: 'Cosmic rest',
    css: {
      '--primary':    '#a78bfa',
      '--primary-dk': '#7c3aed',
      '--secondary':  '#c084fc',
      '--border-hi':  'rgba(167,139,250,0.35)',
      '--section-bg': 'rgba(10,5,25,0.68)',
    },
    canvas: {
      bg0:   [5,   2,  20],
      bg1:   [15,  8,  45],
      node1: [167,139,250],
      node2: [192,132,252],
      node3: [236,72, 153],
      edge:  [167,139,250],
      starC: [220,210,255],
      aurora:[[220,210,255],[167,139,250],[192,132,252],[236,72,153],[139,92,246]],
    },
  },
  /* 1 — Monday: Blueprint ──────────────────────────── */
  {
    day: 'Monday',
    name: 'Blueprint',
    emoji: '📐',
    desc: 'Focused start',
    css: {
      '--primary':    '#38bdf8',
      '--primary-dk': '#0ea5e9',
      '--secondary':  '#818cf8',
      '--border-hi':  'rgba(56,189,248,0.35)',
      '--section-bg': 'rgba(5,10,22,0.65)',
    },
    canvas: {
      bg0:   [3,  7, 30],
      bg1:   [4, 20, 46],
      node1: [56,189,248],
      node2: [129,140,248],
      node3: [244,114,182],
      edge:  [56,189,248],
      starC: [204,228,255],
      aurora:[[0,255,153],[0,204,255],[153,85,255],[255,68,170],[51,255,204]],
    },
  },
  /* 2 — Tuesday: Neon Dusk ─────────────────────────── */
  {
    day: 'Tuesday',
    name: 'Neon Dusk',
    emoji: '🔮',
    desc: 'Creative surge',
    css: {
      '--primary':    '#a78bfa',
      '--primary-dk': '#7c3aed',
      '--secondary':  '#f472b6',
      '--border-hi':  'rgba(167,139,250,0.4)',
      '--section-bg': 'rgba(13,5,32,0.68)',
    },
    canvas: {
      bg0:   [13,  5, 34],
      bg1:   [22, 11, 53],
      node1: [167,139,250],
      node2: [244,114,182],
      node3: [251,191, 36],
      edge:  [167,139,250],
      starC: [221,214,254],
      aurora:[[167,139,250],[244,114,182],[251,191,36],[236,72,153],[139,92,246]],
    },
  },
  /* 3 — Wednesday: Emerald Grid ───────────────────── */
  {
    day: 'Wednesday',
    name: 'Emerald Grid',
    emoji: '💚',
    desc: 'Midweek flow',
    css: {
      '--primary':    '#10b981',
      '--primary-dk': '#059669',
      '--secondary':  '#34d399',
      '--border-hi':  'rgba(16,185,129,0.40)',
      '--section-bg': 'rgba(4,21,16,0.68)',
    },
    canvas: {
      bg0:   [4,  15, 12],
      bg1:   [7,  26, 18],
      node1: [16,185,129],
      node2: [52,211,153],
      node3: [56,189,248],
      edge:  [16,185,129],
      starC: [187,247,208],
      aurora:[[0,255,153],[16,185,129],[52,211,153],[56,189,248],[0,204,170]],
    },
  },
  /* 4 — Thursday: Solar Flare ─────────────────────── */
  {
    day: 'Thursday',
    name: 'Solar Flare',
    emoji: '☀️',
    desc: 'Burning momentum',
    css: {
      '--primary':    '#f59e0b',
      '--primary-dk': '#d97706',
      '--secondary':  '#fb923c',
      '--border-hi':  'rgba(245,158,11,0.40)',
      '--section-bg': 'rgba(26,14,0,0.68)',
    },
    canvas: {
      bg0:   [26, 14,  0],
      bg1:   [40, 20,  5],
      node1: [245,158, 11],
      node2: [251,146, 60],
      node3: [234,179,  8],
      edge:  [245,158, 11],
      starC: [253,230,138],
      aurora:[[255,200,50],[245,158,11],[251,146,60],[234,179,8],[255,120,30]],
    },
  },
  /* 5 — Friday: Neon Coral ────────────────────────── */
  {
    day: 'Friday',
    name: 'Neon Coral',
    emoji: '🎉',
    desc: 'TGIF energy',
    css: {
      '--primary':    '#f43f5e',
      '--primary-dk': '#e11d48',
      '--secondary':  '#fb7185',
      '--border-hi':  'rgba(244,63,94,0.40)',
      '--section-bg': 'rgba(26,5,16,0.68)',
    },
    canvas: {
      bg0:   [26,  5, 16],
      bg1:   [38,  8, 22],
      node1: [244, 63, 94],
      node2: [251,113,133],
      node3: [251,191, 36],
      edge:  [244, 63, 94],
      starC: [254,205,211],
      aurora:[[255,100,130],[244,63,94],[251,113,133],[251,191,36],[255,60,100]],
    },
  },
  /* 6 — Saturday: Aurora Weekend ──────────────────── */
  {
    day: 'Saturday',
    name: 'Aurora Weekend',
    emoji: '🌈',
    desc: 'Weekend vibes',
    css: {
      '--primary':    '#06b6d4',
      '--primary-dk': '#0891b2',
      '--secondary':  '#818cf8',
      '--border-hi':  'rgba(6,182,212,0.40)',
      '--section-bg': 'rgba(2,14,22,0.68)',
    },
    canvas: {
      bg0:   [2,  14, 22],
      bg1:   [4,  22, 38],
      node1: [6, 182,212],
      node2: [129,140,248],
      node3: [52, 211,153],
      edge:  [6, 182,212],
      starC: [186,230,253],
      aurora:[[0,255,200],[6,182,212],[129,140,248],[52,211,153],[0,220,255]],
    },
  },
];

/** Returns the theme for today (or overridden day index). */
export function getTodayTheme(dayOverride) {
  const d = dayOverride ?? new Date().getDay();
  return DAY_THEMES[d];
}
