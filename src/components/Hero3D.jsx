import { useEffect, useRef } from 'react';

/**
 * Real 3D in the browser — a perspective-projected wireframe icosahedron
 * with an orbiting particle ring. Rotates continuously; mouse position
 * tilts the object (Three.js-style OrbitControls damping, no dependency).
 */

// icosahedron vertices (golden ratio construction)
const PHI = (1 + Math.sqrt(5)) / 2;
const VERTS = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
].map(v => {
  const len = Math.hypot(...v);
  return v.map(c => c / len);
});
const EDGES = [
  [0,1],[0,5],[0,7],[0,10],[0,11],[1,5],[1,7],[1,8],[1,9],[2,3],
  [2,4],[2,6],[2,10],[2,11],[3,4],[3,6],[3,8],[3,9],[4,5],[4,9],
  [4,11],[5,9],[5,11],[6,7],[6,8],[6,10],[7,8],[7,10],[8,9],[10,11],
];

function rotate([x, y, z], ax, ay) {
  // rotate around X then Y
  let cy = Math.cos(ax), sy = Math.sin(ax);
  let y1 = y * cy - z * sy, z1 = y * sy + z * cy;
  let cx = Math.cos(ay), sx = Math.sin(ay);
  let x2 = x * cx + z1 * sx, z2 = -x * sx + z1 * cx;
  return [x2, y1, z2];
}

export default function Hero3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf, t = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * devicePixelRatio;
      canvas.height = r.height * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const getColor = (v) =>
      getComputedStyle(document.documentElement).getPropertyValue(v).trim() || '#38bdf8';

    const draw = () => {
      t += 0.16;
      // damped mouse follow (OrbitControls feel)
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.34;
      const FOV = 3.2;
      const ax = t * 0.006 + mouse.y * 0.6;   // pitch
      const ay = t * 0.009 + mouse.x * 0.9;   // yaw
      const c1 = getColor('--primary');
      const c2 = getColor('--secondary');

      // project all vertices
      const proj = VERTS.map(v => {
        const [x, y, z] = rotate(v, ax, ay);
        const s = FOV / (FOV + z);           // perspective divide
        return { x: cx + x * R * s, y: cy + y * R * s, z, s };
      });

      // edges — depth-faded
      EDGES.forEach(([a, b]) => {
        const pa = proj[a], pb = proj[b];
        const depth = (pa.z + pb.z) / 2;      // -1 (near) … 1 (far)
        const alpha = 0.55 - depth * 0.35;
        const grad = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
        grad.addColorStop(0, c1); grad.addColorStop(1, c2);
        ctx.strokeStyle = grad;
        ctx.globalAlpha = Math.max(0.06, alpha);
        ctx.lineWidth = 1.1 - depth * 0.5;
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
      });
      ctx.globalAlpha = 1;

      // vertices — glowing dots, nearer = bigger
      proj.forEach((p, i) => {
        const r = 2.6 * p.s * (0.8 + 0.2 * Math.sin(t * 0.08 + i));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
        g.addColorStop(0, c1); g.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.9 - p.z * 0.4;
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(p.x, p.y, r * 0.55, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      // orbiting particle ring (tilted ellipse)
      for (let i = 0; i < 26; i++) {
        const a = (i / 26) * Math.PI * 2 + t * 0.012;
        const rx = R * 1.35, rz = R * 1.35;
        const [x, y, z] = rotate([Math.cos(a) * rx / R, 0.05, Math.sin(a) * rz / R], ax * 0.4 + 0.5, ay * 0.3);
        const s = FOV / (FOV + z);
        ctx.globalAlpha = Math.max(0.05, 0.5 - z * 0.35);
        ctx.fillStyle = i % 3 === 0 ? c2 : c1;
        ctx.beginPath();
        ctx.arc(cx + x * R * s, cy + y * R * s, 1.4 * s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: '-40px',
        width: 'calc(100% + 80px)',
        height: 'calc(100% + 80px)',
        pointerEvents: 'none',
        zIndex: 1,
      }}
      aria-hidden="true"
    />
  );
}
