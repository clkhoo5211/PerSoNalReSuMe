import { useEffect, useRef } from 'react';

/* ── shared helpers ──────────────────────────────────────── */
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const easeInOut = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x+w, y,   x+w, y+r,   r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x+w, y+h, x+w-r, y+h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y+h,  x, y+h-r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x+r, y, r);
  ctx.closePath();
}

/* ────────────────────────────────────────────────────────── *
 *  1. TRADING PLATFORM — candlestick chart + live ticker    *
 * ────────────────────────────────────────────────────────── */
function drawTrading(ctx, w, h, t) {
  const bg = ctx.createLinearGradient(0,0,w,h);
  bg.addColorStop(0,'#071812'); bg.addColorStop(1,'#0c2218');
  ctx.fillStyle = bg; ctx.fillRect(0,0,w,h);
  // grid
  ctx.strokeStyle='rgba(16,185,129,0.06)'; ctx.lineWidth=1;
  for(let x=0;x<w;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
  for(let y=0;y<h;y+=24){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}

  const candles = [
    {o:0.45,c:0.62,l:0.40,hi:0.68},
    {o:0.62,c:0.55,l:0.50,hi:0.65},
    {o:0.55,c:0.70,l:0.52,hi:0.74},
    {o:0.70,c:0.65,l:0.62,hi:0.73},
    {o:0.65,c:0.80,l:0.63,hi:0.83},
    {o:0.80,c:0.72,l:0.68,hi:0.84},
    {o:0.72,c:0.85,l:0.70,hi:0.88},
    {o:0.85,c:0.78,l:0.75,hi:0.90},
  ];
  const bw = 18, gap = 10;
  const chartH = 100, chartY = 28, chartX = 18;
  const progress = clamp((t % 120) / 100, 0, 1);
  const numShown = Math.floor(progress * candles.length);

  candles.slice(0, numShown).forEach((c, i) => {
    const x = chartX + i*(bw+gap);
    const bull = c.c >= c.o;
    const col = bull ? '#10B981' : '#f43f5e';
    const bodyTop    = chartY + chartH*(1-c.c);
    const bodyBottom = chartY + chartH*(1-c.o);
    const bodyH = Math.abs(bodyBottom - bodyTop) || 2;

    ctx.shadowColor = col; ctx.shadowBlur = 6;
    ctx.fillStyle = bull ? col : col;
    roundRect(ctx, x, Math.min(bodyTop,bodyBottom), bw, bodyH, 2);
    ctx.fill();
    ctx.strokeStyle = col; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x+bw/2, chartY+chartH*(1-c.hi));
    ctx.lineTo(x+bw/2, chartY+chartH*(1-c.l));
    ctx.stroke();
    ctx.shadowBlur = 0;
  });

  // live price line
  const phase = (t*0.8) % (Math.PI*2);
  const liveY = chartY + chartH*0.22 + Math.sin(phase)*12;
  ctx.setLineDash([4,3]);
  ctx.strokeStyle='rgba(16,185,129,0.5)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(chartX,liveY); ctx.lineTo(w-14,liveY); ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath(); ctx.arc(w-14,liveY,3.5,0,Math.PI*2);
  ctx.fillStyle='#10B981'; ctx.shadowColor='#10B981'; ctx.shadowBlur=8; ctx.fill(); ctx.shadowBlur=0;

  // price label
  const price = (4820 + Math.sin(phase)*38).toFixed(2);
  ctx.fillStyle='#10B981'; ctx.font='bold 10px monospace'; ctx.textAlign='right';
  ctx.fillText(`$${price}`, w-18, liveY-6);

  ctx.fillStyle='#10B981'; ctx.font='bold 12px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText('STOCK · TRADING · LIVE', w/2, h-14);
}

/* ────────────────────────────────────────────────────────── *
 *  2. CRYPTO EXCHANGE — order book with matching            *
 * ────────────────────────────────────────────────────────── */
function drawCryptoExchange(ctx, w, h, t) {
  ctx.fillStyle='#090920'; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='rgba(99,102,241,0.08)'; ctx.lineWidth=1;
  for(let x=0;x<w;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
  for(let y=0;y<h;y+=24){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}

  const cycle = t % 80;
  const asks = [
    {price:'43,250',qty:0.82},{price:'43,240',qty:1.45},{price:'43,230',qty:0.63},
    {price:'43,220',qty:2.10},{price:'43,210',qty:0.95},
  ];
  const bids = [
    {price:'43,190',qty:1.20},{price:'43,180',qty:0.88},{price:'43,170',qty:2.55},
    {price:'43,160',qty:0.71},{price:'43,150',qty:1.38},
  ];
  const rowH = 16, startY = 26, colW = w/2 - 10;

  ctx.font='7px monospace'; ctx.textAlign='left';
  ctx.fillStyle='rgba(148,163,184,0.5)';
  ctx.fillText('ASKS', 14, startY-6);
  ctx.fillText('BIDS', colW+24, startY-6);

  asks.forEach((a,i) => {
    const y = startY + i*rowH;
    const barW = colW * a.qty / 3;
    ctx.fillStyle='rgba(244,63,94,0.12)';
    ctx.fillRect(14, y, barW, rowH-2);
    ctx.fillStyle='rgba(244,63,94,0.85)';
    ctx.fillText(a.price, 16, y+10);
    ctx.fillStyle='rgba(148,163,184,0.5)';
    ctx.fillText(a.qty.toFixed(2), 14+colW-36, y+10);
  });

  bids.forEach((b,i) => {
    const y = startY + i*rowH;
    const barW = colW * b.qty / 3;
    ctx.fillStyle='rgba(16,185,129,0.12)';
    ctx.fillRect(colW+24, y, barW, rowH-2);
    ctx.fillStyle='rgba(16,185,129,0.85)';
    ctx.fillText(b.price, colW+26, y+10);
    ctx.fillStyle='rgba(148,163,184,0.5)';
    ctx.fillText(b.qty.toFixed(2), colW+24+colW-36, y+10);
  });

  // spread / match flash
  const spreadY = startY + 5*rowH + 4;
  const matchPhase = easeInOut(clamp((cycle % 40)/20, 0, 1));
  ctx.fillStyle=`rgba(251,191,36,${0.3+matchPhase*0.6})`;
  roundRect(ctx, w/2-30, spreadY, 60, 14, 4); ctx.fill();
  ctx.fillStyle='#facc15'; ctx.font='bold 7px monospace'; ctx.textAlign='center';
  ctx.fillText('MATCHED', w/2, spreadY+9);

  ctx.fillStyle='#6366F1'; ctx.font='bold 12px Inter,sans-serif';
  ctx.fillText('CRYPTO EXCHANGE · ORDER BOOK', w/2, h-14);
}

/* ────────────────────────────────────────────────────────── *
 *  3. ICP DAPP — canister nodes on Internet Computer        *
 * ────────────────────────────────────────────────────────── */
function drawICP(ctx, w, h, t) {
  ctx.fillStyle='#05030f'; ctx.fillRect(0,0,w,h);
  const cx = w/2, cy = h/2 - 10;
  const r = 58;

  // ICP logo motif hex ring
  for(let i=0;i<6;i++){
    const a = i*Math.PI/3 + t*0.004;
    const nx = cx + r*Math.cos(a), ny = cy + r*Math.sin(a);
    const pulse = 0.6+0.4*Math.sin(t*0.05+i);
    // spoke
    ctx.strokeStyle=`rgba(110,45,255,${0.3*pulse})`; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(nx,ny); ctx.stroke();
    // canister node
    ctx.shadowColor='#6e2dff'; ctx.shadowBlur=14*pulse;
    roundRect(ctx,nx-14,ny-10,28,20,5);
    ctx.fillStyle=`rgba(110,45,255,${0.18+0.1*pulse})`; ctx.fill();
    ctx.strokeStyle=`rgba(110,45,255,${0.7*pulse})`; ctx.lineWidth=1.2; ctx.stroke();
    ctx.shadowBlur=0;
    // label
    ctx.fillStyle=`rgba(167,139,250,${pulse})`; ctx.font='6px monospace'; ctx.textAlign='center';
    ctx.fillText('CANISTER', nx, ny+4);
  }

  // centre ICP node
  const cpulse = 0.7+0.3*Math.sin(t*0.07);
  ctx.shadowColor='#38bdf8'; ctx.shadowBlur=20*cpulse;
  ctx.beginPath(); ctx.arc(cx,cy,18,0,Math.PI*2);
  ctx.fillStyle='rgba(56,189,248,0.15)'; ctx.fill();
  ctx.strokeStyle=`rgba(56,189,248,${cpulse})`; ctx.lineWidth=2; ctx.stroke();
  ctx.shadowBlur=0;
  ctx.fillStyle='#38bdf8'; ctx.font='bold 8px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText('ICP', cx, cy+3);

  // travelling data packets
  for(let i=0;i<6;i++){
    const a = i*Math.PI/3 + t*0.004;
    const pt = ((t*0.03 + i*0.18) % 1);
    const px = cx + r*Math.cos(a)*pt, py = cy + r*Math.sin(a)*pt;
    ctx.beginPath(); ctx.arc(px,py,2.5,0,Math.PI*2);
    ctx.fillStyle='rgba(167,139,250,0.9)'; ctx.shadowColor='#a78bfa'; ctx.shadowBlur=6;
    ctx.fill(); ctx.shadowBlur=0;
  }

  ctx.fillStyle='#a78bfa'; ctx.font='bold 12px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText('INTERNET COMPUTER · ICP', w/2, h-14);
}

/* ────────────────────────────────────────────────────────── *
 *  4. NFT MARKETPLACE — floating art cards + auction timer  *
 * ────────────────────────────────────────────────────────── */
function drawNFT(ctx, w, h, t) {
  const bg = ctx.createLinearGradient(0,0,w,h);
  bg.addColorStop(0,'#0e0620'); bg.addColorStop(1,'#180b35');
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);

  const cards = [
    {x:30,  y:30, color:'#f472b6', label:'#0042', price:'2.4 ETH'},
    {x:120, y:44, color:'#a78bfa', label:'#0117', price:'0.8 ETH'},
    {x:210, y:26, color:'#38bdf8', label:'#0391', price:'5.1 ETH'},
    {x:300, y:40, color:'#34d399', label:'#1024', price:'1.2 ETH'},
  ];

  cards.forEach((c, i) => {
    const floatY = c.y + Math.sin(t*0.025 + i*1.4)*6;
    const alpha = 0.85 + 0.15*Math.sin(t*0.04+i);
    // card shadow
    ctx.shadowColor = c.color; ctx.shadowBlur = 18*alpha;
    roundRect(ctx, c.x, floatY, 72, 90, 8);
    ctx.fillStyle=`rgba(255,255,255,0.05)`; ctx.fill();
    ctx.strokeStyle=c.color; ctx.lineWidth=1.2; ctx.stroke();
    ctx.shadowBlur=0;
    // art area gradient
    const ag=ctx.createLinearGradient(c.x,floatY,c.x+72,floatY+58);
    ag.addColorStop(0,c.color+'40'); ag.addColorStop(1,'rgba(0,0,0,0.3)');
    roundRect(ctx,c.x+4,floatY+4,64,58,5); ctx.fillStyle=ag; ctx.fill();
    // NFT id
    ctx.fillStyle=c.color; ctx.font='bold 8px monospace'; ctx.textAlign='center';
    ctx.fillText(c.label, c.x+36, floatY+38);
    // price
    ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font='7px monospace';
    ctx.fillText(c.price, c.x+36, floatY+78);
    // "LIVE" dot
    const dotPulse = 0.6+0.4*Math.sin(t*0.12+i);
    ctx.beginPath(); ctx.arc(c.x+10,floatY+68,3,0,Math.PI*2);
    ctx.fillStyle=`rgba(16,185,129,${dotPulse})`; ctx.fill();
  });

  ctx.fillStyle='#f472b6'; ctx.font='bold 12px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText('NFT MARKETPLACE · AUCTION', w/2, h-14);
}

