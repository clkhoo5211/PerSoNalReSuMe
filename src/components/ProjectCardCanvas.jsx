import { useEffect, useRef } from 'react';

/* ── per-category canvas animations ─────────────────────── */

function drawAI(ctx, w, h, t) {
  // Background
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#060d1f'); bg.addColorStop(1, '#0b1535');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

  // Grid
  ctx.strokeStyle = 'rgba(0,212,255,0.04)'; ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

  const color = '#00D4FF';
  const nodes = [
    {x:60,y:75},{x:60,y:110},{x:60,y:145},
    {x:150,y:60},{x:150,y:95},{x:150,y:130},{x:150,y:160},
    {x:240,y:75},{x:240,y:110},{x:240,y:145},
    {x:320,y:108},
  ];
  const edges = [
    [0,3],[0,4],[1,3],[1,4],[1,5],[2,4],[2,5],
    [3,7],[3,8],[4,7],[4,8],[4,9],[5,8],[5,9],
    [6,9],[7,10],[8,10],[9,10],
  ];

  // Draw edges with travel pulse
  edges.forEach(([a, b], i) => {
    const na = nodes[a], nb = nodes[b];
    const phase = (t * 0.8 + i * 0.4) % 1;
    ctx.beginPath();
    ctx.moveTo(na.x, na.y); ctx.lineTo(nb.x, nb.y);
    ctx.strokeStyle = 'rgba(0,212,255,0.15)'; ctx.lineWidth = 0.8;
    ctx.stroke();
    // travelling dot
    const px = na.x + (nb.x - na.x) * phase;
    const py = na.y + (nb.y - na.y) * phase;
    ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fill();
  });

  // Draw nodes
  nodes.forEach((n, i) => {
    const pulse = 0.6 + 0.4 * Math.sin(t * 2 + i * 0.8);
    ctx.beginPath(); ctx.arc(n.x, n.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${0.07 * pulse})`; ctx.fill();
    ctx.beginPath(); ctx.arc(n.x, n.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${pulse})`; ctx.fill();
  });

  // Label
  ctx.fillStyle = color; ctx.font = 'bold 13px Inter,sans-serif';
  ctx.textAlign = 'center'; ctx.fillText('NEURAL NETWORK · AI', w / 2, h - 14);
}

