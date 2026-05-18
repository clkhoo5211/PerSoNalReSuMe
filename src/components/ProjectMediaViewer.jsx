import { useState } from 'react';
import ProjectCardCanvas from './ProjectCardCanvas';
import './ProjectMediaViewer.css';

function isVideo(url) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

function MediaSlide({ item }) {
  if (typeof item === 'string' && isVideo(item)) {
    return (
      <video
        src={item}
        className="pmv-slide-video"
        autoPlay
        loop
        muted
        playsInline
        controls
      />
    );
  }
  const src = typeof item === 'string' ? item : item.src;
  const alt = typeof item === 'object' && item.alt ? item.alt : 'Project screenshot';
  return <img src={src} alt={alt} className="pmv-slide-img" />;
}

export default function ProjectMediaViewer({ project }) {
  const media = project.media || [];
  const hasMedia = media.length > 0;

  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(i => (i - 1 + media.length) % media.length);
  const next = () => setCurrent(i => (i + 1) % media.length);

  if (!hasMedia) {
    return (
      <div className="pmv-root pmv-placeholder">
        <div className="pmv-remotion-wrap">
          <ProjectCardCanvas
            projectId={project.id}
            category={project.category}
            title={project.title}
            style={{ width: '100%', height: '100%', borderRadius: '10px' }}
          />
        </div>
        <div className="pmv-placeholder-label">
          <span className="pmv-placeholder-icon">🎬</span>
          <span>Drop images, GIFs or a video URL into <code>media</code> in projects.js to show them here</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pmv-root">
      {/* Main slide */}
      <div className="pmv-stage">
        <MediaSlide item={media[current]} />

        {media.length > 1 && (
          <>
            <button className="pmv-arrow pmv-arrow-left"  onClick={prev} aria-label="Previous">‹</button>
            <button className="pmv-arrow pmv-arrow-right" onClick={next} aria-label="Next">›</button>
          </>
        )}

        {/* Counter badge */}
        {media.length > 1 && (
          <div className="pmv-counter">{current + 1} / {media.length}</div>
        )}
      </div>

      {/* Dot navigation */}
      {media.length > 1 && (
        <div className="pmv-dots">
          {media.map((_, i) => (
            <button
              key={i}
              className={`pmv-dot${i === current ? ' active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail strip for 3+ items */}
      {media.length >= 3 && (
        <div className="pmv-thumbs">
          {media.map((item, i) => {
            const src = typeof item === 'string' ? item : item.src;
            return (
              <button
                key={i}
                className={`pmv-thumb${i === current ? ' active' : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
              >
                {isVideo(src)
                  ? <span className="pmv-thumb-video-icon">▶</span>
                  : <img src={src} alt="" />
                }
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