/* ────────────────────────────────────────────────────────── *
 *  5. MYWALLET — coins orbiting a wallet with balance       *
 * ────────────────────────────────────────────────────────── */
function drawWallet(ctx, w, h, t) {
  const bg=ctx.createLinearGradient(0,0,w,h);
  bg.addColorStop(0,'#060d1f'); bg.addColorStop(1,'#0e1635');
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);

  const cx=w/2, cy=h/2-6;

  // wallet icon centre
  const wp=0.7+0.3*Math.sin(t*0.04);
  ctx.shadowColor='#38bdf8'; ctx.shadowBlur=18*wp;
  roundRect(ctx,cx-22,cy-14,44,28,6);
  ctx.fillStyle='rgba(56,189,248,0.12)'; ctx.fill();
  ctx.strokeStyle=`rgba(56,189,248,${wp})`; ctx.lineWidth=1.8; ctx.stroke();
  roundRect(ctx,cx-10,cy-6,20,12,3);
  ctx.fillStyle='rgba(56,189,248,0.18)'; ctx.fill();
  ctx.strokeStyle=`rgba(56,189,248,0.5)`; ctx.lineWidth=1; ctx.stroke();
  ctx.shadowBlur=0;

  // orbiting coins
  const coins = [
    {sym:'ETH',  color:'#818cf8', r:54, speed:0.018, offset:0},
    {sym:'BNB',  color:'#f59e0b', r:54, speed:0.018, offset:2.1},
    {sym:'BTC',  color:'#f97316', r:54, speed:0.018, offset:4.2},
    {sym:'MATIC',color:'#a78bfa', r:76, speed:0.012, offset:1.0},
    {sym:'USDT', color:'#10b981', r:76, speed:0.012, offset:3.2},
  ];

  coins.forEach(c=>{
    const a = t*c.speed + c.offset;
    const nx=cx+c.r*Math.cos(a), ny=cy+c.r*Math.sin(a);
    // orbit ring segment
    ctx.beginPath(); ctx.arc(cx,cy,c.r,0,Math.PI*2);
    ctx.strokeStyle=`rgba(255,255,255,0.05)`; ctx.lineWidth=1; ctx.stroke();
    // coin
    ctx.shadowColor=c.color; ctx.shadowBlur=10;
    ctx.beginPath(); ctx.arc(nx,ny,9,0,Math.PI*2);
    ctx.fillStyle=c.color+'33'; ctx.fill();
    ctx.strokeStyle=c.color; ctx.lineWidth=1.5; ctx.stroke();
    ctx.shadowBlur=0;
    ctx.fillStyle=c.color; ctx.font='bold 6px monospace'; ctx.textAlign='center';
    ctx.fillText(c.sym,nx,ny+2);
  });

  // balance counter
  const bal = (12450 + Math.sin(t*0.03)*80).toFixed(2);
  ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.font='bold 11px monospace'; ctx.textAlign='center';
  ctx.fillText(`$${bal}`, cx, cy+3);

  ctx.fillStyle='#38bdf8'; ctx.font='bold 12px Inter,sans-serif';
  ctx.fillText('MULTI-CURRENCY WALLET', w/2, h-14);
}

/* ────────────────────────────────────────────────────────── *
 *  6. ERP SYSTEM — module pipeline with data flow           *
 * ────────────────────────────────────────────────────────── */
function drawERP(ctx, w, h, t) {
  const bg=ctx.createLinearGradient(0,0,w,h);
  bg.addColorStop(0,'#060d22'); bg.addColorStop(1,'#0a1632');
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);

  const modules = [
    {label:'FINANCE', color:'#10b981', x:22},
    {label:'HR',      color:'#38bdf8', x:22+86},
    {label:'INV',     color:'#a78bfa', x:22+172},
    {label:'OPS',     color:'#fb923c', x:22+258},
  ];
  const my=h/2-18, mw=68, mh=38;

  modules.forEach((m,i)=>{
    const pulse=0.6+0.4*Math.sin(t*0.05+i*0.9);
    ctx.shadowColor=m.color; ctx.shadowBlur=12*pulse;
    roundRect(ctx,m.x,my,mw,mh,7);
    ctx.fillStyle=`rgba(255,255,255,0.05)`; ctx.fill();
    ctx.strokeStyle=`${m.color}${Math.floor(pulse*180).toString(16).padStart(2,'0')}`; ctx.lineWidth=1.5; ctx.stroke();
    ctx.shadowBlur=0;
    ctx.fillStyle=m.color; ctx.font='bold 8px monospace'; ctx.textAlign='center';
    ctx.fillText(m.label,m.x+mw/2,my+mh/2+3);

    // data flow connector
    if(i<modules.length-1){
      const cx1=m.x+mw, cx2=modules[i+1].x, midY=my+mh/2;
      const flowT=((t*0.025+i*0.28)%1);
      ctx.setLineDash([3,3]); ctx.strokeStyle='rgba(255,255,255,0.1)'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(cx1,midY); ctx.lineTo(cx2,midY); ctx.stroke();
      ctx.setLineDash([]);
      const px=cx1+(cx2-cx1)*flowT;
      ctx.beginPath(); ctx.arc(px,midY,3,0,Math.PI*2);
      ctx.fillStyle=m.color; ctx.shadowColor=m.color; ctx.shadowBlur=6; ctx.fill(); ctx.shadowBlur=0;
    }
  });

  // stats row
  const stats=[{l:'Revenue',v:'$2.4M'},{l:'Staff',v:'248'},{l:'Stock',v:'99.2%'}];
  stats.forEach((s,i)=>{
    const sx=28+i*116, sy=my+mh+22;
    ctx.fillStyle='rgba(255,255,255,0.06)';
    roundRect(ctx,sx,sy,98,24,5); ctx.fill();
    ctx.fillStyle='rgba(148,163,184,0.6)'; ctx.font='7px monospace'; ctx.textAlign='left';
    ctx.fillText(s.l,sx+8,sy+10);
    ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.font='bold 9px monospace';
    ctx.fillText(s.v,sx+8,sy+20);
  });

  ctx.fillStyle='#38bdf8'; ctx.font='bold 12px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText('ERP · ENTERPRISE SYSTEM', w/2, h-14);
}

/* ────────────────────────────────────────────────────────── *
 *  7. BLOCKCHAIN E-COMMERCE — supply chain scan checkpoints *
 * ────────────────────────────────────────────────────────── */
