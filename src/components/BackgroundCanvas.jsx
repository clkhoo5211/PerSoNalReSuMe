import { useEffect, useRef } from 'react';
import './BackgroundCanvas.css';

/* ── helpers ───────────────────────────────────────────── */
const lerp    = (a,b,t) => a+(b-a)*t;
const clamp   = (v,lo,hi) => Math.max(lo,Math.min(hi,v));
const lerpC   = (a,b,t) => [lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];
const rgb     = ([r,g,b]) => `rgb(${r|0},${g|0},${b|0})`;
const rgba    = ([r,g,b],a) => `rgba(${r|0},${g|0},${b|0},${a})`;
const rand    = (lo,hi) => lo+Math.random()*(hi-lo);
const hex2rgb = h => { const v=parseInt(h.slice(1),16); return[(v>>16)&255,(v>>8)&255,v&255]; };

/* ── scene builder (shared particles for light mode) ──── */
function buildScene(w,h) {
  // light-mode clouds
  const clouds = Array.from({length:5},()=>({
    x:rand(-100,w+100), y:rand(0,h*0.4),
    w:rand(120,220), h:rand(40,70),
    vx:rand(0.04,0.14), alpha:rand(0.4,0.8),
  }));
  const lightNodes = Array.from({length:40},()=>({
    x:rand(0,w), y:rand(0,h),
    vx:(Math.random()-0.5)*0.2,
    vy:(Math.random()-0.5)*0.2,
    phase:rand(0,Math.PI*2),
  }));
  const lightEdges=[];
  for(let i=0;i<lightNodes.length;i++)
    for(let j=i+1;j<lightNodes.length;j++){
      const dx=lightNodes[i].x-lightNodes[j].x,dy=lightNodes[i].y-lightNodes[j].y;
      if(Math.hypot(dx,dy)<Math.min(w,h)*0.18) lightEdges.push([i,j]);
    }
  return {clouds, lightNodes, lightEdges};
}

