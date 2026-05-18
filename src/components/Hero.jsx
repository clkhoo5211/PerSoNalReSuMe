import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import ParticleField from './ParticleField';
import MagneticButton from './MagneticButton';
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
          <h1 className="hero-name glitch-name" data-text={profile.name}>{profile.name}</h1>
          <p className="hero-title">{profile.title}</p>
          <p className="hero-tagline">
            <span className="tagline-text">{displayed}</span>
            <span className="cursor" />
          </p>
          <p className="hero-bio">{profile.bio}</p>
          <div className="hero-cta">
            <MagneticButton>
              <button className="btn btn-primary" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>View Projects</button>
            </MagneticButton>
            <MagneticButton>
              <button className="btn btn-outline" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Get In Touch</button>
            </MagneticButton>
          </div>
          <div className="hero-social">
            {profile.social.map(s => (
              <MagneticButton key={s.label} strength={0.5}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="social-link" title={s.label}>
                  {s.icon}
                </a>
              </MagneticButton>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
        >
          <div className="hero-glow" />
          <div className="hero-terminal">
            <div className="terminal-titlebar">
              <div className="terminal-dot dot-red" />
              <div className="terminal-dot dot-yellow" />
              <div className="terminal-dot dot-green" />
              <span className="terminal-title">portfolio.ts</span>
            </div>
            <div className="terminal-body">
              <div className="t-comment">// Building the future, one commit at a time</div>
              <div><span className="t-keyword">const </span><span className="t-fn">developer</span> = {'{'}</div>
              <div className="t-indent"><span className="t-prop">name</span>: <span className="t-string">"{profile.name}"</span>,</div>
              <div className="t-indent"><span className="t-prop">role</span>: <span className="t-string">"{profile.title}"</span>,</div>
              <div className="t-indent"><span className="t-prop">stack</span>: [</div>
              <div className="t-indent2"><span className="t-string">"React"</span>, <span className="t-string">"Node.js"</span>,</div>
              <div className="t-indent2"><span className="t-string">"Solidity"</span>, <span className="t-string">"Python"</span>,</div>
              <div className="t-indent2"><span className="t-string">"AWS"</span>, <span className="t-string">"AI/ML"</span></div>
              <div className="t-indent">],</div>
              <div className="t-indent"><span className="t-prop">available</span>: <span className="t-value">true</span>,</div>
              <div className="t-indent"><span className="t-prop">coffee</span>: <span className="t-value">Infinity</span>,</div>
              {'}'}</div>
          </div>
          <div className="floating-badge badge-1">
            <span className="badge-icon">🤖</span> AI Engineer
          </div>
          <div className="floating-badge badge-2">
            <span className="badge-icon">✓</span> Open to Work
          </div>
          <div className="floating-badge badge-3">
            <span className="badge-icon">⛓️</span> Web3 Dev
          </div>
        </motion.div>
      </div>
    </section>
  );
}
