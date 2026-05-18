import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { profile } from '../data/profile';
import AnimatedTitle from './AnimatedTitle';
import './About.css';

const CATEGORY_ICONS = {
  'Blockchain & Web3': '⛓️',
  'Backend': '⚙️',
  'Frontend & Mobile': '🖥️',
  'Database & Infra': '🗄️',
};

const CATEGORY_COLORS = {
  'Blockchain & Web3': '#38bdf8',
  'Backend': '#34d399',
  'Frontend & Mobile': '#a78bfa',
  'Database & Infra': '#fb923c',
};

const ROLE_ICONS = {
  'Chief Information Officer': '🏛️',
  'IT Helpdesk Engineer': '🖥️',
  'International Work Experience': '✈️',
  'Junior System Administrator': '⚙️',
};

const ROLE_TAGS = {
  'Chief Information Officer': ['Blockchain', 'ICP', 'Motoko', 'Vue.js', 'DApps', 'Smart Contracts'],
  'IT Helpdesk Engineer': ['Active Directory', 'POS Systems', 'L1/L2 Support', 'ITSM'],
  'International Work Experience': ['Cross-cultural', 'Adaptability', 'Communication'],
  'Junior System Administrator': ['IBM Director', 'Backup EXEC', 'Lotus', 'Server Admin'],
};

function TimelineItem({ exp, index, isLast }) {
  const [open, setOpen] = useState(index === 0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const tags = ROLE_TAGS[exp.role] || [];
  const icon = ROLE_ICONS[exp.role] || '💼';

  return (
    <motion.div
      ref={ref}
      className="tl-entry"
      initial={{ opacity: 0, x: -32 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.12, ease: 'easeOut' }}
    >
      {/* Connecting line */}
      {!isLast && <div className="tl-line" />}

      {/* Node */}
      <button
        className={`tl-node${open ? ' active' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="tl-node-icon">{icon}</span>
      </button>

      {/* Card */}
      <div className={`tl-card${open ? ' open' : ''}`}>
        <button className="tl-header" onClick={() => setOpen(o => !o)}>
          <div className="tl-header-left">
            <span className="tl-role">{exp.role}</span>
            <span className="tl-company">{exp.company}</span>
          </div>
          <div className="tl-header-right">
            <span className="tl-period">{exp.period}</span>
            <span className="tl-location">📍 {exp.location}</span>
            <span className={`tl-chevron${open ? ' up' : ''}`}>›</span>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              className="tl-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
            >
              <p className="tl-desc">{exp.description}</p>
              {tags.length > 0 && (
                <div className="tl-tags">
                  {tags.map(t => <span key={t} className="tl-tag">{t}</span>)}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function SkillsSection() {
  const categories = Object.keys(profile.skills);
  const [active, setActive] = useState(categories[0]);
  const color = CATEGORY_COLORS[active] || '#38bdf8';
  const skills = profile.skills[active];

  return (
    <div className="skills-section">
      <h3>Technical Skills</h3>
      {/* Tab row */}
      <div className="skills-tabs">
        {categories.map(cat => (
          <button
            key={cat}
            className={`skills-tab${active === cat ? ' active' : ''}`}
            style={active === cat ? { '--sc': CATEGORY_COLORS[cat] } : {}}
            onClick={() => setActive(cat)}
          >
            <span className="skills-tab-icon">{CATEGORY_ICONS[cat]}</span>
            {cat}
          </button>
        ))}
      </div>

      {/* Skill pills for active category */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="skills-pills-wrap"
          style={{ '--sc': color }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
        >
          <div className="skills-pills-bg" />
          {skills.map((s, i) => (
            <motion.span
              key={s}
              className="skill-chip"
              initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.045, type: 'spring', stiffness: 280, damping: 18 }}
            >
              {s}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function CompetenciesSection() {
  return (
    <div className="about-competencies">
      <h3>Core Competencies</h3>
      <div className="competency-grid">
        {profile.competencies.map((c, i) => (
          <motion.div
            key={c}
            className="comp-card"
            initial={{ opacity: 0, scale: 0.75 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 200, damping: 16 }}
            whileHover={{ scale: 1.07, y: -3 }}
          >
            <div className="comp-ring" />
            <span className="comp-index">{String(i + 1).padStart(2, '0')}</span>
            <span className="comp-label">{c}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="section">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatedTitle>About Me</AnimatedTitle>

        <div className="about-grid">
          <div className="about-bio">
            <p>{profile.bio}</p>
            <p style={{ marginTop: 'var(--sp-sm)', fontSize: 14 }}>
              📍 {profile.location} &nbsp;·&nbsp; 📞 {profile.phone}
            </p>
            <div className="about-highlights">
              {profile.highlights.map((h, i) => (
                <span key={i} className="about-highlight-badge">{h}</span>
              ))}
            </div>
            <div className="about-languages">
              <span className="about-lang-label">Languages:</span>
              {profile.languages.map(l => (
                <span key={l} className="tag">{l}</span>
              ))}
            </div>
          </div>

          <div className="about-experience">
            <h3>Experience</h3>
            <div className="tl-root">
              {profile.experience.map((exp, i) => (
                <TimelineItem
                  key={i}
                  exp={exp}
                  index={i}
                  isLast={i === profile.experience.length - 1}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="about-education">
          <h3>Education</h3>
          <div className="edu-grid">
            {profile.education.map((edu, i) => (
              <motion.div key={i} className="edu-card"
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.45 }}>
                <div className="edu-ribbon">{i === 0 ? '🎓 Bachelor' : '📚 Pre-Uni'}</div>
                <div className="edu-body">
                  <div className="edu-degree">{edu.degree}</div>
                  <div className="edu-institution">{edu.institution}</div>
                  <div className="edu-period">{edu.period}</div>
                  <div className="edu-achievement">
                    <span className="edu-star">★</span> {edu.achievement}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skills — tab switcher */}
        <SkillsSection />

        {/* Competencies — orbital glow cards */}
        <CompetenciesSection />
      </motion.div>
    </section>
  );
}
