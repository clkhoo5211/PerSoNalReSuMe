import { motion } from 'framer-motion';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035 } },
};
const word = {
  hidden: { opacity: 0, y: 40, rotateX: -40 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: 'spring', damping: 14, stiffness: 120 } },
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
      style={{ perspective: 600, display: 'flex', flexWrap: 'wrap', gap: '0 0.3em' }}
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={word} style={{ display: 'inline-block' }}>
          {w}
        </motion.span>
      ))}
    </motion.h2>
  );
}
