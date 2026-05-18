import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { posts } from '../data/blog';
import './Blog.css';

const TAG_COLORS = {
  'MCP': '#38bdf8', 'AI': '#a78bfa', 'Tutorial': '#34d399',
  'Web3': '#f472b6', 'Security': '#fb923c', 'Solidity': '#818cf8',
  'React': '#38bdf8', 'Performance': '#facc15', 'Architecture': '#34d399',
};

const allTags = ['All', ...Array.from(new Set(posts.flatMap(p => p.tags)))];

export default function Blog() {
  const [activeTag, setActiveTag] = useState('All');
  const [hovered, setHovered] = useState(null);

  const filtered = activeTag === 'All' ? posts : posts.filter(p => p.tags.includes(activeTag));
  const [featured, ...rest] = filtered;

  return (
    <section id="blog" className="section">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="blog-header">
          <div>
            <h2 className="section-title" style={{ marginBottom: 6 }}>Blog</h2>
            <p className="blog-subtitle">Thoughts on Blockchain · AI · Web3</p>
          </div>
          {/* Filter pills */}
          <div className="blog-filters">
            {allTags.map(tag => (
              <button
                key={tag}
                className={`blog-filter-pill${activeTag === tag ? ' active' : ''}`}
                style={activeTag === tag && TAG_COLORS[tag] ? { '--fc': TAG_COLORS[tag] } : {}}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTag}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* Featured post — horizontal card */}
            {featured && (
              <motion.div
                className="blog-featured"
                style={{ '--ac': TAG_COLORS[featured.tags[0]] || '#38bdf8' }}
                onMouseEnter={() => setHovered('feat')}
                onMouseLeave={() => setHovered(null)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {/* Animated gradient bg on hover */}
                <div className={`blog-featured-glow${hovered === 'feat' ? ' show' : ''}`} />

                <div className="blog-featured-left">
                  <div className="blog-feat-eyebrow">
                    <span className="blog-feat-dot" />
                    Latest Post
                  </div>
                  <h3 className="blog-feat-title">{featured.title}</h3>
                  <p className="blog-feat-summary">{featured.summary}</p>
                  <div className="blog-feat-meta">
                    <time>{featured.date}</time>
                    <span>·</span>
                    <span>⏱ {featured.readTime}</span>
                  </div>
                </div>

                <div className="blog-featured-right">
                  <div className="blog-feat-tags">
                    {featured.tags.map(t => (
                      <span key={t} className="blog-tag" style={{ '--tc': TAG_COLORS[t] || '#38bdf8' }}>{t}</span>
                    ))}
                  </div>
                  <Link to={`/blog/${featured.id}`} className="blog-feat-btn">
                    Read Article <span className="blog-btn-arrow">→</span>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Grid of remaining posts */}
            {rest.length > 0 && (
              <div className="blog-grid">
                {rest.map((post, i) => (
                  <motion.article
                    key={post.id}
                    className="blog-card"
                    style={{ '--ac': TAG_COLORS[post.tags[0]] || '#38bdf8' }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                  >
                    <div className="blog-card-bar" />
                    <div className="blog-card-inner">
                      <div className="blog-card-tags">
                        {post.tags.map(t => (
                          <span key={t} className="blog-tag" style={{ '--tc': TAG_COLORS[t] || '#38bdf8' }}>{t}</span>
                        ))}
                      </div>
                      <h3 className="blog-card-title">{post.title}</h3>
                      <p className="blog-card-summary">{post.summary}</p>
                      <div className="blog-card-footer">
                        <span className="blog-card-date">{post.date} · ⏱ {post.readTime}</span>
                        <Link to={`/blog/${post.id}`} className="blog-card-link">Read →</Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            {filtered.length === 0 && (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>No posts for this tag.</p>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
