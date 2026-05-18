import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import ParticleField from './ParticleField';
import './Hero.css';

export default function Hero() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const charRef = useRef(0);

  useEffect(() => {
    const target = profile.taglines[taglineIndex];
    if (typing) {
      if (charRef.current < target.length) {
        const t = setTimeout(() => {
          setDisplayed(target.slice(0, charRef.current + 1));
          charRef.current++;
        }, 55);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 2000);
        return () => clearTimeout(t);
      }
    } else {
      if (charRef.current > 0) {
        const t = setTimeout(() => {
          setDisplayed(target.slice(0, charRef.current - 1));
          charRef.current--;
        }, 30);
        return () => clearTimeout(t);
      } else {
        setTaglineIndex(i => (i + 1) % profile.taglines.length);
        setTyping(true);
      }
    }
  }, [typing, taglineIndex, displayed]);

  return (
    <section id="hero" className="hero-section">
      <ParticleField />
      <div className="hero-content section">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="hero-greeting">Hi, I'm</span>
          <h1 className="hero-name">{profile.name}</h1>
          <p className="hero-title">{profile.title}</p>
          <p className="hero-tagline">
            <span className="tagline-text">{displayed}</span>
            <span className="cursor" />
          </p>
          <p className="hero-bio">{profile.bio}</p>
          <div className="hero-cta">
            <a href="#projects" className="btn btn-primary">View Projects</a>
            <a href="#contact" className="btn btn-outline">Get In Touch</a>
          </div>
          <div className="hero-social">
            {profile.social.map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="social-link" title={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        >
          <div className="avatar-ring">
            <div className="avatar-inner">
              <span className="avatar-emoji">👨‍💻</span>
            </div>
          </div>
          <div className="floating-badge badge-1">🤖 AI</div>
          <div className="floating-badge badge-2">⛓️ Web3</div>
          <div className="floating-badge badge-3">☁️ Cloud</div>
        </motion.div>
      </div>
    </section>
  );
}
