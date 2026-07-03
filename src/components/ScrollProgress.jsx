import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin gradient bar at the very top showing scroll progress, spring-weighted. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: 3,
        transformOrigin: '0 0',
        scaleX,
        zIndex: 400,
        background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
        boxShadow: '0 0 10px var(--primary)',
        pointerEvents: 'none',
      }}
    />
  );
}