function drawEcommerce(ctx, w, h, t) {
  const bg=ctx.createLinearGradient(0,0,w,h);
  bg.addColorStop(0,'#06120a'); bg.addColorStop(1,'#0a1f12');
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);

  const steps = [
    {label:'FACTORY', icon:'🏭'},
    {label:'SHIP',    icon:'🚢'},
    {label:'CUSTOMS', icon:'🔍'},
    {label:'STORE',   icon:'🏪'},
    {label:'BUYER',   icon:'✅'},
  ];
  const stepW = (w-28) / steps.length;
  const lineY = h/2 - 8;

  // connecting line
  ctx.strokeStyle='rgba(16,185,129,0.2)'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(14,lineY); ctx.lineTo(w-14,lineY); ctx.stroke();

  // progress fill
  const progress = ((t*0.012)%(steps.length-0.01));
  ctx.strokeStyle='#10b981'; ctx.lineWidth=2; ctx.shadowColor='#10b981'; ctx.shadowBlur=6;
  ctx.beginPath(); ctx.moveTo(14,lineY);
  ctx.lineTo(14 + (progress/(steps.length-1))*(w-28), lineY); ctx.stroke(); ctx.shadowBlur=0;

  steps.forEach((s,i)=>{
    const sx = 14 + i*stepW + stepW/2;
    const done = i <= Math.floor(progress);
    const active = i === Math.floor(progress);
    const pulse = active ? 0.7+0.3*Math.sin(t*0.12) : 1;

    ctx.shadowColor=done?'#10b981':'rgba(255,255,255,0.2)'; ctx.shadowBlur=done?10*pulse:4;
    ctx.beginPath(); ctx.arc(sx,lineY,10,0,Math.PI*2);
    ctx.fillStyle=done?`rgba(16,185,129,${0.25*pulse})`:'rgba(255,255,255,0.05)'; ctx.fill();
    ctx.strokeStyle=done?`rgba(16,185,129,${pulse})`:'rgba(255,255,255,0.15)'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.shadowBlur=0;
    ctx.font='11px sans-serif'; ctx.textAlign='center';
    ctx.fillText(s.icon, sx, lineY+4);
    ctx.fillStyle=done?'#10b981':'rgba(148,163,184,0.4)'; ctx.font='6px monospace';
    ctx.fillText(s.label, sx, lineY+26);
  });

  // hash display
  const hash = '0x'+Math.floor(Math.abs(Math.sin(t*0.01))*0xffffff).toString(16).padStart(6,'0');
  ctx.fillStyle='rgba(16,185,129,0.5)'; ctx.font='8px monospace'; ctx.textAlign='center';
  ctx.fillText(`TX: ${hash}`, w/2, lineY-20);

  ctx.fillStyle='#10b981'; ctx.font='bold 12px Inter,sans-serif';
  ctx.fillText('BLOCKCHAIN SUPPLY CHAIN', w/2, h-14);
}

/* ────────────────────────────────────────────────────────── *
 *  8. SMART CONTRACTS — deploy sequence with tx hash        *
 * ────────────────────────────────────────────────────────── */
function drawSmartContracts(ctx, w, h, t) {
  ctx.fillStyle='#050510'; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='rgba(99,102,241,0.05)'; ctx.lineWidth=1;
  for(let x=0;x<w;x+=28){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
  for(let y=0;y<h;y+=22){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}

  // code lines
  const lines = [
    {text:'contract Token is ERC20 {',   color:'#818cf8'},
    {text:'  uint256 public totalSupply;',color:'#94a3b8'},
    {text:'  mapping(addr=>uint) bal;',  color:'#94a3b8'},
    {text:'  function mint() public {',  color:'#818cf8'},
    {text:'    emit Transfer(0x..);',    color:'#34d399'},
    {text:'  }',                         color:'#818cf8'},
    {text:'}',                           color:'#818cf8'},
  ];
  const cycleLen = lines.length * 20 + 40;
  const cycle = t % cycleLen;
  lines.forEach((line,i)=>{
    const ls = i * 20;
    if(cycle < ls) return;
    const chars = Math.min(line.text.length, Math.floor((cycle-ls)*0.7));
    ctx.fillStyle = line.color;
    ctx.font='8px monospace'; ctx.textAlign='left';
    ctx.fillText(line.text.slice(0,chars)+(chars<line.text.length?'▌':''), 14, 28+i*17);
  });

  // network badges
  const nets=[
    {name:'ETH',  color:'#818cf8'},
    {name:'BNB',  color:'#f59e0b'},
    {name:'POLY', color:'#a78bfa'},
    {name:'TRX',  color:'#f43f5e'},
  ];
  nets.forEach((n,i)=>{
    const bx=14+i*82, by=h-52;
    const bp=0.5+0.5*Math.sin(t*0.06+i*0.8);
    ctx.shadowColor=n.color; ctx.shadowBlur=8*bp;
    roundRect(ctx,bx,by,68,18,4); ctx.fillStyle=`${n.color}22`; ctx.fill();
    ctx.strokeStyle=`${n.color}${Math.floor(bp*200).toString(16).padStart(2,'0')}`; ctx.lineWidth=1; ctx.stroke();
    ctx.shadowBlur=0;
    ctx.fillStyle=n.color; ctx.font='bold 8px monospace'; ctx.textAlign='center';
    ctx.fillText(`✓ ${n.name}`, bx+34, by+12);
  });

  ctx.fillStyle='#6366F1'; ctx.font='bold 12px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText('SMART CONTRACTS · EVM', w/2, h-14);
}

/* ────────────────────────────────────────────────────────── *
 *  9. MOBILE APPS — phone frame with notifications          *
 * ────────────────────────────────────────────────────────── */
function drawMobileApps(ctx, w, h, t) {
  const bg=ctx.createLinearGradient(0,0,w,h);
  bg.addColorStop(0,'#050c18'); bg.addColorStop(1,'#0b1628');
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);

  // two phone frames
  const phones=[{x:w/2-78, os:'iOS'},{x:w/2+14, os:'Android'}];

  phones.forEach((p,pi)=>{
    const pw=58, ph=96, pr=8;
    // phone body
    ctx.shadowColor='rgba(56,189,248,0.4)'; ctx.shadowBlur=12;
    roundRect(ctx,p.x,20,pw,ph,pr);
    ctx.fillStyle='rgba(15,25,50,0.9)'; ctx.fill();
    ctx.strokeStyle='rgba(56,189,248,0.5)'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.shadowBlur=0;
    // screen
    roundRect(ctx,p.x+3,24,pw-6,ph-8,pr-2);
    ctx.fillStyle='rgba(8,20,40,0.95)'; ctx.fill();
    // notch
    ctx.beginPath(); ctx.arc(p.x+pw/2,24,5,Math.PI,0);
    ctx.fillStyle='rgba(15,25,50,0.9)'; ctx.fill();
    // status bar
    ctx.fillStyle='rgba(148,163,184,0.4)'; ctx.font='5px monospace'; ctx.textAlign='left';
    ctx.fillText(p.os,p.x+6,31);

    // notification cards sliding in
    const notifs=[
      {msg:'Tx confirmed',icon:'✓',color:'#10b981'},
      {msg:'$142.00 recv',icon:'↓',color:'#38bdf8'},
      {msg:'NFT minted',  icon:'◈',color:'#a78bfa'},
    ];
    notifs.forEach((n,ni)=>{
      const slideT = clamp((t*0.018 - ni*0.35 - pi*0.2) % 3, 0, 1);
      const ny = 36 + ni*22;
      if(slideT <= 0) return;
      const slide = easeInOut(Math.min(slideT*4,1));
      const nx = p.x+4 + (1-slide)*pw;
      ctx.fillStyle=`${n.color}22`;
      roundRect(ctx,nx,ny,pw-8,18,3); ctx.fill();
      ctx.strokeStyle=`${n.color}55`; ctx.lineWidth=0.8; ctx.stroke();
      ctx.fillStyle=n.color; ctx.font='8px sans-serif'; ctx.textAlign='center';
      ctx.fillText(n.icon,nx+8,ny+11);
      ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font='5px monospace'; ctx.textAlign='left';
      ctx.fillText(n.msg,nx+16,ny+12);
    });
  });

  ctx.fillStyle='#38bdf8'; ctx.font='bold 12px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText('iOS · ANDROID MOBILE APPS', w/2, h-14);
}

/* ────────────────────────────────────────────────────────── *
 * AI-1. TRADING SIGNAL ENGINE — LSTM wave + confidence bar  *
 * ────────────────────────────────────────────────────────── */
