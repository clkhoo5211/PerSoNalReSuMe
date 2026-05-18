import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import AnimatedTitle from './AnimatedTitle';
import './About.css';

export default function About() {
  return (
    <section id="about" className="section">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
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
            <div className="timeline">
              {profile.experience.map((exp, i) => (
                <motion.div key={i} className="timeline-item"
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="timeline-dot" />
                  <div>
                    <div className="timeline-role">{exp.role}</div>
                    <div className="timeline-company">{exp.company} · {exp.location} · {exp.period}</div>
                    <div className="timeline-desc">{exp.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="about-education">
          <h3>Education</h3>
          <div className="edu-grid">
            {profile.education.map((edu, i) => (
              <motion.div key={i} className="card edu-card"
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="edu-degree">{edu.degree}</div>
                <div className="edu-institution">{edu.institution}</div>
                <div className="edu-period">{edu.period}</div>
                <div className="edu-achievement">{edu.achievement}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="skills-section">
          <h3>Technical Skills</h3>
          <div className="skills-grid">
            {Object.entries(profile.skills).map(([category, skills]) => (
              <motion.div key={category} className="card skill-card"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4 }}>
                <h4 className="skill-category">{category}</h4>
                <div className="skill-tags">
                  {skills.map(s => <span key={s} className="tag">{s}</span>)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="about-competencies">
          <h3>Core Competencies</h3>
          <div className="competency-grid">
            {profile.competencies.map((c, i) => (
              <motion.div key={c} className="competency-item card"
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                {c}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
