import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export default function ProjectAnimation({ title, category, color }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const slideUp = spring({ fps, frame, config: { damping: 18, stiffness: 80 } });
  const y = interpolate(slideUp, [0, 1], [30, 0]);

  // Looping float
  const loopFrame = frame % 90;
  const float = interpolate(loopFrame, [0, 45, 90], [0, -6, 0]);

  // Background pulse
  const pulse = interpolate(loopFrame, [0, 45, 90], [0.06, 0.12, 0.06]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `radial-gradient(circle at 50% 50%, rgba(${color === '#00D4FF' ? '0,212,255' : color === '#6366F1' ? '99,102,241' : '16,185,129'},${pulse}) 0%, rgba(15,23,42,0.95) 70%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative grid lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(rgba(${color === '#00D4FF' ? '0,212,255' : '99,102,241'},0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(${color === '#00D4FF' ? '0,212,255' : '99,102,241'},0.05) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      <div style={{ transform: `translateY(${y + float}px)`, textAlign: 'center', zIndex: 1 }}>
        <div style={{
          fontSize: 36,
          marginBottom: 12,
        }}>
          {category === 'AI' ? '🤖' : category === 'Web3' ? '⛓️' : '🚀'}
        </div>
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 16,
          fontWeight: 700,
          color: color,
          letterSpacing: 0.5,
        }}>
          {title}
        </div>
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 12,
          color: 'rgba(148,163,184,0.8)',
          marginTop: 6,
          background: `rgba(${color === '#00D4FF' ? '0,212,255' : color === '#6366F1' ? '99,102,241' : '16,185,129'},0.12)`,
          padding: '2px 10px',
          borderRadius: 999,
          border: `1px solid ${color}33`,
        }}>
          {category}
        </div>
      </div>
    </div>
  );
}