/* ── day-specific scene builders ──────────────────────── */
function buildDay0(w,h){ // Sunday – Deep Space
  const stars=Array.from({length:260},()=>({
    x:rand(0,w), y:rand(0,h), ox:0, oy:0,
    vx:(Math.random()-0.5)*0.08, vy:(Math.random()-0.5)*0.08,
    r:rand(0.3,2.2), bright:rand(0.4,1), phase:rand(0,Math.PI*2),
    layer:Math.floor(rand(1,4)),
  }));
  const nebulae=Array.from({length:5},()=>({
    x:rand(0,w), y:rand(0,h),
    rx:rand(80,200), ry:rand(60,140),
    color:[[167,139,250],[192,132,252],[56,189,248],[236,72,153],[99,102,241]][Math.floor(rand(0,5))],
    alpha:rand(0.03,0.07),
  }));
  return {stars,nebulae,bursts:[]};
}
function buildDay1(w,h){ // Monday – Neural Blueprint
  const nodes=Array.from({length:32},()=>({
    x:rand(0,w), y:rand(0,h),
    vx:(Math.random()-0.5)*0.15, vy:(Math.random()-0.5)*0.15,
    r:rand(2,5), phase:rand(0,Math.PI*2), active:false,
  }));
  return {nodes,ripples:[]};
}
function buildDay2(w,h){ // Tuesday – Neon Orbs
  const orbs=Array.from({length:14},()=>({
    x:rand(0,w), y:rand(0,h),
    vx:(Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3,
    r:rand(40,110), phase:rand(0,Math.PI*2),
    color:[[167,139,250],[244,114,182],[251,191,36],[139,92,246],[196,181,253]][Math.floor(rand(0,5))],
    hueShift:rand(0,1),
  }));
  return {orbs};
}
function buildDay3(w,h){ // Wednesday – Code Rain
  const cols=Math.ceil(w/18);
  const columns=Array.from({length:cols},(_,i)=>({
    x:i*18+9,
    drops:Array.from({length:Math.floor(rand(3,9))},()=>({
      y:rand(-h,0), speed:rand(0.8,2.8), char:'', timer:0,
    })),
  }));
  const CHARS='0123456789ABCDEF⊕∞▓░⛓≠≈⟨⟩{}';
  return {columns,CHARS};
}
function buildDay4(w,h){ // Thursday – Solar Storm
  const cx=w*0.5, cy=h*0.42;
  const particles=Array.from({length:180},()=>buildSolarParticle(cx,cy));
  return {cx,cy,particles};
}
function buildSolarParticle(cx,cy){
  const a=rand(0,Math.PI*2), spd=rand(0.4,1.8);
  return {
    x:cx, y:cy,
    vx:Math.cos(a)*spd, vy:Math.sin(a)*spd,
    life:1, decay:rand(0.004,0.011),
    r:rand(1,3),
    color:[[245,158,11],[251,146,60],[234,179,8],[253,186,116]][Math.floor(rand(0,4))],
  };
}
function buildDay5(w,h){ // Friday – Particle Fountain
  return {particles:[],sparks:[]};
}
function buildDay6(w,h){ // Saturday – Aurora Waves
  const bands=Array.from({length:7},(_,i)=>({
    yBase:h*(0.3+i*0.1),
    amp:rand(30,70),
    freq:rand(0.001,0.003),
    phase:rand(0,Math.PI*2),
    speed:rand(0.0003,0.0008),
    color:[[6,182,212],[129,140,248],[52,211,153],[167,139,250],[56,189,248],[99,102,241],[34,211,238]][i],
  }));
  return {bands};
}

/* ═══════════════════════════════════════════════════════════
   DAY 0 — Sunday: Deep Space Gravity Well
   Mouse: gravity attracts stars | Click: supernova burst
   ═══════════════════════════════════════════════════════════ */
function drawDay0(ctx,w,h,ds,t,mouse,clicks,dp){
  // BG
  const bg=ctx.createRadialGradient(w*.5,h*.4,0,w*.5,h*.5,Math.max(w,h)*.8);
  bg.addColorStop(0,rgb(dp?.bg1||[15,8,45]));
  bg.addColorStop(1,rgb(dp?.bg0||[5,2,20]));
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);

  // nebulae (static soft blobs using screen blend)
  ctx.globalCompositeOperation='lighter';
  for(const n of ds.nebulae){
    const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.rx);
    g.addColorStop(0,rgba(n.color,n.alpha));
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
  }
  ctx.globalCompositeOperation='source-over';

  // process click bursts
  for(let i=ds.bursts.length-1;i>=0;i--){
    const b=ds.bursts[i];
    b.age+=0.018;
    if(b.age>1){ds.bursts.splice(i,1);continue;}
    const ea=1-b.age;
    // expanding shockwave rings
    for(let ri=0;ri<3;ri++){
      const rr=b.age*(180+ri*60);
      ctx.beginPath(); ctx.arc(b.x,b.y,rr,0,Math.PI*2);
      ctx.strokeStyle=`rgba(200,180,255,${ea*(0.5-ri*0.14)})`;
      ctx.lineWidth=2-ri*0.5; ctx.stroke();
    }
    // burst particles
    for(const p of b.particles){
      p.x+=p.vx; p.y+=p.vy; p.vy+=0.04;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*(1-b.age*.7),0,Math.PI*2);
      ctx.fillStyle=rgba(p.col,ea*0.9); ctx.fill();
    }
  }

  // register new clicks
  for(const c of clicks){
    if(c.consumed) continue; c.consumed=true;
    const particles=Array.from({length:50},()=>{
      const a=rand(0,Math.PI*2),spd=rand(1,5);
      return{x:c.x,y:c.y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,r:rand(1,3.5),
        col:[[167,139,250],[192,132,252],[56,189,248],[255,255,255]][Math.floor(rand(0,4))]};
    });
    ds.bursts.push({x:c.x,y:c.y,age:0,particles});
  }

  // stars with mouse gravity
  const GRAV_RADIUS=160, GRAV_STR=0.18;
  const nc1=dp?.node1||[167,139,250];
  ctx.globalCompositeOperation='lighter';
  for(const s of ds.stars){
    s.x+=s.vx; s.y+=s.vy;
    if(s.x<-10)s.x=w+10; if(s.x>w+10)s.x=-10;
    if(s.y<-10)s.y=h+10; if(s.y>h+10)s.y=-10;
    // gravity
    const dx=mouse.x-s.x, dy=mouse.y-s.y;
    const d=Math.hypot(dx,dy);
    if(d<GRAV_RADIUS&&d>1){
      const force=GRAV_STR*(1-d/GRAV_RADIUS)/s.layer;
      s.vx+=dx/d*force; s.vy+=dy/d*force;
    }
    s.vx*=0.995; s.vy*=0.995;
    const twinkle=0.4+0.6*Math.sin(t*0.04*s.bright+s.phase);
    const a=twinkle*s.bright;
    const sc=lerpC([255,255,255],nc1,s.phase%1);
    ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=rgba(sc,a*0.85); ctx.fill();
    // cross glint on bright stars
    if(s.r>1.6){
      ctx.strokeStyle=rgba(sc,a*0.3); ctx.lineWidth=0.5;
      ctx.beginPath();
      ctx.moveTo(s.x-s.r*3,s.y); ctx.lineTo(s.x+s.r*3,s.y);
      ctx.moveTo(s.x,s.y-s.r*3); ctx.lineTo(s.x,s.y+s.r*3);
      ctx.stroke();
    }
  }
  ctx.globalCompositeOperation='source-over';

  // cursor glow
  const cr=ctx.createRadialGradient(mouse.x,mouse.y,0,mouse.x,mouse.y,100);
  cr.addColorStop(0,rgba(nc1,0.06)); cr.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=cr; ctx.fillRect(0,0,w,h);
}

