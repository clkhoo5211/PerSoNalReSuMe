import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

/* ── AI: animated neural network with SVG nodes & travelling signal ── */
function AIAnimation({ title, color }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nodes = [
    { x: 60,  y: 85  }, { x: 60,  y: 130 }, { x: 60, y: 175 },
    { x: 150, y: 70  }, { x: 150, y: 115 }, { x: 150, y: 160 },
    { x: 240, y: 85  }, { x: 240, y: 130 }, { x: 240, y: 175 },
    { x: 320, y: 128 },
  ];
  const edges = [
    [0,3],[0,4],[0,5],[1,3],[1,4],[1,5],[2,3],[2,4],[2,5],
    [3,6],[3,7],[4,6],[4,7],[4,8],[5,7],[5,8],
    [6,9],[7,9],[8,9],
  ];

  const entrance = spring({ frame, fps, config: { damping: 22, stiffness: 55 } });
  const globalOpacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#060d1f 0%,#0b1535 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', opacity: globalOpacity }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px)`, backgroundSize:'28px 28px' }} />

      <svg width="380" height="200" style={{ position:'absolute', top:10, left:10 }}>
        {/* Draw edges */}
        {edges.map(([a, b], i) => {
          const len = Math.hypot(nodes[b].x - nodes[a].x, nodes[b].y - nodes[a].y);
          const drawP = interpolate(frame, [i * 1.5, i * 1.5 + 25], [0, 1], { extrapolateLeft:'clamp', extrapolateRight:'clamp' });
          return <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke={color} strokeWidth={0.8} opacity={0.25} strokeDasharray={`${len * drawP} ${len}`} />;
        })}

        {/* Nodes */}
        {nodes.map((n, i) => {
          const nf = Math.max(0, frame - i * 3);
          const s = spring({ frame: nf, fps, config: { damping: 10, stiffness: 120 } });
          const r = interpolate(s, [0, 1], [0, 5.5]);
          const glow = interpolate((frame + i * 12) % 75, [0, 37, 75], [0.6, 1.0, 0.6]);
          return (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={r * 2.2} fill={color} opacity={0.08 * glow} />
              <circle cx={n.x} cy={n.y} r={r} fill={color} opacity={glow} />
            </g>
          );
        })}

        {/* Travelling signal dot */}
        {frame > 35 && (() => {
          const ei = Math.floor(frame / 5) % edges.length;
          const t = (frame / 5) % 1;
          const [a, b] = edges[ei];
          return <circle cx={nodes[a].x + (nodes[b].x - nodes[a].x) * t} cy={nodes[a].y + (nodes[b].y - nodes[a].y) * t} r={3} fill="#fff" opacity={0.95} />;
        })()}
      </svg>

      <div style={{ position:'absolute', bottom:18, left:0, right:0, textAlign:'center' }}>
        <div style={{ fontFamily:'Inter,sans-serif', fontSize:14, fontWeight:700, color, letterSpacing:0.8 }}>{title}</div>
        <div style={{ fontFamily:'monospace', fontSize:10, color:'rgba(0,212,255,0.5)', marginTop:3, letterSpacing:2 }}>NEURAL NETWORK · AI</div>
      </div>
    </div>
  );
}