function drawAITradingSignal(ctx, w, h, t) {
  ctx.fillStyle='#060d1f'; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='rgba(0,212,255,0.05)'; ctx.lineWidth=1;
  for(let x=0;x<w;x+=28){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
  for(let y=0;y<h;y+=22){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}

  // LSTM wave — sine composite mimicking price prediction
  const midY = h*0.42;
  const points = [];
  for(let x=0;x<=w;x+=3){
    const nx = x/w;
    const y = midY
      + Math.sin(nx*8+t*0.04)*18
      + Math.sin(nx*3.2+t*0.025)*10
      + Math.sin(nx*14+t*0.07)*5;
    points.push({x,y});
  }
  // prediction fill (future half, lighter)
  const splitX = w*0.6;
  ctx.beginPath();
  points.filter(p=>p.x>=splitX).forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));
  ctx.lineTo(w, midY); ctx.lineTo(splitX, midY); ctx.closePath();
  ctx.fillStyle='rgba(0,212,255,0.06)'; ctx.fill();
  // actual line (left)
  ctx.beginPath();
  points.filter(p=>p.x<=splitX).forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));
  ctx.strokeStyle='rgba(0,212,255,0.8)'; ctx.lineWidth=1.8; ctx.stroke();
  // predicted line (right, dashed)
  ctx.setLineDash([4,3]);
  ctx.beginPath();
  points.filter(p=>p.x>=splitX).forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));
  ctx.strokeStyle='rgba(0,212,255,0.45)'; ctx.lineWidth=1.5; ctx.stroke();
  ctx.setLineDash([]);

  // signal dot + label
  const sigPulse = 0.7+0.3*Math.sin(t*0.1);
  const last = points[points.length-1];
  ctx.beginPath(); ctx.arc(last.x-2, last.y, 5*sigPulse, 0, Math.PI*2);
  ctx.fillStyle=`rgba(0,212,255,${sigPulse})`; ctx.fill();

  // confidence bars
  const signals = [{label:'BUY',  pct:0.82, color:'#10B981'},
                   {label:'HOLD', pct:0.12, color:'#f59e0b'},
                   {label:'SELL', pct:0.06, color:'#f43f5e'}];
  const bx=16, by=h-52, bw2=90, bh=10;
  signals.forEach((s,i)=>{
    const by2=by+i*16;
    ctx.fillStyle='rgba(255,255,255,0.06)';
    roundRect(ctx,bx,by2,bw2,bh,3); ctx.fill();
    ctx.fillStyle=s.color;
    roundRect(ctx,bx,by2,bw2*s.pct,bh,3); ctx.fill();
    ctx.fillStyle=s.color; ctx.font='7px monospace'; ctx.textAlign='left';
    ctx.fillText(`${s.label} ${(s.pct*100).toFixed(0)}%`,bx+bw2+6,by2+8);
  });

  ctx.fillStyle='#00D4FF'; ctx.font='bold 12px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText('AI TRADING SIGNAL ENGINE', w/2, h-14);
}

/* ────────────────────────────────────────────────────────── *
 * AI-2. SMART CONTRACT AUDITOR — code scan + risk matrix    *
 * ────────────────────────────────────────────────────────── */
function drawAIAuditor(ctx, w, h, t) {
  ctx.fillStyle='#06030f'; ctx.fillRect(0,0,w,h);
  const cycle = t % 90;

  // code lines with scan highlight
  const lines = [
    {text:'function withdraw() external {', color:'#94a3b8'},
    {text:'  uint bal = balances[msg.sender];', color:'#94a3b8'},
    {text:'  (bool ok,) = msg.sender.call{', color:'#f43f5e'},
    {text:'    value: bal}("");', color:'#f43f5e'},
    {text:'  balances[msg.sender] = 0;', color:'#94a3b8'},
    {text:'}', color:'#94a3b8'},
  ];
  const scanLineY = 20 + (cycle/90)*(lines.length*15+10);
  // scan beam
  ctx.fillStyle='rgba(244,63,94,0.07)';
  ctx.fillRect(0, scanLineY-3, w*0.62, 6);

  lines.forEach((l,i)=>{
    const y=24+i*15;
    const isRed = l.color==='#f43f5e';
    if(isRed){
      ctx.fillStyle='rgba(244,63,94,0.08)';
      ctx.fillRect(12,y-10,w*0.62-24,13);
    }
    ctx.fillStyle=l.color; ctx.font='7px monospace'; ctx.textAlign='left';
    ctx.fillText(l.text.slice(0,38), 14, y);
  });

  // vulnerability panel
  const vx=w*0.64, vy=14, vw=w*0.34;
  ctx.fillStyle='rgba(244,63,94,0.08)';
  roundRect(ctx,vx,vy,vw,60,5); ctx.fill();
  ctx.strokeStyle='rgba(244,63,94,0.4)'; ctx.lineWidth=1;
  roundRect(ctx,vx,vy,vw,60,5); ctx.stroke();
  ctx.fillStyle='#f43f5e'; ctx.font='bold 7px monospace'; ctx.textAlign='center';
  ctx.fillText('⚠ REENTRANCY', vx+vw/2, vy+14);
  ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.font='6px monospace';
  ctx.fillText('Line 3–4', vx+vw/2, vy+26);
  ctx.fillText('CRITICAL', vx+vw/2, vy+38);
  const rp=0.7+0.3*Math.sin(t*0.1);
  ctx.fillStyle=`rgba(244,63,94,${rp})`; ctx.font='bold 9px monospace';
  ctx.fillText('SEVERITY: 9.2', vx+vw/2, vy+52);

  // audit score
  const score = 64;
  ctx.fillStyle='rgba(255,255,255,0.06)';
  roundRect(ctx,vx,vy+68,vw,40,5); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.font='6px monospace'; ctx.textAlign='center';
  ctx.fillText('AUDIT SCORE',vx+vw/2,vy+82);
  ctx.fillStyle='#f43f5e'; ctx.font='bold 14px monospace';
  ctx.fillText(`${score}/100`,vx+vw/2,vy+100);

  ctx.fillStyle='#a78bfa'; ctx.font='bold 12px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText('AI CONTRACT AUDITOR', w/2, h-14);
}

/* ────────────────────────────────────────────────────────── *
 * AI-3. BLOCKCHAIN ANALYTICS — on-chain anomaly radar       *
 * ────────────────────────────────────────────────────────── */
function drawAIAnalytics(ctx, w, h, t) {
  const bg=ctx.createLinearGradient(0,0,w,h);
  bg.addColorStop(0,'#060d1f'); bg.addColorStop(1,'#0b1535');
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);

  const cx=w*0.32, cy=h*0.48, maxR=70;
  // radar rings
  for(let ri=1;ri<=4;ri++){
    const r=maxR*ri/4;
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.strokeStyle='rgba(99,102,241,0.15)'; ctx.lineWidth=0.8; ctx.stroke();
  }
  // radar axes
  const axes=6;
  const labels=['Volume','Whale','Wash','Flow','DeFi','Risk'];
  for(let i=0;i<axes;i++){
    const a=i*(Math.PI*2/axes)-Math.PI/2;
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.lineTo(cx+Math.cos(a)*maxR,cy+Math.sin(a)*maxR);
    ctx.strokeStyle='rgba(99,102,241,0.2)'; ctx.lineWidth=0.7; ctx.stroke();
    ctx.fillStyle='rgba(148,163,184,0.6)'; ctx.font='6px monospace'; ctx.textAlign='center';
    const lx=cx+Math.cos(a)*(maxR+12), ly=cy+Math.sin(a)*(maxR+12);
    ctx.fillText(labels[i],lx,ly+2);
  }
  // animated anomaly polygon
  const vals=[0.9,0.75,0.6,0.85,0.7,0.95];
  const pulse=0.05*Math.sin(t*0.06);
  ctx.beginPath();
  vals.forEach((v,i)=>{
    const a=i*(Math.PI*2/axes)-Math.PI/2;
    const r=maxR*(v+pulse);
    i===0?ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)
         :ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
  });
  ctx.closePath();
  ctx.fillStyle='rgba(99,102,241,0.15)'; ctx.fill();
  ctx.strokeStyle='rgba(99,102,241,0.7)'; ctx.lineWidth=1.5; ctx.stroke();
  // rotating scan line
  const scanA=t*0.03-Math.PI/2;
  ctx.beginPath(); ctx.moveTo(cx,cy);
  ctx.lineTo(cx+Math.cos(scanA)*maxR,cy+Math.sin(scanA)*maxR);
  ctx.strokeStyle='rgba(0,212,255,0.4)'; ctx.lineWidth=1.5; ctx.stroke();
  // sweep fill
  ctx.beginPath(); ctx.moveTo(cx,cy);
  ctx.arc(cx,cy,maxR,scanA-0.35,scanA);
  ctx.closePath();
  ctx.fillStyle='rgba(0,212,255,0.05)'; ctx.fill();

  // alert feed on right
  const alerts=[
    {label:'🐋 Whale Move',  val:'$4.2M', color:'#f59e0b'},
    {label:'⚠ Wash Trade',   val:'0x4f..', color:'#f43f5e'},
    {label:'✓ Normal Flow',  val:'ETH',   color:'#10b981'},
    {label:'📊 Volume Spike',val:'+340%', color:'#a78bfa'},
  ];
  const ax=w*0.62, ay=18;
  alerts.forEach((al,i)=>{
    const apy=ay+i*30;
    const pulse2=0.6+0.4*Math.sin(t*0.08+i*0.9);
    ctx.fillStyle=`rgba(255,255,255,0.04)`;
    roundRect(ctx,ax,apy,w*0.36-4,22,4); ctx.fill();
    ctx.strokeStyle=`${al.color}${Math.floor(pulse2*160).toString(16).padStart(2,'0')}`;
    ctx.lineWidth=0.8;
    roundRect(ctx,ax,apy,w*0.36-4,22,4); ctx.stroke();
    ctx.fillStyle=al.color; ctx.font='6px monospace'; ctx.textAlign='left';
    ctx.fillText(al.label,ax+5,apy+9);
    ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font='bold 7px monospace';
    ctx.fillText(al.val,ax+5,apy+19);
  });

  ctx.fillStyle='#00D4FF'; ctx.font='bold 12px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText('AI BLOCKCHAIN ANALYTICS', w/2, h-14);
}

/* ────────────────────────────────────────────────────────── *
 * CRYPTO EXCHANGE FIX — animated order quantities per frame  *
 * ────────────────────────────────────────────────────────── */
