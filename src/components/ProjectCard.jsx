import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { Player } from '@remotion/player';
import ProjectAnimation from './remotion/ProjectAnimation';
import Modal from './Modal';
import './ProjectCard.css';

export default function ProjectCard({ project, index }) {
  const [open, setOpen] = useState(false);

  const inputProps = useMemo(() => ({
    title: project.title,
    category: project.category,
    color: project.category === 'AI' ? '#00D4FF' : project.category === 'Web3' ? '#6366F1' : '#10B981',
  }), [project]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ delay: index * 0.08, duration: 0.4 }}
      >
        <Tilt
          tiltMaxAngleX={10}
          tiltMaxAngleY={10}
          perspective={1000}
          scale={1.02}
          transitionSpeed={500}
          glareEnable
          glareMaxOpacity={0.12}
          glareColor="rgba(56,189,248,0.6)"
          glareBorderRadius="20px"
          tiltEnable
        >
          <article
            className="project-card card"
            onClick={() => setOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setOpen(true)}
          >
            <div className="project-media">
              <Player
                component={ProjectAnimation}
                compositionWidth={400}
                compositionHeight={220}
                durationInFrames={150}
                fps={30}
                inputProps={inputProps}
                style={{ width: '100%', borderRadius: '8px 8px 0 0' }}
                autoPlay
                loop
                muted
                controls={false}
                clickToPlay={false}
              />
              <div className="project-category-badge">
                <span className="tag">{project.category}</span>
                <span className={`status-dot status-${project.status.toLowerCase().replace(/\s/g, '-')}`}>{project.status}</span>
              </div>
            </div>

            <div className="project-body">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>
              <div className="project-tech">
                {project.tech.slice(0, 4).map(t => (
                  <span key={t} className="tag tag-secondary">{t}</span>
                ))}
                {project.tech.length > 4 && <span className="tag">+{project.tech.length - 4}</span>}
              </div>
            </div>
          </article>
        </Tilt>
      </motion.div>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <h2 className="modal-title">{project.title}</h2>
          <div className="modal-meta">
            <span className="tag">{project.category}</span>
            <span className={`status-dot status-${project.status.toLowerCase().replace(/\s/g, '-')}`}>{project.status}</span>
          </div>
          <p className="modal-desc">{project.description}</p>
          <div className="modal-section">
            <div className="modal-label">Tech Stack</div>
            <div className="modal-tech">
              {project.tech.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
          <div className="modal-actions">
            {project.liveUrl && project.liveUrl !== '#' && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                🚀 Live Demo
              </a>
            )}
            {project.sourceUrl && project.sourceUrl !== '#' && (
              <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                💻 Source Code
              </a>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