/* ═══════════════════════════════════════════════════════════
   DAY 1 — Monday: Neural Blueprint
   Mouse: ripple wave + nearby nodes light up | Click: pulse
   ═══════════════════════════════════════════════════════════ */
function drawDay1(ctx,w,h,ds,t,mouse,clicks,dp){
  const nc=dp?.node1||[56,189,248];
  // blueprint background
  ctx.fillStyle=rgb(dp?.bg0||[3,7,30]); ctx.fillRect(0,0,w,h);
  // fine grid
  ctx.strokeStyle=`rgba(${nc[0]},${nc[1]},${nc[2]},0.05)`; ctx.lineWidth=0.5;
  for(let x=0;x<w;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
  for(let y=0;y<h;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  // cross markers at grid intersections near mouse
  const GW=32;
  for(let gx=0;gx<w;gx+=GW) for(let gy=0;gy<h;gy+=GW){
    const d=Math.hypot(mouse.x-gx,mouse.y-gy);
    if(d<200){
      const a=(1-d/200)*0.4;
      ctx.strokeStyle=`rgba(${nc[0]},${nc[1]},${nc[2]},${a})`; ctx.lineWidth=0.7;
      ctx.beginPath();
      ctx.moveTo(gx-5,gy); ctx.lineTo(gx+5,gy);
      ctx.moveTo(gx,gy-5); ctx.lineTo(gx,gy+5);
      ctx.stroke();
    }
  }

  // ripples (from clicks)
  for(let i=ds.ripples.length-1;i>=0;i--){
    const r=ds.ripples[i];
    r.age+=0.015; if(r.age>1){ds.ripples.splice(i,1);continue;}
    const ea=1-r.age;
    for(let ri=0;ri<4;ri++){
      const rr=r.age*(250+ri*50);
      ctx.beginPath(); ctx.arc(r.x,r.y,rr,0,Math.PI*2);
      ctx.strokeStyle=`rgba(${nc[0]},${nc[1]},${nc[2]},${ea*(0.5-ri*0.1)})`;
      ctx.lineWidth=1.5-ri*0.3; ctx.stroke();
    }
  }
  for(const c of clicks){if(c.consumed)continue;c.consumed=true;ds.ripples.push({x:c.x,y:c.y,age:0});}

  // move & draw nodes
  const EDGE_DIST=Math.min(w,h)*0.2;
  for(const n of ds.nodes){
    n.x+=n.vx; n.y+=n.vy;
    if(n.x<0||n.x>w)n.vx*=-1; if(n.y<0||n.y>h)n.vy*=-1;
    const dm=Math.hypot(mouse.x-n.x,mouse.y-n.y);
    n.active=dm<180;
  }
  ctx.globalCompositeOperation='lighter';
  // edges
  for(let i=0;i<ds.nodes.length;i++)
    for(let j=i+1;j<ds.nodes.length;j++){
      const dx=ds.nodes[i].x-ds.nodes[j].x,dy=ds.nodes[i].y-ds.nodes[j].y;
      const d=Math.hypot(dx,dy);
      if(d<EDGE_DIST){
        const a=(1-d/EDGE_DIST)*0.35*(ds.nodes[i].active||ds.nodes[j].active?2:1);
        ctx.strokeStyle=rgba(nc,Math.min(a,0.6)); ctx.lineWidth=0.7;
        ctx.beginPath(); ctx.moveTo(ds.nodes[i].x,ds.nodes[i].y);
        ctx.lineTo(ds.nodes[j].x,ds.nodes[j].y); ctx.stroke();
      }
    }
  // nodes
  for(const n of ds.nodes){
    const pulse=0.5+0.5*Math.sin(t*0.05+n.phase);
    const a=n.active?0.9:0.3*pulse;
    const r=n.active?n.r*1.8:n.r;
    ctx.beginPath(); ctx.arc(n.x,n.y,r*1.8,0,Math.PI*2);
    ctx.fillStyle=rgba(nc,a*0.15); ctx.fill();
    ctx.beginPath(); ctx.arc(n.x,n.y,r,0,Math.PI*2);
    ctx.fillStyle=rgba(nc,a); ctx.fill();
  }
  ctx.globalCompositeOperation='source-over';
  // mouse crosshair
  ctx.strokeStyle=`rgba(${nc[0]},${nc[1]},${nc[2]},0.25)`; ctx.lineWidth=1;
  ctx.setLineDash([4,6]);
  ctx.beginPath();ctx.moveTo(mouse.x,0);ctx.lineTo(mouse.x,h);ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,mouse.y);ctx.lineTo(w,mouse.y);ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();ctx.arc(mouse.x,mouse.y,8,0,Math.PI*2);
  ctx.strokeStyle=`rgba(${nc[0]},${nc[1]},${nc[2]},0.5)`;ctx.lineWidth=1.5;ctx.stroke();
}

/* ═══════════════════════════════════════════════════════════
   DAY 2 — Tuesday: Neon Fluid Orbs
   Mouse: orbs repel from cursor | Trails via low-alpha clear
   ═══════════════════════════════════════════════════════════ */
function drawDay2(ctx,w,h,ds,t,mouse,clicks,dp){
  // motion blur trail
  ctx.fillStyle='rgba(13,5,34,0.18)'; ctx.fillRect(0,0,w,h);
  const nc=dp?.node1||[167,139,250];
  ctx.globalCompositeOperation='lighter';
  for(const orb of ds.orbs){
    // repel from mouse
    const dx=orb.x-mouse.x, dy=orb.y-mouse.y;
    const d=Math.hypot(dx,dy);
    if(d<200&&d>1){
      const f=1.5*(1-d/200);
      orb.vx+=dx/d*f*0.06; orb.vy+=dy/d*f*0.06;
    }
    // attract to center gently
    orb.vx+=(w/2-orb.x)*0.00005; orb.vy+=(h/2-orb.y)*0.00005;
    orb.vx*=0.992; orb.vy*=0.992;
    orb.x+=orb.vx; orb.y+=orb.vy;
    if(orb.x<-orb.r)orb.x=w+orb.r; if(orb.x>w+orb.r)orb.x=-orb.r;
    if(orb.y<-orb.r)orb.y=h+orb.r; if(orb.y>h+orb.r)orb.y=-orb.r;
    orb.hueShift=(orb.hueShift+0.002)%1;
    const pulse=0.5+0.5*Math.sin(t*0.03+orb.phase);
    const col=lerpC(orb.color,nc,orb.hueShift);
    const g=ctx.createRadialGradient(orb.x,orb.y,0,orb.x,orb.y,orb.r);
    g.addColorStop(0,rgba(col,0.14*pulse));
    g.addColorStop(0.5,rgba(col,0.07*pulse));
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    // bright centre
    ctx.beginPath(); ctx.arc(orb.x,orb.y,4+3*pulse,0,Math.PI*2);
    ctx.fillStyle=rgba(col,0.6*pulse); ctx.fill();
  }
  // click pulse rings
  for(const c of clicks){
    if(c.consumed)continue; c.consumed=true;
    ds.orbs.push({x:c.x,y:c.y,vx:rand(-1,1),vy:rand(-1,1),
      r:rand(60,100),phase:rand(0,Math.PI*2),
      color:nc,hueShift:0});
    if(ds.orbs.length>20)ds.orbs.shift();
  }
  ctx.globalCompositeOperation='source-over';
  // cursor glow
  const cr=ctx.createRadialGradient(mouse.x,mouse.y,0,mouse.x,mouse.y,80);
  cr.addColorStop(0,rgba(nc,0.08));cr.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=cr;ctx.fillRect(0,0,w,h);
}

/* ═══════════════════════════════════════════════════════════
   DAY 3 — Wednesday: Matrix Code Rain
   Mouse: creates a parting "heat field" | Click: flash clear
   ═══════════════════════════════════════════════════════════ */
function drawDay3(ctx,w,h,ds,t,mouse,clicks,dp){
  const nc=dp?.node1||[16,185,129];
  ctx.fillStyle='rgba(4,15,12,0.2)'; ctx.fillRect(0,0,w,h);
  ctx.font='11px monospace';
  for(const col of ds.columns){
    const mouseInfluence=clamp(1-Math.abs(mouse.x-col.x)/120,0,1);
    for(const drop of col.drops){
      drop.timer++;
      if(drop.timer>4){
        drop.char=ds.CHARS[Math.floor(rand(0,ds.CHARS.length))];
        drop.timer=0;
      }
      drop.y+=drop.speed*(1+mouseInfluence*2);
      if(drop.y>h+20) drop.y=rand(-h*0.5,0);
      // brightness: head bright, trail fades
      const brightness=mouseInfluence>0.6?1:0.6+mouseInfluence*0.4;
      const headAlpha=0.9*brightness;
      const trailAlpha=0.35*brightness;
      ctx.fillStyle=`rgba(${nc[0]},${nc[1]},${nc[2]},${headAlpha})`;
      ctx.fillText(drop.char,col.x-5,drop.y);
      // trail
      ctx.fillStyle=`rgba(${nc[0]},${nc[1]},${nc[2]},${trailAlpha})`;
      ctx.fillText(drop.char,col.x-5,drop.y-14);
      ctx.fillStyle=`rgba(${nc[0]},${nc[1]},${nc[2]},${trailAlpha*0.4})`;
      ctx.fillText(drop.char,col.x-5,drop.y-28);
    }
  }
  // click flash
  for(const c of clicks){
    if(c.consumed)continue; c.consumed=true;
    for(const col of ds.columns){
      if(Math.abs(col.x-c.x)<80){
        for(const drop of col.drops) drop.y=rand(-h,0);
      }
    }
  }
  // cursor column highlight
  ctx.fillStyle=`rgba(${nc[0]},${nc[1]},${nc[2]},0.04)`;
  ctx.fillRect(mouse.x-9,0,18,h);
}

/* ═══════════════════════════════════════════════════════════
   DAY 4 — Thursday: Solar Particle Storm
   Mouse: magnetic deflection field | Click: solar flare spike
   ═══════════════════════════════════════════════════════════ */
function drawDay4(ctx,w,h,ds,t,mouse,clicks,dp){
  const nc=dp?.node1||[245,158,11];
  ctx.fillStyle='rgba(26,14,0,0.22)'; ctx.fillRect(0,0,w,h);

  // sun corona
  ctx.globalCompositeOperation='lighter';
  const sg=ctx.createRadialGradient(ds.cx,ds.cy,0,ds.cx,ds.cy,80);
  sg.addColorStop(0,`rgba(255,200,50,0.35)`);
  sg.addColorStop(0.5,`rgba(245,158,11,0.15)`);
  sg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=sg; ctx.fillRect(0,0,w,h);
  const corona=ctx.createRadialGradient(ds.cx,ds.cy,10,ds.cx,ds.cy,120+Math.sin(t*0.04)*20);
  corona.addColorStop(0,`rgba(255,200,50,0.6)`);
  corona.addColorStop(0.4,`rgba(245,158,11,0.2)`);
  corona.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=corona; ctx.fillRect(0,0,w,h);
  ctx.beginPath(); ctx.arc(ds.cx,ds.cy,22+Math.sin(t*0.06)*3,0,Math.PI*2);
  ctx.fillStyle='rgba(255,220,80,0.9)'; ctx.fill();

  // particles
  for(let i=0;i<ds.particles.length;i++){
    const p=ds.particles[i];
    // mouse magnetic deflection
    const dx=mouse.x-p.x, dy=mouse.y-p.y;
    const dm=Math.hypot(dx,dy);
    if(dm<180&&dm>1){
      // perpendicular push (Lorentz-like)
      p.vx+=-dy/dm*0.4*(1-dm/180);
      p.vy+=dx/dm*0.4*(1-dm/180);
    }
    p.x+=p.vx; p.y+=p.vy; p.life-=p.decay;
    if(p.life<=0){
      ds.particles[i]=buildSolarParticle(ds.cx,ds.cy);
      continue;
    }
    const a=p.life*0.8;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);
    ctx.fillStyle=rgba(p.color,a); ctx.fill();
  }
  ctx.globalCompositeOperation='source-over';

  // click: solar flare spikes
  for(const c of clicks){
    if(c.consumed)continue; c.consumed=true;
    for(let i=0;i<20;i++){
      const p=buildSolarParticle(ds.cx,ds.cy);
      const a=Math.atan2(c.y-ds.cy,c.x-ds.cx)+rand(-0.4,0.4);
      p.vx=Math.cos(a)*rand(3,8); p.vy=Math.sin(a)*rand(3,8);
      p.decay=0.008; ds.particles.push(p);
    }
    if(ds.particles.length>300) ds.particles.splice(0,20);
  }
  // cursor dot
  ctx.beginPath(); ctx.arc(mouse.x,mouse.y,5,0,Math.PI*2);
  ctx.strokeStyle=`rgba(${nc[0]},${nc[1]},${nc[2]},0.5)`; ctx.lineWidth=1.5; ctx.stroke();
}

