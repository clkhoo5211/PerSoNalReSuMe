import { useEffect, useRef } from 'react';
import './BackgroundCanvas.css';

/* ─── helpers ───────────────────────────────────────────── */
function lerp(a, b, t) { return a + (b - a) * t; }
function lerpC(a, b, t) {          // [r,g,b]
  return [lerp(a[0],b[0],t), lerp(a[1],b[1],t), lerp(a[2],b[2],t)];
}
function rgb([r,g,b]) { return `rgb(${r|0},${g|0},${b|0})`; }
function rgba([r,g,b], a) { return `rgba(${r|0},${g|0},${b|0},${a})`; }
function hex2rgb(h) {
  const v = parseInt(h.slice(1),16);
  return [(v>>16)&255,(v>>8)&255,v&255];
}

/* ─── palette ────────────────────────────────────────────── */
const D = {                // dark (space/blockchain)
  bg0:   hex2rgb('#050a12'),
  bg1:   hex2rgb('#0b1530'),
  node1: hex2rgb('#38bdf8'),
  node2: hex2rgb('#818cf8'),
  node3: hex2rgb('#f472b6'),
  edge:  hex2rgb('#38bdf8'),
  star:  hex2rgb('#cce4ff'),
  aurora:[[hex2rgb('#00ff99'),hex2rgb('#00ccff'),hex2rgb('#9955ff'),
           hex2rgb('#ff44aa'),hex2rgb('#33ffcc')]],
};
const L = {                // light (sky/daylight)
  bg0:   hex2rgb('#c9e8ff'),
  bg1:   hex2rgb('#f0f9ff'),
  node1: hex2rgb('#0ea5e9'),
  node2: hex2rgb('#6366f1'),
  node3: hex2rgb('#ec4899'),
  edge:  hex2rgb('#0ea5e9'),
  star:  hex2rgb('#fbbf24'),
  aurora:[[hex2rgb('#ffffff'),hex2rgb('#e0f2fe'),hex2rgb('#bfdbfe'),
           hex2rgb('#ddd6fe'),hex2rgb('#fae8ff')]],
};

/* ─── scene setup ───────────────────────────────────────── */
function buildScene(w, h) {
  // Stars / motes — reduced from 180 → 100 for perf
  const stars = Array.from({length:100},()=>({
    x: Math.random()*w, y: Math.random()*h,
    r: 0.4+Math.random()*1.8,
    phase: Math.random()*Math.PI*2,
    spd: 0.4+Math.random()*1.2,
    ly: Math.random()*h,
    vx: (Math.random()-0.5)*0.04,
  }));

  // Blockchain network nodes — reduced from 28 → 18
  const nodes = Array.from({length:18},(_,i)=>({
    x: Math.random()*w, y: Math.random()*h,
    r: i<5 ? 7+Math.random()*4 : 3+Math.random()*3,
    hub: i<5,
    phase: Math.random()*Math.PI*2,
    pulseSpd: 0.6+Math.random()*0.9,
    vx: (Math.random()-0.5)*0.12,
    vy: (Math.random()-0.5)*0.12,
    col: ['node1','node2','node3'][Math.floor(Math.random()*3)],
  }));

  // Edges between nearby nodes
  const edges = [];
  const MAX_DIST = Math.min(w,h)*0.28;
  for(let i=0;i<nodes.length;i++)
    for(let j=i+1;j<nodes.length;j++){
      const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y;
      if(Math.hypot(dx,dy)<MAX_DIST) edges.push({a:i,b:j});
    }

  // Data packets travelling along edges
  const packets = edges
    .filter(()=>Math.random()<0.4)
    .map(e=>({ edge:e, t:Math.random(), spd:(0.002+Math.random()*0.003)*(Math.random()<0.5?1:-1) }));

  // Aurora / cloud bands — reduced from 5 → 3
  const bands = Array.from({length:3},(_,i)=>({
    yBase: h*(0.55+i*0.1),
    amp:   30+Math.random()*40,
    freq:  0.002+Math.random()*0.001,
    phase: Math.random()*Math.PI*2,
    phaseSpd: 0.0004+Math.random()*0.0003,
    ci: i,   // color index
  }));

  // Floating hex shapes — reduced from 8 → 5
  const hexes = Array.from({length:5},()=>({
    x: Math.random()*w, y: Math.random()*h,
    size: 18+Math.random()*32,
    rot: Math.random()*Math.PI,
    rotSpd: (Math.random()-0.5)*0.003,
    vx: (Math.random()-0.5)*0.08,
    vy: (Math.random()-0.5)*0.08,
    alpha: 0.03+Math.random()*0.06,
  }));

  // Sun / glow (only visible in light mode)
  const sun = { x: w*0.85, y: h*0.12, r: 80 };

  // Cloud shapes — reduced from 7 → 5
  const clouds = Array.from({length:5},()=>({
    x: Math.random()*w*1.4 - w*0.2,
    y: h*(0.05+Math.random()*0.35),
    w: 120+Math.random()*180,
    h: 40+Math.random()*60,
    vx: 0.05+Math.random()*0.12,
    alpha: 0.5+Math.random()*0.4,
  }));

  return {stars, nodes, edges, packets, bands, hexes, sun, clouds};
}