function drawCryptoExchangeV2(ctx, w, h, t) {
  ctx.fillStyle='#090920'; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='rgba(99,102,241,0.07)'; ctx.lineWidth=1;
  for(let x=0;x<w;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
  for(let y=0;y<h;y+=24){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}

  // animate ask quantities with sine offsets
  const asks=[
    {price:'43,250',base:0.82},{price:'43,240',base:1.45},{price:'43,230',base:0.63},
    {price:'43,220',base:2.10},{price:'43,210',base:0.95},
  ];
  const bids=[
    {price:'43,190',base:1.20},{price:'43,180',base:0.88},{price:'43,170',base:2.55},
    {price:'43,160',base:0.71},{price:'43,150',base:1.38},
  ];
  const rowH=16, startY=26, colW=w/2-10;
  ctx.font='7px monospace';
  ctx.fillStyle='rgba(148,163,184,0.5)'; ctx.textAlign='left';
  ctx.fillText('ASKS',14,startY-6); ctx.fillText('BIDS',colW+24,startY-6);

  asks.forEach((a,i)=>{
    const qty = Math.max(0.1, a.base + Math.sin(t*0.06+i*0.9)*0.3);
    const y=startY+i*rowH;
    ctx.fillStyle='rgba(244,63,94,0.12)';
    ctx.fillRect(14,y,colW*qty/3,rowH-2);
    ctx.fillStyle='rgba(244,63,94,0.9)'; ctx.fillText(a.price,16,y+10);
    ctx.fillStyle='rgba(148,163,184,0.6)'; ctx.fillText(qty.toFixed(2),14+colW-38,y+10);
  });
  bids.forEach((b,i)=>{
    const qty = Math.max(0.1, b.base + Math.sin(t*0.06+i*1.3+2)*0.3);
    const y=startY+i*rowH;
    ctx.fillStyle='rgba(16,185,129,0.12)';
    ctx.fillRect(colW+24,y,colW*qty/3,rowH-2);
    ctx.fillStyle='rgba(16,185,129,0.9)'; ctx.fillText(b.price,colW+26,y+10);
    ctx.fillStyle='rgba(148,163,184,0.6)'; ctx.fillText(qty.toFixed(2),colW+24+colW-38,y+10);
  });

  // match flash
  const matchPulse=0.4+0.6*Math.abs(Math.sin(t*0.08));
  const spreadY=startY+5*rowH+4;
  roundRect(ctx,w/2-32,spreadY,64,14,4);
  ctx.fillStyle=`rgba(251,191,36,${0.15+matchPulse*0.2})`; ctx.fill();
  ctx.fillStyle=`rgba(251,191,36,${0.6+matchPulse*0.4})`; ctx.font='bold 7px monospace'; ctx.textAlign='center';
  ctx.fillText('▲ MATCHED',w/2,spreadY+9);

  // live price ticker
  const price=(43200+Math.sin(t*0.04)*80).toFixed(0);
  ctx.fillStyle='rgba(255,255,255,0.85)'; ctx.font='bold 10px monospace'; ctx.textAlign='center';
  ctx.fillText(`BTC $${price}`,w/2,h-28);

  ctx.fillStyle='#6366F1'; ctx.font='bold 12px Inter,sans-serif';
  ctx.fillText('CRYPTO EXCHANGE · ORDER BOOK',w/2,h-14);
}

/* ────────────────────────────────────────────────────────── *
 * NEW-1. TRADITIONAL E-COMMERCE — product grid → cart flow  *
 * ────────────────────────────────────────────────────────── */
function drawEcommerceTraditional(ctx, w, h, t) {
  const bg=ctx.createLinearGradient(0,0,w,h);
  bg.addColorStop(0,'#0a0a18'); bg.addColorStop(1,'#12101e');
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);

  // product cards grid
  const cols=4, rows=2, cw=56, ch=52, gx=14, gy=18, gap=8;
  const products=[
    {col:'#f472b6',label:'👗'},{col:'#38bdf8',label:'👟'},
    {col:'#34d399',label:'📱'},{col:'#fb923c',label:'⌚'},
    {col:'#a78bfa',label:'💻'},{col:'#f43f5e',label:'🎧'},
    {col:'#facc15',label:'📷'},{col:'#818cf8',label:'🎮'},
  ];
  products.forEach((p,i)=>{
    const col=i%cols, row=Math.floor(i/cols);
    const x=gx+col*(cw+gap), y=gy+row*(ch+gap);
    const pulse=0.6+0.4*Math.sin(t*0.05+i*0.7);
    ctx.shadowColor=p.col; ctx.shadowBlur=6*pulse;
    roundRect(ctx,x,y,cw,ch,6);
    ctx.fillStyle=`${p.col}18`; ctx.fill();
    ctx.strokeStyle=`${p.col}${Math.floor(pulse*160).toString(16).padStart(2,'0')}`; ctx.lineWidth=1; ctx.stroke();
    ctx.shadowBlur=0;
    ctx.font='18px sans-serif'; ctx.textAlign='center';
    ctx.fillText(p.label,x+cw/2,y+ch/2+6);
  });

  // flying-to-cart animation
  const flyT=((t*0.012)%1);
  const srcIdx=Math.floor(t*0.015)%8;
  const sc2=srcIdx%cols, sr=Math.floor(srcIdx/cols);
  const sx=gx+sc2*(cw+gap)+cw/2, sy=gy+sr*(ch+gap)+ch/2;
  const cartX=w-22, cartY=h/2;
  const fx=lerp(sx,cartX,easeInOut(flyT));
  const fy=lerp(sy,cartY,easeInOut(flyT))-Math.sin(flyT*Math.PI)*30;
  ctx.beginPath(); ctx.arc(fx,fy,5*(1-flyT*0.5),0,Math.PI*2);
  ctx.fillStyle=`rgba(255,255,255,${0.9*(1-flyT)})`; ctx.fill();

  // cart icon
  const cartPulse=0.7+0.3*Math.sin(t*0.1);
  ctx.font='22px sans-serif'; ctx.textAlign='right';
  ctx.fillText('🛒',w-6,h/2+8);
  // item count badge
  const count=1+Math.floor(t*0.015)%8;
  ctx.beginPath(); ctx.arc(w-8,h/2-12,8,0,Math.PI*2);
  ctx.fillStyle=`rgba(244,63,94,${cartPulse})`; ctx.fill();
  ctx.fillStyle='#fff'; ctx.font='bold 8px monospace'; ctx.textAlign='center';
  ctx.fillText(count,w-8,h/2-9);

  ctx.fillStyle='#f472b6'; ctx.font='bold 12px Inter,sans-serif';
  ctx.fillText('TRADITIONAL E-COMMERCE',w/2,h-14);
}

/* ────────────────────────────────────────────────────────── *
 * NEW-2. REWARDS SYSTEM — points collecting + tier badges   *
 * ────────────────────────────────────────────────────────── */
function drawRewards(ctx, w, h, t) {
  const bg=ctx.createLinearGradient(0,0,w,h);
  bg.addColorStop(0,'#0a0800'); bg.addColorStop(1,'#1a1200');
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);

  // tiers
  const tiers=[
    {label:'BRONZE',  color:'#cd7f32', threshold:0.25},
    {label:'SILVER',  color:'#c0c0c0', threshold:0.50},
    {label:'GOLD',    color:'#ffd700', threshold:0.75},
    {label:'PLATINUM',color:'#e5e4e2', threshold:1.00},
  ];
  const barX=16, barY=20, barW=w*0.55, barH=10;
  // progress
  const progress=(Math.sin(t*0.018)*0.5+0.5)*0.92+0.04;
  tiers.forEach((tier,i)=>{
    const tx=barX+barW*tier.threshold-12;
    ctx.fillStyle='rgba(255,255,255,0.12)';
    roundRect(ctx,tx-1,barY-8,26,26,4); ctx.fill();
    ctx.fillStyle=tier.color; ctx.font='6px monospace'; ctx.textAlign='center';
    ctx.fillText(tier.label.slice(0,2),tx+12,barY+5);
  });
  // bar track
  roundRect(ctx,barX,barY+10,barW,barH,5);
  ctx.fillStyle='rgba(255,255,255,0.08)'; ctx.fill();
  // fill
  const grad=ctx.createLinearGradient(barX,0,barX+barW,0);
  grad.addColorStop(0,'#cd7f32'); grad.addColorStop(0.5,'#ffd700'); grad.addColorStop(1,'#e5e4e2');
  roundRect(ctx,barX,barY+10,barW*progress,barH,5);
  ctx.fillStyle=grad; ctx.fill();
  // points label
  const pts=Math.floor(progress*10000);
  ctx.fillStyle='#facc15'; ctx.font='bold 11px monospace'; ctx.textAlign='left';
  ctx.fillText(`${pts.toLocaleString()} pts`,barX,barY+36);

  // flying coins
  for(let i=0;i<6;i++){
    const ct=((t*0.014+i*0.18)%1);
    const cx2=barX+Math.random()*barW*(i/6)+10;  // static per i
    const seedX=barX+(i*73)%(barW-20);
    const cy2=h*0.7-easeInOut(ct)*h*0.55;
    const a=1-ct;
    ctx.beginPath(); ctx.arc(seedX,cy2,5*(1-ct*0.5),0,Math.PI*2);
    ctx.fillStyle=`rgba(250,204,21,${a*0.85})`; ctx.fill();
    ctx.fillStyle=`rgba(250,204,21,${a*0.5})`; ctx.font='8px sans-serif'; ctx.textAlign='center';
    ctx.fillText('+10',seedX,cy2-8);
  }

  // leaderboard strip
  const leaders=[{rank:'#1',name:'User A',pts:'9,840'},{rank:'#2',name:'You',pts:'8,200'},{rank:'#3',name:'User C',pts:'7,510'}];
  leaders.forEach((l,i)=>{
    const lx=barX+barW+12, ly=barY+i*24;
    const isYou=l.name==='You';
    ctx.fillStyle=isYou?'rgba(250,204,21,0.12)':'rgba(255,255,255,0.04)';
    roundRect(ctx,lx,ly,w-lx-8,20,4); ctx.fill();
    ctx.fillStyle=isYou?'#facc15':'rgba(148,163,184,0.7)';
    ctx.font=`${isYou?'bold ':' '}7px monospace`; ctx.textAlign='left';
    ctx.fillText(`${l.rank} ${l.name}`,lx+5,ly+13);
    ctx.fillStyle='rgba(148,163,184,0.5)'; ctx.textAlign='right';
    ctx.fillText(l.pts,lx+w-lx-14,ly+13);
  });

  ctx.fillStyle='#ffd700'; ctx.font='bold 12px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText('LOYALTY & REWARDS SYSTEM',w/2,h-14);
}