/* ── Web3: blockchain blocks linking left to right ── */
function Web3Animation({ title, color }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const blocks = [
    { hash: '#4a2f', txs: 312 },
    { hash: '#8c3b', txs: 198 },
    { hash: '#1d9e', txs: 445 },
    { hash: '#f72a', txs: 267 },
  ];

  const entrance = spring({ frame, fps, config: { damping: 18, stiffness: 65 } });

  return (
    <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#0c0a22 0%,#130f3a 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', opacity: interpolate(entrance, [0,1], [0,1]) }}>
      {/* Hex bg */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.06 }}>
        {[{cx:60,cy:50},{cx:170,cy:50},{cx:280,cy:50},{cx:115,cy:130},{cx:225,cy:130},{cx:60,cy:200},{cx:170,cy:200},{cx:280,cy:200}].map((h,i) => (
          <polygon key={i} points={`${h.cx},${h.cy-28} ${h.cx+24},${h.cy-14} ${h.cx+24},${h.cy+14} ${h.cx},${h.cy+28} ${h.cx-24},${h.cy+14} ${h.cx-24},${h.cy-14}`} fill="none" stroke={color} strokeWidth={1} />
        ))}
      </svg>

      <div style={{ display:'flex', alignItems:'center', position:'relative', zIndex:1 }}>
        {blocks.map((block, i) => {
          const bf = Math.max(0, frame - i * 14);
          const s = spring({ frame: bf, fps, config: { damping: 14, stiffness: 90 } });
          const confirmed = frame > i * 14 + 18;
          const blockY = interpolate(s, [0,1], [24, 0]);
          const blockO = interpolate(s, [0,1], [0, 1]);
          const chainW = i < blocks.length - 1 ? interpolate(frame, [i*14+18, i*14+36], [0, 28], { extrapolateLeft:'clamp', extrapolateRight:'clamp' }) : 0;

          return (
            <div key={i} style={{ display:'flex', alignItems:'center' }}>
              <div style={{ opacity: blockO, transform: `translateY(${blockY}px)` }}>
                <div style={{ width:66, height:72, borderRadius:8, border:`1.5px solid ${confirmed ? color : 'rgba(255,255,255,0.1)'}`, background: confirmed ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.02)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, boxShadow: confirmed ? `0 0 14px ${color}33` : 'none' }}>
                  <div style={{ fontFamily:'monospace', fontSize:10, color: confirmed ? color : 'rgba(148,163,184,0.4)', fontWeight:700 }}>{block.hash}</div>
                  <div style={{ fontSize:14 }}>{confirmed ? '✓' : '⋯'}</div>
                  <div style={{ fontFamily:'monospace', fontSize:8, color:'rgba(148,163,184,0.35)' }}>{block.txs} tx</div>
                </div>
              </div>
              {i < blocks.length - 1 && (
                <div style={{ width:28, height:2, background:'rgba(255,255,255,0.07)', margin:'0 0', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', inset:0, background:color, width: chainW, boxShadow:`0 0 6px ${color}` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ position:'absolute', bottom:18, left:0, right:0, textAlign:'center' }}>
        <div style={{ fontFamily:'Inter,sans-serif', fontSize:14, fontWeight:700, color, letterSpacing:0.8 }}>{title}</div>
        <div style={{ fontFamily:'monospace', fontSize:10, color:'rgba(99,102,241,0.5)', marginTop:3, letterSpacing:2 }}>BLOCKCHAIN · WEB3</div>
      </div>
    </div>
  );
}

/* ── FullStack: live dashboard bars + terminal code typing ── */
function FullStackAnimation({ title, color }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bars = [
    { label:'API',  value: 0.88 },
    { label:'DB',   value: 0.64 },
    { label:'UI',   value: 0.93 },
    { label:'CDN',  value: 0.76 },
    { label:'WS',   value: 0.55 },
  ];

  const lines = [
    { text:'$ npm run build',    color: '#94a3b8' },
    { text:'✓ compiled 229ms',   color: color     },
    { text:'$ deploy --prod',    color: '#94a3b8' },
    { text:'✓ live on edge',     color: color     },
  ];

  const entrance = spring({ frame, fps, config: { damping: 20, stiffness: 60 } });

  return (
    <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#071812 0%,#0c2218 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', opacity: interpolate(entrance, [0,1], [0,1]) }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(16,185,129,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.04) 1px,transparent 1px)`, backgroundSize:'26px 26px' }} />

      <div style={{ display:'flex', gap:14, width:'86%', position:'relative', zIndex:1 }}>
        {/* Bar chart */}
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:'monospace', fontSize:8, color:'rgba(148,163,184,0.45)', letterSpacing:1.5, marginBottom:6 }}>SYSTEM HEALTH</div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:5, height:78 }}>
            {bars.map((bar, i) => {
              const bf = Math.max(0, frame - i * 7);
              const s = spring({ frame: bf, fps, config: { damping: 12, mass: 0.5 } });
              const maxH = 78;
              const h = interpolate(s, [0,1], [0, bar.value * maxH]);
              const live = h + interpolate((frame + i * 18) % 50, [0,25,50], [0, 4, 0]);
              return (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                  <div style={{ width:'100%', height: live, background:`linear-gradient(to top,${color},${color}99)`, borderRadius:'3px 3px 0 0', boxShadow:`0 0 6px ${color}55` }} />
                  <div style={{ fontFamily:'monospace', fontSize:7, color:'rgba(148,163,184,0.55)' }}>{bar.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Terminal */}
        <div style={{ flex:1.3, background:'rgba(0,0,0,0.45)', borderRadius:7, border:'1px solid rgba(16,185,129,0.18)', padding:'7px 9px' }}>
          <div style={{ display:'flex', gap:4, marginBottom:6 }}>
            {['#ff5f57','#ffbd2e','#28c840'].map((c,i) => <div key={i} style={{ width:6,height:6,borderRadius:'50%',background:c }} />)}
          </div>
          {lines.map((line, i) => {
            const lineStart = i * 26;
            if (frame < lineStart) return null;
            const chars = Math.min(line.text.length, Math.floor((frame - lineStart) * 0.9));
            const showCursor = chars < line.text.length;
            return (
              <div key={i} style={{ fontFamily:'monospace', fontSize:9, color: line.color, marginBottom:4, whiteSpace:'nowrap' }}>
                {line.text.slice(0, chars)}{showCursor ? '▋' : ''}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ position:'absolute', bottom:18, left:0, right:0, textAlign:'center' }}>
        <div style={{ fontFamily:'Inter,sans-serif', fontSize:14, fontWeight:700, color, letterSpacing:0.8 }}>{title}</div>
        <div style={{ fontFamily:'monospace', fontSize:10, color:'rgba(16,185,129,0.5)', marginTop:3, letterSpacing:2 }}>FULL STACK · CLOUD</div>
      </div>
    </div>
  );
}

export default function ProjectAnimation({ title, category, color }) {
  if (category === 'AI')   return <AIAnimation title={title} color={color} />;
  if (category === 'Web3') return <Web3Animation title={title} color={color} />;
  return <FullStackAnimation title={title} color={color} />;
}