/* ─── hex path helper ───────────────────────────────────── */
function hexPath(ctx, cx, cy, size, rot) {
  ctx.beginPath();
  for(let i=0;i<6;i++){
    const a=rot+i*Math.PI/3;
    const x=cx+size*Math.cos(a), y=cy+size*Math.sin(a);
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  }
  ctx.closePath();
}

/* ─── draw glow circle ──────────────────────────────────── */
function glowCircle(ctx, x, y, r, col, a=1) {
  for(let i=3;i>=0;i--){
    const rr=r*(1+i*0.7), aa=a*(0.06-i*0.012);
    ctx.beginPath();
    ctx.arc(x,y,rr,0,Math.PI*2);
    ctx.fillStyle=rgba(col,aa);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.fillStyle=rgba(col,a*0.9);
  ctx.fill();
}

/* ─── main draw ─────────────────────────────────────────── */
function draw(ctx, w, h, sc, t, tp) {
  ctx.clearRect(0,0,w,h);

  // ── 1. Background gradient ─────────────────────────────
  const bg0 = lerpC(D.bg0, L.bg0, tp);
  const bg1 = lerpC(D.bg1, L.bg1, tp);
  const grd = ctx.createLinearGradient(0,0,0,h);
  grd.addColorStop(0, rgb(bg0));
  grd.addColorStop(1, rgb(bg1));
  ctx.fillStyle = grd;
  ctx.fillRect(0,0,w,h);

  // Light-mode horizon glow
  if(tp>0.01){
    const hg = ctx.createRadialGradient(w*0.5,h*1.1,h*0.1,w*0.5,h,h*0.9);
    hg.addColorStop(0, rgba([254,215,170], tp*0.35));
    hg.addColorStop(1, rgba([254,215,170], 0));
    ctx.fillStyle=hg;
    ctx.fillRect(0,0,w,h);
  }

  // ── 2. Sun (light mode) ────────────────────────────────
  if(tp>0.01){
    const sg = ctx.createRadialGradient(sc.sun.x,sc.sun.y,0,sc.sun.x,sc.sun.y,sc.sun.r*3.5);
    sg.addColorStop(0, rgba([255,248,200], tp*0.9));
    sg.addColorStop(0.3, rgba([254,240,138], tp*0.4));
    sg.addColorStop(1, rgba([254,240,138], 0));
    ctx.fillStyle=sg;
    ctx.fillRect(0,0,w,h);
    // sun disc
    ctx.beginPath();
    ctx.arc(sc.sun.x,sc.sun.y,sc.sun.r*0.45,0,Math.PI*2);
    const sd=ctx.createRadialGradient(sc.sun.x,sc.sun.y,0,sc.sun.x,sc.sun.y,sc.sun.r*0.45);
    sd.addColorStop(0, rgba([255,255,220],tp));
    sd.addColorStop(1, rgba([254,215,100],tp*0.7));
    ctx.fillStyle=sd;
    ctx.fill();
  }

  // ── 3. Stars / Light motes ────────────────────────────
  for(const s of sc.stars){
    s.x += s.vx; if(s.x<0)s.x=w; if(s.x>w)s.x=0;
    const twinkle = 0.35+0.65*Math.sin(t*s.spd+s.phase);
    const darkA = twinkle*0.9;
    const lightA = twinkle*0.7;
    const a = lerp(darkA, lightA, tp);
    const col = lerpC(D.star, L.star, tp);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fillStyle = rgba(col, a);
    ctx.fill();
    // Dark mode: tiny cross glint on bright stars
    if(s.r>1.3 && tp<0.5){
      const gl = (1-tp*2)*twinkle*0.4;
      ctx.strokeStyle = rgba(D.star, gl);
      ctx.lineWidth=0.5;
      ctx.beginPath();
      ctx.moveTo(s.x-s.r*2.5,s.y); ctx.lineTo(s.x+s.r*2.5,s.y);
      ctx.moveTo(s.x,s.y-s.r*2.5); ctx.lineTo(s.x,s.y+s.r*2.5);
      ctx.stroke();
    }
  }

  // ── 4. Clouds (light mode) ────────────────────────────
  if(tp>0.05){
    for(const c of sc.clouds){
      c.x += c.vx;
      if(c.x>w+c.w) c.x=-c.w;
      const ca = tp*c.alpha;
      const cg = ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,c.w*0.6);
      cg.addColorStop(0, rgba([255,255,255], ca));
      cg.addColorStop(0.5, rgba([240,249,255], ca*0.7));
      cg.addColorStop(1, rgba([240,249,255], 0));
      ctx.fillStyle=cg;
      ctx.beginPath();
      ctx.ellipse(c.x,c.y,c.w*0.6,c.h*0.45,0,0,Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.x-c.w*0.25,c.y+c.h*0.05,c.w*0.38,c.h*0.35,0,0,Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.x+c.w*0.28,c.y+c.h*0.08,c.w*0.33,c.h*0.3,0,0,Math.PI*2);
      ctx.fill();
    }
  }

  // ── 5. Aurora / Cloud wave bands ─────────────────────
  const aurColors = D.aurora[0];
  const cldColors = L.aurora[0];
  for(const b of sc.bands){
    b.phase += b.phaseSpd;
    const pts=[];
    for(let x=0;x<=w;x+=8){
      pts.push([x, b.yBase+b.amp*Math.sin(x*b.freq+b.phase)]);
    }
    // Aurora blend (dark) / cloud wisp (light)
    const acol = lerpC(aurColors[b.ci], cldColors[b.ci], tp);
    const aAlpha = lerp(0.12,0.06,tp);
    const aBlur  = lerp(18,12,tp);

    ctx.save();
    ctx.filter=`blur(${aBlur}px)`;
    ctx.beginPath();
    ctx.moveTo(0,h);
    for(const [px,py] of pts) ctx.lineTo(px,py);
    ctx.lineTo(w,h);
    ctx.closePath();
    const ag = ctx.createLinearGradient(0,b.yBase-b.amp,0,b.yBase+b.amp*2);
    ag.addColorStop(0, rgba(acol, 0));
    ag.addColorStop(0.4, rgba(acol, aAlpha));
    ag.addColorStop(1, rgba(acol, 0));
    ctx.fillStyle=ag;
    ctx.fill();
    ctx.restore();
  }

  // ── 6. Blockchain hex shapes ──────────────────────────
  const hexA = lerp(0.07, 0.04, tp);
  const hexCol = lerpC(D.node2, L.node2, tp);
  for(const hx of sc.hexes){
    hx.x+=hx.vx; hx.y+=hx.vy; hx.rot+=hx.rotSpd;
    if(hx.x<-80) hx.x=w+80; if(hx.x>w+80) hx.x=-80;
    if(hx.y<-80) hx.y=h+80; if(hx.y>h+80) hx.y=-80;
    hexPath(ctx, hx.x, hx.y, hx.size, hx.rot);
    ctx.strokeStyle=rgba(hexCol, hexA*hx.alpha/0.05);
    ctx.lineWidth=1;
    ctx.stroke();
    // Inner smaller hex
    hexPath(ctx, hx.x, hx.y, hx.size*0.6, hx.rot+0.5);
    ctx.strokeStyle=rgba(hexCol, hexA*0.5*hx.alpha/0.05);
    ctx.stroke();
  }

  // ── 7. Network edges ──────────────────────────────────
  const edgeCol = lerpC(D.edge, L.edge, tp);
  for(const e of sc.edges){
    const na=sc.nodes[e.a], nb=sc.nodes[e.b];
    const dist=Math.hypot(na.x-nb.x,na.y-nb.y);
    const maxD=Math.min(w,h)*0.28;
    const ea=lerp(0.12,0.08,tp)*(1-dist/maxD);
    ctx.beginPath();
    ctx.moveTo(na.x,na.y); ctx.lineTo(nb.x,nb.y);
    ctx.strokeStyle=rgba(edgeCol, ea);
    ctx.lineWidth=0.8;
    ctx.stroke();
  }

  // ── 8. Data packets ───────────────────────────────────
  const pkCol = lerpC(D.node1, L.node1, tp);
  for(const pk of sc.packets){
    pk.t += pk.spd;
    if(pk.t>1) pk.t=0; if(pk.t<0) pk.t=1;
    const na=sc.nodes[pk.edge.a], nb=sc.nodes[pk.edge.b];
    const px=na.x+(nb.x-na.x)*pk.t, py=na.y+(nb.y-na.y)*pk.t;
    // Trail
    for(let i=1;i<=5;i++){
      const tt=pk.t-pk.spd*i*3;
      const ttc=Math.max(0,Math.min(1,tt));
      const tx=na.x+(nb.x-na.x)*ttc, ty=na.y+(nb.y-na.y)*ttc;
      ctx.beginPath();
      ctx.arc(tx,ty,1.5*(1-i/6),0,Math.PI*2);
      ctx.fillStyle=rgba(pkCol,(0.6-i*0.1)*lerp(0.9,0.7,tp));
      ctx.fill();
    }
    // Packet dot
    glowCircle(ctx, px, py, 2.5, pkCol, lerp(0.9,0.75,tp));
  }

  // ── 9. Network nodes ─────────────────────────────────
  for(const n of sc.nodes){
    n.x+=n.vx; n.y+=n.vy;
    if(n.x<0||n.x>w) n.vx*=-1;
    if(n.y<0||n.y>h) n.vy*=-1;
    const pulse=0.7+0.3*Math.sin(t*n.pulseSpd+n.phase);
    const baseCol=lerpC(D[n.col], L[n.col], tp);
    const nr=n.r*pulse;
    glowCircle(ctx, n.x, n.y, nr, baseCol, lerp(0.85,0.7,tp));
    // Hub ring
    if(n.hub){
      ctx.beginPath();
      ctx.arc(n.x,n.y,nr*2.2,0,Math.PI*2);
      ctx.strokeStyle=rgba(baseCol,0.18*pulse);
      ctx.lineWidth=1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(n.x,n.y,nr*3.5,0,Math.PI*2);
      ctx.strokeStyle=rgba(baseCol,0.07*pulse);
      ctx.stroke();
    }
  }

  // ── 10. Subtle grid overlay ───────────────────────────
  const gridA = lerp(0.025, 0.04, tp);
  const gridCol = lerpC(D.node1, L.node2, tp);
  ctx.strokeStyle=rgba(gridCol, gridA);
  ctx.lineWidth=0.5;
  const gs=Math.min(w,h)/12;
  for(let x=0;x<w;x+=gs){ ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke(); }
  for(let y=0;y<h;y+=gs){ ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke(); }

  // ── 11. Vignette ──────────────────────────────────────
  const vig=ctx.createRadialGradient(w/2,h/2,h*0.2,w/2,h/2,h*0.9);
  vig.addColorStop(0, 'transparent');
  vig.addColorStop(1, rgba(bg0, lerp(0.45, 0.15, tp)));
  ctx.fillStyle=vig;
  ctx.fillRect(0,0,w,h);
}

/* ─── React component ───────────────────────────────────── */
export default function BackgroundCanvas({ theme }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef({ sc:null, tp:0, raf:null, t:0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const state  = stateRef.current;
    state.themeTarget = theme === 'light' ? 1 : 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      state.sc = buildScene(canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(document.body);

    const TARGET_FPS = 28;
    const FRAME_MS   = 1000 / TARGET_FPS;
    let last = 0;

    const loop = (ts) => {
      state.raf = requestAnimationFrame(loop);
      if(ts - last < FRAME_MS) return;
      last = ts;
      state.t += 0.016;

      // Smooth theme lerp toward current target
      const target = state.themeTarget ?? 0;
      state.tp = lerp(state.tp, target, 0.055);

      draw(ctx, canvas.width, canvas.height, state.sc, state.t, state.tp);
    };
    state.raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(state.raf);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    stateRef.current.themeTarget = theme === 'light' ? 1 : 0;
  }, [theme]);

  return <canvas ref={canvasRef} className="bg-canvas" />;
}