/* ────────────────────────────────────────────────────────── *
 * NEW-3. SHOPPING CART — items + live total recalculation    *
 * ────────────────────────────────────────────────────────── */
function drawShoppingCart(ctx, w, h, t) {
  ctx.fillStyle='#08100a'; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='rgba(16,185,129,0.06)'; ctx.lineWidth=1;
  for(let x=0;x<w;x+=28){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}

  const items=[
    {emoji:'👟',name:'Sneakers',price:89.90,qty:1},
    {emoji:'👗',name:'Dress',price:55.00,qty:2},
    {emoji:'📱',name:'Phone Case',price:15.50,qty:3},
  ];
  const ix=14, iw=w-28;
  items.forEach((item,i)=>{
    const iy=14+i*42;
    // slide in from left
    const slideT=clamp(t*0.015-i*0.3,0,1);
    const ox=(1-easeInOut(slideT))*(-w);
    ctx.fillStyle='rgba(255,255,255,0.04)';
    roundRect(ctx,ix+ox,iy,iw,36,6); ctx.fill();
    ctx.strokeStyle='rgba(16,185,129,0.15)'; ctx.lineWidth=0.8;
    roundRect(ctx,ix+ox,iy,iw,36,6); ctx.stroke();
    ctx.font='16px sans-serif'; ctx.textAlign='left';
    ctx.fillText(item.emoji,ix+8+ox,iy+24);
    ctx.fillStyle='rgba(255,255,255,0.85)'; ctx.font='bold 8px Inter'; ctx.textAlign='left';
    ctx.fillText(item.name,ix+30+ox,iy+14);
    ctx.fillStyle='rgba(148,163,184,0.6)'; ctx.font='7px monospace';
    ctx.fillText(`x${item.qty}`,ix+30+ox,iy+26);
    ctx.fillStyle='#10b981'; ctx.font='bold 9px monospace'; ctx.textAlign='right';
    ctx.fillText(`$${(item.price*item.qty).toFixed(2)}`,ix+iw-6+ox,iy+24);
  });

  // divider
  ctx.strokeStyle='rgba(16,185,129,0.15)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(ix,h-54); ctx.lineTo(ix+iw,h-54); ctx.stroke();

  // total with counter animation
  const totalBase=89.90+55*2+15.5*3;
  const displayTotal=totalBase+Math.sin(t*0.04)*2;
  ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.font='8px monospace'; ctx.textAlign='left';
  ctx.fillText('TOTAL',ix,h-40);
  ctx.fillStyle='#10b981'; ctx.font='bold 14px monospace'; ctx.textAlign='right';
  ctx.fillText(`$${displayTotal.toFixed(2)}`,ix+iw,h-38);

  // checkout button pulse
  const btnPulse=0.6+0.4*Math.sin(t*0.1);
  roundRect(ctx,ix,h-30,iw,20,5);
  ctx.fillStyle=`rgba(16,185,129,${0.7+btnPulse*0.3})`; ctx.fill();
  ctx.fillStyle='#fff'; ctx.font='bold 8px Inter'; ctx.textAlign='center';
  ctx.fillText('CHECKOUT →',w/2,h-17);

  ctx.fillStyle='#10b981'; ctx.font='bold 12px Inter,sans-serif';
  ctx.fillText('SMART SHOPPING CART',w/2,h-6);
}

/* ────────────────────────────────────────────────────────── *
 * NEW-4. KOPITIAM SYSTEM — QR order → kitchen → serve flow  *
 * ────────────────────────────────────────────────────────── */
function drawKopitiam(ctx, w, h, t) {
  const bg=ctx.createLinearGradient(0,0,w,h);
  bg.addColorStop(0,'#100800'); bg.addColorStop(1,'#1a1000');
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);

  // pipeline stages
  const stages=[
    {label:'QR ORDER',icon:'📱',color:'#38bdf8'},
    {label:'KITCHEN', icon:'👨‍🍳',color:'#fb923c'},
    {label:'READY',   icon:'🔔',color:'#10b981'},
    {label:'SERVED',  icon:'☕',color:'#facc15'},
  ];
  const sw=(w-20)/4, sy=18;
  stages.forEach((s,i)=>{
    const sx2=10+i*sw;
    const active=Math.floor((t*0.012)%stages.length)===i;
    const pulse=active?0.8+0.2*Math.sin(t*0.15):0.4;
    ctx.shadowColor=s.color; ctx.shadowBlur=active?16:4;
    roundRect(ctx,sx2+4,sy,sw-8,50,8);
    ctx.fillStyle=active?`${s.color}22`:`rgba(255,255,255,0.04)`; ctx.fill();
    ctx.strokeStyle=`${s.color}${Math.floor(pulse*200).toString(16).padStart(2,'0')}`; ctx.lineWidth=active?1.8:0.8; ctx.stroke();
    ctx.shadowBlur=0;
    ctx.font='18px sans-serif'; ctx.textAlign='center';
    ctx.fillText(s.icon,sx2+sw/2,sy+28);
    ctx.fillStyle=active?s.color:'rgba(148,163,184,0.5)'; ctx.font=`${active?'bold ':''}6px monospace`;
    ctx.fillText(s.label,sx2+sw/2,sy+46);
    // connector arrow
    if(i<stages.length-1){
      const ax=sx2+sw-4, ay2=sy+25;
      const arrowProgress=clamp(((t*0.012)%stages.length)-i,0,1);
      ctx.strokeStyle=`rgba(255,255,255,${0.15+arrowProgress*0.3})`; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(ax,ay2); ctx.lineTo(ax+6,ay2); ctx.stroke();
    }
  });

  // orders list
  const orders=[
    {id:'#042',item:'Kopi O',status:0},{id:'#043',item:'Nasi Lemak',status:1},
    {id:'#044',item:'Teh Tarik',status:2},{id:'#045',item:'Roti Canai',status:3},
  ];
  orders.forEach((o,i)=>{
    const oy=78+i*22;
    const s=stages[o.status];
    const rowPulse=0.6+0.4*Math.sin(t*0.06+i*0.8);
    ctx.fillStyle='rgba(255,255,255,0.04)';
    roundRect(ctx,10,oy,w-20,18,4); ctx.fill();
    ctx.fillStyle=s.color; ctx.font='bold 7px monospace'; ctx.textAlign='left';
    ctx.fillText(o.id,14,oy+12);
    ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font='7px monospace';
    ctx.fillText(o.item,40,oy+12);
    roundRect(ctx,w-62,oy+3,50,12,3);
    ctx.fillStyle=`${s.color}28`; ctx.fill();
    ctx.fillStyle=s.color; ctx.font='bold 6px monospace'; ctx.textAlign='center';
    ctx.fillText(s.label,w-37,oy+12);
  });

  ctx.fillStyle='#fb923c'; ctx.font='bold 12px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText('KOPITIAM PIPELINE SYSTEM',w/2,h-14);
}

/* ────────────────────────────────────────────────────────── *
 * NEW-5. INVOICING SYSTEM — invoice building + send         *
 * ────────────────────────────────────────────────────────── */
