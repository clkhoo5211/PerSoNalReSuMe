import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import './LinkTree.css';

export default function LinkTree() {
  return (
    <section id="links" className="linktree-section">
      <motion.div
        className="lt-strip"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4 }}
      >
        {/* Social icon pills in one tight row */}
        <div className="lt-social-row">
          {profile.social.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.url}
              target={link.url.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="lt-pill"
              initial={{ opacity: 0, scale: 0.75 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 260, damping: 18 }}
              whileHover={{ scale: 1.12, y: -2 }}
              title={link.label}
            >
              <span className="lt-pill-icon">{link.icon}</span>
              <span className="lt-pill-label">{link.label}</span>
            </motion.a>
          ))}
        </div>

        {/* Divider */}
        <div className="lt-divider" />

        {/* Action links as a single compact row */}
        <div className="lt-actions">
          {profile.links.slice(0, 4).map((link, i) => (
            <motion.a
              key={link.label}
              href={link.url}
              target={link.url.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              download={link.url.endsWith('.pdf') ? true : undefined}
              className={`lt-action${link.primary ? ' primary' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.05 }}
              whileHover={{ scale: 1.04 }}
            >
              {link.icon} {link.label}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