function drawWeb3(ctx, w, h, t) {
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#0c0a22'); bg.addColorStop(1, '#130f3a');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

  const color = '#6366F1';
  const blocks = [
    { hash: '#4a2f', txs: 312 },
    { hash: '#8c3b', txs: 198 },
    { hash: '#1d9e', txs: 445 },
    { hash: '#f72a', txs: 267 },
  ];
  const bw = 64, bh = 68, gap = 24;
  const totalW = blocks.length * bw + (blocks.length - 1) * gap;
  const startX = (w - totalW) / 2;
  const cy = h / 2 - 10;

  blocks.forEach((block, i) => {
    const bx = startX + i * (bw + gap);
    const confirmed = true;
    const glow = 0.7 + 0.3 * Math.sin(t * 1.5 + i * 1.1);

    // Glow behind block
    ctx.shadowColor = color; ctx.shadowBlur = 12 * glow;
    ctx.strokeStyle = `rgba(99,102,241,${0.5 * glow})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bx, cy - bh / 2, bw, bh, 7);
    ctx.fillStyle = 'rgba(99,102,241,0.10)'; ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;

    // Hash
    ctx.fillStyle = `rgba(99,102,241,${0.7 + 0.3 * glow})`;
    ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center';
    ctx.fillText(block.hash, bx + bw / 2, cy - 14);

    // Checkmark
    ctx.fillStyle = '#fff'; ctx.font = '16px sans-serif';
    ctx.fillText('✓', bx + bw / 2, cy + 6);

    // Tx count
    ctx.fillStyle = 'rgba(148,163,184,0.5)';
    ctx.font = '7px monospace';
    ctx.fillText(`${block.txs} tx`, bx + bw / 2, cy + 22);

    // Chain connector
    if (i < blocks.length - 1) {
      const chainProgress = (t * 0.4 + i * 0.25) % 1;
      const cx1 = bx + bw, cx2 = bx + bw + gap;
      ctx.beginPath(); ctx.moveTo(cx1, cy); ctx.lineTo(cx2, cy);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 2; ctx.stroke();
      const dotX = cx1 + (cx2 - cx1) * chainProgress;
      ctx.beginPath(); ctx.arc(dotX, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 6;
      ctx.fill(); ctx.shadowBlur = 0;
    }
  });

  ctx.fillStyle = color; ctx.font = 'bold 13px Inter,sans-serif';
  ctx.textAlign = 'center'; ctx.fillText('BLOCKCHAIN · WEB3', w / 2, h - 14);
}

function drawFullStack(ctx, w, h, t) {
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#071812'); bg.addColorStop(1, '#0c2218');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(16,185,129,0.04)'; ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += 26) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

  const color = '#10B981';
  const bars = [
    { label: 'API', value: 0.88 },
    { label: 'DB',  value: 0.64 },
    { label: 'UI',  value: 0.93 },
    { label: 'CDN', value: 0.76 },
    { label: 'WS',  value: 0.55 },
  ];

  const chartX = 18, chartY = 32, chartH = 80, barW = 22, barGap = 8;

  // Header
  ctx.fillStyle = 'rgba(148,163,184,0.45)';
  ctx.font = '7px monospace'; ctx.textAlign = 'left';
  ctx.fillText('SYSTEM HEALTH', chartX, chartY - 8);

  bars.forEach((bar, i) => {
    const live = bar.value + 0.06 * Math.sin(t * 2.5 + i * 1.3);
    const bh = chartH * Math.min(live, 1);
    const bx = chartX + i * (barW + barGap);
    const by = chartY + chartH - bh;

    const grad = ctx.createLinearGradient(bx, by + bh, bx, by);
    grad.addColorStop(0, color); grad.addColorStop(1, color + '99');
    ctx.fillStyle = grad;
    ctx.shadowColor = color; ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.roundRect(bx, by, barW, bh, [3, 3, 0, 0]);
    ctx.fill(); ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(148,163,184,0.55)';
    ctx.font = '7px monospace'; ctx.textAlign = 'center';
    ctx.fillText(bar.label, bx + barW / 2, chartY + chartH + 10);
  });

  // Terminal panel
  const tx = chartX + bars.length * (barW + barGap) + 14;
  const ty = 28, tw = w - tx - 14, th = 100;
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.strokeStyle = 'rgba(16,185,129,0.18)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(tx, ty, tw, th, 7); ctx.fill(); ctx.stroke();

  // Traffic lights
  [['#ff5f57', tx + 9], ['#ffbd2e', tx + 19], ['#28c840', tx + 29]].forEach(([c, cx]) => {
    ctx.beginPath(); ctx.arc(cx, ty + 9, 4, 0, Math.PI * 2);
    ctx.fillStyle = c; ctx.fill();
  });

  const lines = [
    { text: '$ npm run build',  color: '#94a3b8' },
    { text: '✓ compiled 229ms', color: color },
    { text: '$ deploy --prod',  color: '#94a3b8' },
    { text: '✓ live on edge',   color: color },
  ];
  const cycleLen = 120;
  const cycle = t % cycleLen;
  lines.forEach((line, i) => {
    const lineStart = i * 22;
    if (cycle < lineStart) return;
    const chars = Math.min(line.text.length, Math.floor((cycle - lineStart) * 0.55));
    const display = line.text.slice(0, chars) + (chars < line.text.length ? '▋' : '');
    ctx.fillStyle = line.color;
    ctx.font = '8px monospace'; ctx.textAlign = 'left';
    ctx.fillText(display, tx + 7, ty + 24 + i * 18);
  });

  ctx.fillStyle = color; ctx.font = 'bold 13px Inter,sans-serif';
  ctx.textAlign = 'center'; ctx.fillText('FULL STACK · CLOUD', w / 2, h - 14);
}

/* ── main component ──────────────────────────────────────── */
export default function ProjectCardCanvas({ category, title }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width  = rect.width  + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();

    const TARGET = 30;
    const MS = 1000 / TARGET;
    let last = 0;

    const loop = (ts) => {
      rafRef.current = requestAnimationFrame(loop);
      if (ts - last < MS) return;
      last = ts;
      tRef.current += 0.5;
      const t = tRef.current;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      if (category === 'AI')       drawAI(ctx, w, h, t);
      else if (category === 'Web3') drawWeb3(ctx, w, h, t);
      else                          drawFullStack(ctx, w, h, t);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafRef.current);
  }, [category]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '200px', borderRadius: '8px 8px 0 0' }}
    />
  );
}