function drawInvoicing(ctx, w, h, t) {
  ctx.fillStyle='#080d18'; ctx.fillRect(0,0,w,h);

  const cycle=t%120;
  const ix=18, iy=14, iw=w*0.56, ih=h-34;

  // invoice paper
  ctx.shadowColor='rgba(56,189,248,0.3)'; ctx.shadowBlur=12;
  roundRect(ctx,ix,iy,iw,ih,6);
  ctx.fillStyle='rgba(255,255,255,0.06)'; ctx.fill();
  ctx.strokeStyle='rgba(56,189,248,0.25)'; ctx.lineWidth=1; ctx.stroke();
  ctx.shadowBlur=0;

  // header
  ctx.fillStyle='rgba(56,189,248,0.9)'; ctx.font='bold 9px monospace'; ctx.textAlign='left';
  ctx.fillText('INVOICE #INV-2024-089',ix+8,iy+14);
  ctx.fillStyle='rgba(148,163,184,0.5)'; ctx.font='6px monospace';
  ctx.fillText('Due: 30 Nov 2024',ix+8,iy+24);

  // line items typing in
  const lineItems=[
    {desc:'Web Development',qty:'1',rate:'3,500.00'},
    {desc:'API Integration', qty:'3',rate:'600.00'},
    {desc:'Maintenance',     qty:'1',rate:'400.00'},
  ];
  lineItems.forEach((li,i)=>{
    const ly=iy+36+i*18;
    const chars=Math.min(li.desc.length,Math.floor(Math.max(0,cycle-i*14)*0.8));
    ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font='6.5px monospace'; ctx.textAlign='left';
    ctx.fillText(li.desc.slice(0,chars)+(chars<li.desc.length?'▌':''),ix+8,ly);
    if(chars>=li.desc.length){
      ctx.fillStyle='rgba(56,189,248,0.8)'; ctx.textAlign='right';
      ctx.fillText(`RM ${li.rate}`,ix+iw-8,ly);
    }
  });

  // total
  ctx.strokeStyle='rgba(56,189,248,0.2)'; ctx.lineWidth=0.8;
  ctx.beginPath(); ctx.moveTo(ix+8,iy+92); ctx.lineTo(ix+iw-8,iy+92); ctx.stroke();
  ctx.fillStyle='#38bdf8'; ctx.font='bold 9px monospace'; ctx.textAlign='right';
  ctx.fillText('TOTAL: RM 5,300.00',ix+iw-8,iy+104);

  // LHDN stamp
  if(cycle>80){
    const sp=Math.min((cycle-80)/15,1);
    ctx.globalAlpha=sp;
    ctx.strokeStyle='rgba(16,185,129,0.7)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(ix+iw-22,iy+50,14,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='rgba(16,185,129,0.7)'; ctx.font='bold 5px monospace'; ctx.textAlign='center';
    ctx.fillText('LHDN',ix+iw-22,iy+48); ctx.fillText('e-INV',ix+iw-22,iy+56);
    ctx.globalAlpha=1;
  }

  // right panel — status
  const rx=ix+iw+12, ry=iy, rw=w-rx-8;
  const statusItems=[
    {label:'DRAFT',    color:'#94a3b8',done:true},
    {label:'SENT',     color:'#38bdf8',done:cycle>30},
    {label:'VIEWED',   color:'#a78bfa',done:cycle>55},
    {label:'PAID',     color:'#10b981',done:cycle>90},
  ];
  statusItems.forEach((s,i)=>{
    const sy2=ry+10+i*28;
    const pulse=s.done?0.7+0.3*Math.sin(t*0.06+i):0.3;
    ctx.beginPath(); ctx.arc(rx+8,sy2+8,5,0,Math.PI*2);
    ctx.fillStyle=`${s.color}${s.done?'ff':'44'}`; ctx.fill();
    if(i<statusItems.length-1){
      ctx.strokeStyle=`rgba(255,255,255,0.1)`; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(rx+8,sy2+13); ctx.lineTo(rx+8,sy2+28); ctx.stroke();
    }
    ctx.fillStyle=s.done?s.color:'rgba(148,163,184,0.3)';
    ctx.font=`${s.done?'bold ':''}7px monospace`; ctx.textAlign='left';
    ctx.fillText(s.label,rx+18,sy2+12);
  });

  ctx.fillStyle='#38bdf8'; ctx.font='bold 12px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText('SMART INVOICING SYSTEM',w/2,h-14);
}

/* ────────────────────────────────────────────────────────── *
 * NEW-6. SUPER APP — icon grid with service activity pulses  *
 * ────────────────────────────────────────────────────────── */
function drawSuperApp(ctx, w, h, t) {
  const bg=ctx.createLinearGradient(0,0,w,h);
  bg.addColorStop(0,'#060d1f'); bg.addColorStop(1,'#0f1635');
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);

  const services=[
    {label:'eWallet',  icon:'💳', color:'#38bdf8', x:32,  y:22},
    {label:'Food',     icon:'🍜', color:'#fb923c', x:96,  y:22},
    {label:'Ride',     icon:'🚗', color:'#34d399', x:160, y:22},
    {label:'Bills',    icon:'💡', color:'#facc15', x:224, y:22},
    {label:'Shop',     icon:'🛍️', color:'#f472b6', x:32,  y:86},
    {label:'Rewards',  icon:'⭐', color:'#fbbf24', x:96,  y:86},
    {label:'News',     icon:'📰', color:'#818cf8', x:160, y:86},
    {label:'Mini App', icon:'⚙️', color:'#2dd4bf', x:224, y:86},
  ];
  const activeIdx=Math.floor((t*0.015)%services.length);

  services.forEach((s,i)=>{
    const active=i===activeIdx;
    const pulse=active?0.8+0.2*Math.sin(t*0.15):0.5+0.2*Math.sin(t*0.04+i);
    ctx.shadowColor=s.color; ctx.shadowBlur=active?20:6;
    roundRect(ctx,s.x-20,s.y,40,48,10);
    ctx.fillStyle=active?`${s.color}25`:`rgba(255,255,255,0.05)`; ctx.fill();
    ctx.strokeStyle=`${s.color}${Math.floor(pulse*200).toString(16).padStart(2,'0')}`; ctx.lineWidth=active?1.8:0.8; ctx.stroke();
    ctx.shadowBlur=0;
    ctx.font='18px sans-serif'; ctx.textAlign='center';
    ctx.fillText(s.icon,s.x,s.y+26);
    ctx.fillStyle=active?s.color:'rgba(148,163,184,0.55)';
    ctx.font=`${active?'bold ':''}6px monospace`;
    ctx.fillText(s.label,s.x,s.y+44);
    // notification dot on active
    if(active){
      ctx.beginPath(); ctx.arc(s.x+14,s.y+4,5,0,Math.PI*2);
      ctx.fillStyle='#f43f5e'; ctx.fill();
      ctx.fillStyle='#fff'; ctx.font='bold 7px monospace'; ctx.textAlign='center';
      ctx.fillText('!',s.x+14,s.y+8);
    }
  });

  // bottom balance bar
  const bal=(1250.80+Math.sin(t*0.02)*8).toFixed(2);
  roundRect(ctx,10,h-44,w-20,28,6);
  ctx.fillStyle='rgba(56,189,248,0.08)'; ctx.fill();
  ctx.strokeStyle='rgba(56,189,248,0.2)'; ctx.lineWidth=1; ctx.stroke();
  ctx.fillStyle='rgba(148,163,184,0.5)'; ctx.font='7px monospace'; ctx.textAlign='left';
  ctx.fillText('eWallet Balance',16,h-26);
  ctx.fillStyle='#38bdf8'; ctx.font='bold 10px monospace'; ctx.textAlign='right';
  ctx.fillText(`RM ${bal}`,w-14,h-26);

  ctx.fillStyle='#38bdf8'; ctx.font='bold 12px Inter,sans-serif'; ctx.textAlign='center';
  ctx.fillText('SUPER APP PLATFORM',w/2,h-14);
}

/* ────────────────────────────────────────────────────────── *
 * NEW-7. NEWS APP MCP — AI agent fetch → summarise → alert  *
 * ────────────────────────────────────────────────────────── */
