import { motion } from 'framer-motion';

/**
 * GSAP SplitText-style reveal: each character rises from below with
 * blur + 3D rotation, staggered left-to-right. Words stay intact for wrapping.
 */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.022 } },
};
const char = {
  hidden: { opacity: 0, y: '0.95em', rotateX: -70 },
  visible: {
    opacity: 1, y: 0, rotateX: 0,
    transition: { type: 'spring', damping: 16, stiffness: 160 },
  },
};

export default function AnimatedTitle({ children, className = 'section-title' }) {
  const words = String(children).split(' ');
  return (
    <motion.h2
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      style={{ perspective: 500, display: 'flex', flexWrap: 'wrap', gap: '0 0.32em' }}
      aria-label={String(children)}
    >
      {words.map((w, wi) => (
        <span key={wi} style={{ display: 'inline-flex', overflow: 'hidden', padding: '0.08em 0' }} aria-hidden="true">
          {[...w].map((c, ci) => (
            <motion.span
              key={ci}
              variants={char}
              style={{ display: 'inline-block', transformOrigin: '50% 100%', willChange: 'transform' }}
            >
              {c}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h2>
  );
}