/* ═══════════════════════════════════════════════════════════
   DAY 5 — Friday: Particle Fountain
   Mouse: fountain origin tracks cursor | Click: firework burst
   ═══════════════════════════════════════════════════════════ */
function buildFountainParticle(x,y){
  const a=rand(-Math.PI*0.8,-Math.PI*0.2);
  return{
    x,y,vx:Math.cos(a)*rand(1,4),vy:Math.sin(a)*rand(2,5),
    life:1,decay:rand(0.008,0.018),
    r:rand(1.5,3.5),
    color:[[244,63,94],[251,113,133],[251,191,36],[167,139,250]][Math.floor(rand(0,4))],
  };
}
function drawDay5(ctx,w,h,ds,t,mouse,clicks,dp){
  const nc=dp?.node1||[244,63,94];
  ctx.fillStyle='rgba(26,5,16,0.2)'; ctx.fillRect(0,0,w,h);
  // emit particles from cursor
  for(let i=0;i<3;i++) ds.particles.push(buildFountainParticle(mouse.x,mouse.y));
  // click fireworks
  for(const c of clicks){
    if(c.consumed)continue; c.consumed=true;
    for(let i=0;i<60;i++){
      const a=rand(0,Math.PI*2), spd=rand(2,7);
      ds.sparks.push({
        x:c.x,y:c.y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,
        life:1,decay:rand(0.012,0.025),r:rand(2,4),
        color:[[244,63,94],[251,191,36],[167,139,250],[251,113,133],[16,185,129]][Math.floor(rand(0,5))],
      });
    }
  }
  ctx.globalCompositeOperation='lighter';
  // fountain particles
  for(let i=ds.particles.length-1;i>=0;i--){
    const p=ds.particles[i];
    p.x+=p.vx; p.y+=p.vy; p.vy+=0.12; p.life-=p.decay;
    if(p.life<=0){ds.particles.splice(i,1);continue;}
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);
    ctx.fillStyle=rgba(p.color,p.life*0.7); ctx.fill();
  }
  // sparks
  for(let i=ds.sparks.length-1;i>=0;i--){
    const s=ds.sparks[i];
    s.x+=s.vx; s.y+=s.vy; s.vy+=0.18; s.vx*=0.97; s.life-=s.decay;
    if(s.life<=0){ds.sparks.splice(i,1);continue;}
    ctx.beginPath(); ctx.arc(s.x,s.y,s.r*s.life,0,Math.PI*2);
    ctx.fillStyle=rgba(s.color,s.life*0.85); ctx.fill();
    // trail
    ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(s.x-s.vx*3,s.y-s.vy*3);
    ctx.strokeStyle=rgba(s.color,s.life*0.4); ctx.lineWidth=s.r*s.life*0.6; ctx.stroke();
  }
  ctx.globalCompositeOperation='source-over';
  if(ds.particles.length>400)ds.particles.splice(0,50);
}