function drawNewsMCP(ctx, w, h, t) {
  // ── deep space bg ──
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#03001e'); bg.addColorStop(0.5, '#07041a'); bg.addColorStop(1, '#0d0630');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

  // ── scanline overlay ──
  for (let y = 0; y < h; y += 3) {
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(0, y, w, 1);
  }

  // ── neural network background (nodes + edges) ──
  const nodes = [
    {x:w*0.12,y:h*0.22},{x:w*0.35,y:h*0.15},{x:w*0.6,y:h*0.18},
    {x:w*0.85,y:h*0.25},{x:w*0.08,y:h*0.5},{x:w*0.28,y:h*0.45},
    {x:w*0.52,y:h*0.42},{x:w*0.75,y:h*0.48},{x:w*0.92,y:h*0.55},
    {x:w*0.18,y:h*0.72},{x:w*0.45,y:h*0.7},{x:w*0.7,y:h*0.75},
  ];
  const edges = [[0,1],[1,2],[2,3],[4,5],[5,6],[6,7],[7,8],[0,4],[1,5],[2,6],[3,7],[4,9],[5,10],[6,10],[7,11],[9,10],[10,11]];
  // draw edges with travelling packet
  edges.forEach(([a,b],ei) => {
    const na=nodes[a], nb=nodes[b];
    const grad = ctx.createLinearGradient(na.x,na.y,nb.x,nb.y);
    grad.addColorStop(0,'rgba(56,189,248,0.06)'); grad.addColorStop(1,'rgba(167,139,250,0.06)');
    ctx.strokeStyle=grad; ctx.lineWidth=0.6;
    ctx.beginPath(); ctx.moveTo(na.x,na.y); ctx.lineTo(nb.x,nb.y); ctx.stroke();
    // packet
    const pf = ((t*0.008 + ei*0.17) % 1);
    const px = na.x + (nb.x-na.x)*pf, py = na.y + (nb.y-na.y)*pf;
    ctx.beginPath(); ctx.arc(px,py,1.5,0,Math.PI*2);
    ctx.fillStyle=`rgba(167,139,250,${0.4+0.4*Math.sin(t*0.1+ei)})`; ctx.fill();
  });
  // draw nodes
  nodes.forEach((n,ni) => {
    const pulse = 0.5 + 0.5*Math.sin(t*0.07 + ni*0.8);
    ctx.beginPath(); ctx.arc(n.x,n.y,3+pulse,0,Math.PI*2);
    const ng = ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,5+pulse);
    ng.addColorStop(0,'rgba(167,139,250,0.9)'); ng.addColorStop(1,'rgba(56,189,248,0)');
    ctx.fillStyle=ng; ctx.fill();
    ctx.beginPath(); ctx.arc(n.x,n.y,1.5,0,Math.PI*2);
    ctx.fillStyle='rgba(200,180,255,0.95)'; ctx.fill();
  });

  // ── MCP pipeline header ──
  const steps=[
    {label:'FETCH',   color:'#38bdf8', sym:'⬇'},
    {label:'PARSE',   color:'#818cf8', sym:'◈'},
    {label:'ANALYSE', color:'#a78bfa', sym:'⬡'},
    {label:'BRIEF',   color:'#34d399', sym:'▶'},
    {label:'ALERT',   color:'#fb923c', sym:'◉'},
  ];
  const pipeY = 14, pipeH = 28;
  const sw = (w - 16) / steps.length;
  const activeStep = Math.floor((t * 0.009) % steps.length);
  steps.forEach((s, i) => {
    const sx = 8 + i * sw;
    const active = i === activeStep;
    const glow = active ? 0.75 + 0.25*Math.sin(t*0.18) : 0.25;
    // pipe segment bg
    roundRect(ctx, sx+1, pipeY, sw-2, pipeH, 5);
    ctx.fillStyle = active ? `${s.color}18` : 'rgba(255,255,255,0.02)'; ctx.fill();
    ctx.strokeStyle = active ? s.color : `${s.color}40`; ctx.lineWidth = active ? 1.2 : 0.5; ctx.stroke();
    // label
    ctx.fillStyle = active ? s.color : `${s.color}70`;
    ctx.font = `${active ? 'bold ' : ''}5.5px monospace`; ctx.textAlign = 'center';
    ctx.fillText(s.sym + ' ' + s.label, sx + sw/2, pipeY + pipeH/2 + 2);
    // connector arrow
    if (i < steps.length-1) {
      const ax = sx + sw - 1, ay = pipeY + pipeH/2;
      const pkt = ((t*0.009 + i*0.2) % 1); // packet along connector
      const pkx = ax + pkt * 2;
      ctx.beginPath(); ctx.arc(pkx, ay, 1.8, 0, Math.PI*2);
      ctx.fillStyle = `${s.color}${Math.floor(glow*200).toString(16).padStart(2,'0')}`; ctx.fill();
    }
    // active glow ring
    if (active) {
      ctx.strokeStyle = `${s.color}40`; ctx.lineWidth = 3;
      roundRect(ctx, sx+1, pipeY, sw-2, pipeH, 5); ctx.stroke();
    }
  });

  // ── live news feed ──
  const headlines = [
    {src:'BBC',  color:'#ef4444', text:'AI Regulation Bill passes first Senate vote...'},
    {src:'CNA',  color:'#facc15', text:'BTC breaks $90K — is $100K next? Analysts weigh in...'},
    {src:'CNBC', color:'#34d399', text:'Fed signals rate cuts — equities surge to record high...'},
    {src:'WSJ',  color:'#818cf8', text:'OpenAI launches real-time news summarisation API...'},
    {src:'RT',   color:'#fb923c', text:'Southeast Asia leads global fintech adoption wave...'},
  ];
  // scroll ticker: 5 cards, each 32px tall, scroll continuously
  const cardH = 32, feedY = 48, feedH = h - feedY - 22;
  const totalH = headlines.length * cardH;
  const scroll = (t * 0.35) % totalH;
  ctx.save(); ctx.rect(0, feedY, w, feedH); ctx.clip();
  for (let rep = -1; rep <= 1; rep++) {
    headlines.forEach((n, i) => {
      const ny = feedY + i * cardH - scroll + rep * totalH;
      if (ny + cardH < feedY - 2 || ny > feedY + feedH + 2) return;
      // fade at edges
      const dy = ny - feedY, alpha = Math.min(1, Math.min(dy / 18, (feedY + feedH - ny) / 18));
      if (alpha <= 0) return;
      ctx.globalAlpha = alpha;
      // card bg
      roundRect(ctx, 8, ny + 2, w - 16, cardH - 4, 6);
      ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fill();
      ctx.strokeStyle = `${n.color}22`; ctx.lineWidth = 0.8; ctx.stroke();
      // source pill
      roundRect(ctx, 12, ny + 8, 22, 14, 3);
      ctx.fillStyle = `${n.color}25`; ctx.fill();
      ctx.fillStyle = n.color; ctx.font = 'bold 5.5px monospace'; ctx.textAlign = 'center';
      ctx.fillText(n.src, 23, ny + 17);
      // headline text with typewriter shimmer on active row
      const isActive = i === Math.floor(scroll / cardH) % headlines.length;
      const visLen = isActive ? Math.min(n.text.length, Math.floor(((t*0.009)%1)*n.text.length*3)) : n.text.length;
      const displayText = n.text.slice(0, clamp(visLen, 6, 50));
      ctx.fillStyle = isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.55)';
      ctx.font = `${isActive ? 'bold ' : ''}6.5px Inter,sans-serif`; ctx.textAlign = 'left';
      ctx.fillText(displayText, 38, ny + 13);
      // AI BRIEF badge
      const bw = 34, bx = w - bw - 10;
      roundRect(ctx, bx, ny + 8, bw, 14, 3);
      const badgeGrad = ctx.createLinearGradient(bx, 0, bx+bw, 0);
      badgeGrad.addColorStop(0,'rgba(167,139,250,0.22)'); badgeGrad.addColorStop(1,'rgba(56,189,248,0.12)');
      ctx.fillStyle = badgeGrad; ctx.fill();
      ctx.fillStyle = '#c4b5fd'; ctx.font = 'bold 5px monospace'; ctx.textAlign = 'center';
      ctx.fillText('✦ AI', bx + bw/2, ny + 17);
      // sentiment dot
      const sentColor = i%3===0?'#34d399':i%3===1?'#ef4444':'#facc15';
      ctx.beginPath(); ctx.arc(38, ny + 22, 2, 0, Math.PI*2);
      ctx.fillStyle = sentColor; ctx.fill();
      ctx.globalAlpha = 1;
    });
  }
  ctx.restore();

  // ── bottom bar: title + live indicator ──
  ctx.fillStyle = 'rgba(3,0,30,0.85)';
  ctx.fillRect(0, h - 20, w, 20);
  // live pulse dot
  const livePulse = 0.6 + 0.4*Math.sin(t*0.25);
  ctx.beginPath(); ctx.arc(14, h - 10, 3.5, 0, Math.PI*2);
  ctx.fillStyle = `rgba(239,68,68,${livePulse})`; ctx.fill();
  ctx.beginPath(); ctx.arc(14, h - 10, 6, 0, Math.PI*2);
  ctx.strokeStyle = `rgba(239,68,68,${livePulse*0.4})`; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = '#ef4444'; ctx.font = 'bold 6px monospace'; ctx.textAlign = 'left';
  ctx.fillText('LIVE', 22, h - 7);
  const titleGrad = ctx.createLinearGradient(40, 0, w - 10, 0);
  titleGrad.addColorStop(0, '#a78bfa'); titleGrad.addColorStop(1, '#38bdf8');
  ctx.fillStyle = titleGrad; ctx.font = 'bold 7px Inter,monospace'; ctx.textAlign = 'center';
  ctx.fillText('AI NEWS · MCP SERVICES', w/2 + 8, h - 7);
}

/* ── project → draw function map ─────────────────────────── */
const DRAW_FN = {
  'trading-platform':          drawTrading,
  'crypto-exchange':           drawCryptoExchangeV2,
  'icp-dapp':                  drawICP,
  'nft-marketplace':           drawNFT,
  'mywallet':                  drawWallet,
  'erp-system':                drawERP,
  'blockchain-ecommerce':      drawEcommerce,
  'smart-contracts':           drawSmartContracts,
  'mobile-apps':               drawMobileApps,
  'ai-trading-signal':         drawAITradingSignal,
  'ai-smart-contract-auditor': drawAIAuditor,
  'ai-blockchain-analytics':   drawAIAnalytics,
  'traditional-ecommerce':     drawEcommerceTraditional,
  'rewarding-system':          drawRewards,
  'shopping-cart':             drawShoppingCart,
  'kopitiam-system':           drawKopitiam,
  'invoicing-system':          drawInvoicing,
  'super-app':                 drawSuperApp,
  'news-mcp':                  drawNewsMCP,
};

/* ── main component ──────────────────────────────────────── */
export default function ProjectCardCanvas({ projectId, category, title }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const tRef      = useRef(0);

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

    const drawFn = DRAW_FN[projectId];
    if (!drawFn) return;

    const TARGET = 28;
    const MS = 1000 / TARGET;
    let last = 0;

    const loop = (ts) => {
      rafRef.current = requestAnimationFrame(loop);
      if (ts - last < MS) return;
      last = ts;
      tRef.current += 0.18;   // ← slow, cinematic pace
      const rw = canvas.width / dpr;
      const rh = canvas.height / dpr;
      ctx.clearRect(0, 0, rw, rh);
      drawFn(ctx, rw, rh, tRef.current);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [projectId]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display:'block', width:'100%', height:'200px', borderRadius:'8px 8px 0 0' }}
    />
  );
}
