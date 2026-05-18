import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import ProjectCardCanvas from './ProjectCardCanvas';
import ProjectMediaViewer from './ProjectMediaViewer';
import AnimatedTitle from './AnimatedTitle';
import MagneticButton from './MagneticButton';
import './ProjectDetail.css';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);


  if (!project) {
    return (
      <div className="pd-not-found">
        <h2>Project not found</h2>
        <Link to="/" className="btn btn-outline">← Back home</Link>
      </div>
    );
  }

  const related = projects.filter(p => p.id !== id && p.category === project.category).slice(0, 2);

  return (
    <motion.div
      className="pd-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back nav */}
      <div className="pd-nav section">
        <button className="pd-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="pd-breadcrumb">
          <Link to="/">Home</Link> / <Link to="/#projects">Projects</Link> / {project.title}
        </div>
      </div>

      <div className="pd-layout section">
        {/* Left: media + meta */}
        <div className="pd-left">
          <ProjectMediaViewer project={project} />

          {/* Remotion animation preview */}
          {(project.media || []).length === 0 && (
            <div className="pd-animation-label">Live Animation Preview</div>
          )}

          {/* Meta card */}
          <div className="pd-meta-card card">
            <div className="pd-meta-row">
              <span className="pd-meta-key">Category</span>
              <span className="tag">{project.category}</span>
            </div>
            <div className="pd-meta-row">
              <span className="pd-meta-key">Status</span>
              <span className={`status-dot status-${project.status.toLowerCase().replace(/\s/g, '-')}`}>
                {project.status}
              </span>
            </div>
            <div className="pd-meta-row">
              <span className="pd-meta-key">Stack</span>
              <div className="pd-meta-tags">
                {project.tech.map(t => <span key={t} className="tag tag-secondary">{t}</span>)}
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="pd-cta">
            {project.liveUrl && project.liveUrl !== '#' && (
              <MagneticButton>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  🚀 Live Demo
                </a>
              </MagneticButton>
            )}
            {project.sourceUrl && project.sourceUrl !== '#' && (
              <MagneticButton>
                <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  💻 Source Code
                </a>
              </MagneticButton>
            )}
          </div>
        </div>

        {/* Right: content */}
        <div className="pd-right">
          <div className="section-eyebrow">{project.category}</div>
          <AnimatedTitle className="pd-title">{project.title}</AnimatedTitle>

          <p className="pd-description">{project.description}</p>

          {project.highlights && project.highlights.length > 0 && (
            <div className="pd-section">
              <h3 className="pd-section-label">Highlights</h3>
              <ul className="pd-highlights">
                {project.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {project.challenge && (
            <div className="pd-section">
              <h3 className="pd-section-label">The Challenge</h3>
              <p className="pd-body-text">{project.challenge}</p>
            </div>
          )}

          {project.solution && (
            <div className="pd-section">
              <h3 className="pd-section-label">The Solution</h3>
              <p className="pd-body-text">{project.solution}</p>
            </div>
          )}

          {/* Related projects */}
          {related.length > 0 && (
            <div className="pd-section pd-related">
              <h3 className="pd-section-label">Related Projects</h3>
              <div className="pd-related-grid">
                {related.map(r => (
                  <Link key={r.id} to={`/projects/${r.id}`} className="pd-related-card card">
                    <div className="pd-related-animation">
                      <ProjectCardCanvas
                        projectId={r.id}
                        category={r.category}
                        title={r.title}
                      />
                    </div>
                    <div className="pd-related-info">
                      <span className="tag">{r.category}</span>
                      <strong>{r.title}</strong>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