/* ═══════════════════════════════════════════════════════════
   DAY 6 — Saturday: Aurora Tidal Waves
   Mouse Y: amplitude boost | Mouse X: wave phase shift
   ═══════════════════════════════════════════════════════════ */
function drawDay6(ctx,w,h,ds,t,mouse,clicks,dp){
  const bg=ctx.createLinearGradient(0,0,0,h);
  bg.addColorStop(0,rgb(dp?.bg0||[2,14,22]));
  bg.addColorStop(1,rgb(dp?.bg1||[4,22,38]));
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);

  const mouseAmpBoost=1+(1-mouse.y/h)*1.8;
  const mousePhaseShift=(mouse.x/w-0.5)*1.5;
  ctx.globalCompositeOperation='lighter';
  for(const band of ds.bands){
    band.phase+=band.speed;
    const amp=band.amp*mouseAmpBoost;
    ctx.beginPath();
    ctx.moveTo(0,h);
    for(let x=0;x<=w;x+=4){
      const y=band.yBase+Math.sin(x*band.freq+band.phase+mousePhaseShift)*amp
               +Math.sin(x*band.freq*2.1+band.phase*1.3)*amp*0.3;
      x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.lineTo(w,h); ctx.closePath();
    const gradient=ctx.createLinearGradient(0,band.yBase-amp,0,band.yBase+amp);
    gradient.addColorStop(0,rgba(band.color,0.0));
    gradient.addColorStop(0.5,rgba(band.color,0.12));
    gradient.addColorStop(1,rgba(band.color,0.0));
    ctx.fillStyle=gradient; ctx.fill();
    // bright wave crest line
    ctx.beginPath();
    for(let x=0;x<=w;x+=4){
      const y=band.yBase+Math.sin(x*band.freq+band.phase+mousePhaseShift)*amp
               +Math.sin(x*band.freq*2.1+band.phase*1.3)*amp*0.3;
      x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.strokeStyle=rgba(band.color,0.25); ctx.lineWidth=1; ctx.stroke();
  }
  ctx.globalCompositeOperation='source-over';
  // click ripple into all bands
  for(const c of clicks){
    if(c.consumed)continue; c.consumed=true;
    for(const b of ds.bands){b.amp=clamp(b.amp*1.4,30,140); b.phase+=1.5;}
  }
  // stars
  ctx.fillStyle='rgba(255,255,255,0.5)';
  for(let i=0;i<60;i++){
    const sx=(Math.sin(i*137.5)*w+w)%w;
    const sy=(Math.sin(i*97.3)*h*0.45+0)%h;
    const a=0.3+0.3*Math.sin(t*0.03+i);
    ctx.beginPath();ctx.arc(sx,sy,0.7+Math.sin(i)*0.4,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${a})`;ctx.fill();
  }
}

/* ── light mode overlay (lerped on top) ─────────────────── */
function drawLight(ctx,w,h,sc,t,alpha,dp){
  if(alpha<0.01) return;
  const sky=ctx.createLinearGradient(0,0,0,h);
  sky.addColorStop(0,`rgba(185,228,255,${alpha})`);
  sky.addColorStop(1,`rgba(240,249,255,${alpha})`);
  ctx.fillStyle=sky; ctx.fillRect(0,0,w,h);
  // sun
  const sg=ctx.createRadialGradient(w*0.82,h*0.14,0,w*0.82,h*0.14,h*0.42);
  sg.addColorStop(0,`rgba(255,248,200,${alpha*0.95})`);
  sg.addColorStop(0.3,`rgba(254,240,138,${alpha*0.35})`);
  sg.addColorStop(1,'rgba(254,240,138,0)');
  ctx.fillStyle=sg; ctx.fillRect(0,0,w,h);
  ctx.beginPath(); ctx.arc(w*0.82,h*0.12,26,0,Math.PI*2);
  ctx.fillStyle=`rgba(255,252,200,${alpha*0.9})`; ctx.fill();
  // clouds
  for(const c of sc.clouds){
    c.x+=c.vx; if(c.x>w+c.w)c.x=-c.w;
    const cg=ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,c.w*0.6);
    cg.addColorStop(0,`rgba(255,255,255,${alpha*c.alpha})`);
    cg.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=cg; ctx.fillRect(0,0,w,h);
  }
  // pastel nodes
  const nc=dp?.node1||[14,165,233];
  for(const e of sc.lightEdges){
    ctx.strokeStyle=`rgba(${nc[0]},${nc[1]},${nc[2]},${alpha*0.12})`;
    ctx.lineWidth=0.8;
    ctx.beginPath();
    ctx.moveTo(sc.lightNodes[e[0]].x,sc.lightNodes[e[0]].y);
    ctx.lineTo(sc.lightNodes[e[1]].x,sc.lightNodes[e[1]].y);
    ctx.stroke();
  }
  for(const n of sc.lightNodes){
    n.x+=n.vx; n.y+=n.vy;
    if(n.x<0||n.x>w)n.vx*=-1; if(n.y<0||n.y>h)n.vy*=-1;
    ctx.beginPath(); ctx.arc(n.x,n.y,2.5,0,Math.PI*2);
    ctx.fillStyle=`rgba(${nc[0]},${nc[1]},${nc[2]},${alpha*0.3})`; ctx.fill();
  }
}

/* ── master draw ─────────────────────────────────────────── */
const DAY_FUNS = [drawDay0,drawDay1,drawDay2,drawDay3,drawDay4,drawDay5,drawDay6];
function draw(ctx,w,h,sc,dayScene,t,tp,mouse,clicks,dayIdx,dp){
  const darkFn = DAY_FUNS[dayIdx] || drawDay0;
  darkFn(ctx,w,h,dayScene,t,mouse,clicks,dp);
  drawLight(ctx,w,h,sc,t,tp,dp);
  // consume processed clicks
  for(let i=clicks.length-1;i>=0;i--){ if(clicks[i].consumed) clicks.splice(i,1); }
}

/* ── React component ─────────────────────────────────────── */
export default function BackgroundCanvas({ theme, dayPalette, dayIndex }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef({
    sc:null, dayScene:null, tp:0, themeTarget:0,
    raf:null, t:0, dayP:null, dayIdx:0,
    mouse:{x:0,y:0,vx:0,vy:0},
    clicks:[],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const state  = stateRef.current;
    state.themeTarget = theme === 'light' ? 1 : 0;
    state.dayP = dayPalette || null;
    state.dayIdx = dayIndex ?? new Date().getDay();

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      const w=canvas.width, h=canvas.height;
      state.sc       = buildScene(w,h);
      const di = state.dayIdx;
      const builders = [buildDay0,buildDay1,buildDay2,buildDay3,buildDay4,buildDay5,buildDay6];
      state.dayScene = (builders[di]||buildDay0)(w,h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(document.body);

    // mouse tracking
    const onMouseMove = e => {
      const s = state.mouse;
      const px = e.clientX, py = e.clientY;
      s.vx = lerp(s.vx, px - s.x, 0.3);
      s.vy = lerp(s.vy, py - s.y, 0.3);
      s.x = px; s.y = py;
    };
    const onClick = e => {
      state.clicks.push({x:e.clientX, y:e.clientY, consumed:false});
    };
    window.addEventListener('mousemove', onMouseMove, {passive:true});
    window.addEventListener('click',     onClick,     {passive:true});

    const TARGET_FPS = 30;
    const FRAME_MS   = 1000 / TARGET_FPS;
    let last = 0;

    const loop = ts => {
      state.raf = requestAnimationFrame(loop);
      if(ts - last < FRAME_MS) return;
      last = ts;
      state.t += 1;
      state.tp = lerp(state.tp, state.themeTarget, 0.045);
      const c = canvas;
      draw(ctx, c.width, c.height, state.sc, state.dayScene, state.t,
           state.tp, state.mouse, state.clicks, state.dayIdx, state.dayP);
    };
    state.raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(state.raf);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click',     onClick);
    };
  }, []);

  useEffect(() => { stateRef.current.themeTarget = theme==='light'?1:0; }, [theme]);
  useEffect(() => { stateRef.current.dayP   = dayPalette||null; }, [dayPalette]);
  useEffect(() => { stateRef.current.dayIdx = dayIndex??new Date().getDay(); }, [dayIndex]);

  return <canvas ref={canvasRef} className="bg-canvas" />;
}
