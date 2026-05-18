import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { posts } from '../data/blog';
import './Blog.css';

const TAG_COLORS = {
  'MCP': '#38bdf8',
  'AI': '#a78bfa',
  'Tutorial': '#34d399',
  'Web3': '#f472b6',
  'Security': '#fb923c',
  'Solidity': '#818cf8',
  'React': '#38bdf8',
  'Performance': '#facc15',
  'Architecture': '#34d399',
};

function BlogCard({ post, featured = false, index = 0 }) {
  const accentColor = TAG_COLORS[post.tags[0]] || '#38bdf8';

  return (
    <motion.article
      className={`bc${featured ? ' bc-featured' : ''}`}
      style={{ '--accent-color': accentColor }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: index * 0.08, duration: 0.42 }}
      whileHover={{ y: -4 }}
    >
      {/* Top accent bar */}
      <div className="bc-accent-bar" />

      {featured && <div className="bc-featured-badge">✦ Featured</div>}

      <div className="bc-inner">
        <div className="bc-meta">
          <time className="bc-date">{post.date}</time>
          <span className="bc-dot">·</span>
          <span className="bc-readtime">⏱ {post.readTime}</span>
        </div>

        <h3 className={`bc-title${featured ? ' bc-title-lg' : ''}`}>{post.title}</h3>
        <p className="bc-summary">{post.summary}</p>

        <div className="bc-footer">
          <div className="bc-tags">
            {post.tags.map(t => (
              <span key={t} className="bc-tag" style={{ '--tc': TAG_COLORS[t] || '#38bdf8' }}>{t}</span>
            ))}
          </div>
          <Link
            to={`/blog/${post.id}`}
            className="bc-btn"
            onClick={e => e.stopPropagation()}
          >
            Read {featured ? 'Article' : 'More'} →
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function Blog() {
  const [featured, ...rest] = posts;

  return (
    <section id="blog" className="section">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="blog-header-row">
          <h2 className="section-title" style={{ marginBottom: 0 }}>Blog</h2>
          <span className="blog-header-note">Thoughts on Blockchain · AI · Web3</span>
        </div>

        {/* Featured post */}
        {featured && (
          <div className="blog-featured-wrap">
            <BlogCard post={featured} featured index={0} />
          </div>
        )}

        {/* Remaining posts grid */}
        {rest.length > 0 && (
          <div className="blog-grid">
            {rest.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i + 1} />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
