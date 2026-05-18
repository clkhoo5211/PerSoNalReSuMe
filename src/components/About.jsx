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
            <p>📍 {profile.location}</p>
          </div>

          <div className="about-experience">
            <h3>Experience</h3>
            <div className="timeline">
              {profile.experience.map((exp, i) => (
                <motion.div
                  key={i}
                  className="timeline-item"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="timeline-dot" />
                  <div>
                    <div className="timeline-role">{exp.role}</div>
                    <div className="timeline-company">{exp.company} · {exp.period}</div>
                    <div className="timeline-desc">{exp.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="skills-section">
          <h3>Skills</h3>
          <div className="skills-grid">
            {Object.entries(profile.skills).map(([category, skills]) => (
              <motion.div
                key={category}
                className="card skill-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <h4 className="skill-category">{category}</h4>
                <div className="skill-tags">
                  {skills.map(s => (
                    <span key={s} className="tag">{s}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
