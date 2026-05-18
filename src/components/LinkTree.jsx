import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import './LinkTree.css';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, scale: 0.7, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 18 } },
};

export default function LinkTree() {
  return (
    <section id="links" className="linktree-section section">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-title" style={{ textAlign: 'center' }}>Find Me</h2>
        <p className="linktree-subtitle">Connect across the web</p>

        {/* Social icons row */}
        <motion.div
          className="lt-social-row"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {profile.social.map(link => (
            <motion.a
              key={link.label}
              href={link.url}
              target={link.url.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="lt-social-orb"
              variants={item}
              whileHover={{ scale: 1.18, y: -4 }}
              title={link.label}
            >
              <span className="lt-orb-icon">{link.icon}</span>
              <span className="lt-orb-label">{link.label}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* Action links grid */}
        <motion.div
          className="lt-action-grid"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {profile.links.slice(0, 4).map(link => (
            <motion.a
              key={link.label}
              href={link.url}
              target={link.url.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              download={link.url.endsWith('.pdf') ? true : undefined}
              className={`lt-action-card${link.primary ? ' primary' : ''}`}
              variants={item}
              whileHover={{ scale: 1.04, y: -3 }}
            >
              <span className="lt-action-icon">{link.icon}</span>
              <span className="lt-action-label">{link.label}</span>
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
