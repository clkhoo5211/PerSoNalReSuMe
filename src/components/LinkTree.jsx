import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import './LinkTree.css';

export default function LinkTree() {
  return (
    <section id="links" className="linktree-section section">
      <motion.div
        className="linktree-inner"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-title" style={{ textAlign: 'center' }}>Quick Links</h2>
        <p className="linktree-subtitle">Find me everywhere</p>

        <div className="link-list">
          {profile.links.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.url}
              target={link.url.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={`link-btn${link.primary ? ' link-btn-primary' : ''}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <span className="link-icon">{link.icon}</span>
              {link.label}
              <span className="link-arrow">→</span>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
