import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchPosts } from '../data/blog';
import AnimatedTitle from './AnimatedTitle';
import GiscusComments from './GiscusComments';
import './BlogDetail.css';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => { fetchPosts().then(setPosts); }, []);

  const post = posts.find(p => p.id === id);

  if (posts.length > 0 && !post) {
    return (
      <div className="bd-not-found">
        <h2>Post not found</h2>
        <Link to="/" className="btn btn-outline">← Back home</Link>
      </div>
    );
  }

  if (!post) return <div className="bd-not-found" style={{ color: 'var(--text-muted)' }}>Loading…</div>;

  const related = posts.filter(p => p.id !== id).slice(0, 3);

  return (
    <motion.div
      className="bd-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bd-inner section">
        {/* Back nav */}
        <div className="pd-nav" style={{ marginBottom: 'var(--sp-lg)' }}>
          <button className="pd-back" onClick={() => navigate(-1)}>← Back</button>
          <div className="pd-breadcrumb">
            <Link to="/">Home</Link> / <Link to="/#blog">Blog</Link> / {post.title}
          </div>
        </div>

        <div className="bd-layout">
          {/* Main article */}
          <article className="bd-article">
            <div className="section-eyebrow">Article</div>
            <AnimatedTitle className="bd-title">{post.title}</AnimatedTitle>

            <div className="bd-byline">
              <time>{post.date}</time>
              <span className="bd-sep">·</span>
              <span>{post.readTime} read</span>
              <div className="bd-tags">
                {post.tags.map(t => <span key={t} className="tag tag-secondary">{t}</span>)}
              </div>
            </div>

            <p className="bd-summary">{post.summary}</p>

            <div className="bd-divider" />

            <div className="bd-content">
              {post.content.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Comments section */}
            <div className="bd-comments">
              <h3 className="pd-section-label">Comments & Discussion</h3>
              <GiscusComments term={post.id} />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="bd-sidebar">
            <div className="bd-sidebar-card card">
              <h4 className="bd-sidebar-heading">More Posts</h4>
              {related.map(r => (
                <Link key={r.id} to={`/blog/${r.id}`} className="bd-sidebar-post">
                  <div className="bd-sidebar-post-title">{r.title}</div>
                  <div className="bd-sidebar-post-meta">{r.date} · {r.readTime}</div>
                </Link>
              ))}
            </div>

            <div className="bd-sidebar-card card">
              <h4 className="bd-sidebar-heading">Share</h4>
              <div className="bd-share-btns">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-outline bd-share-btn"
                >
                  𝕏 Twitter
                </a>
                <button
                  className="btn btn-outline bd-share-btn"
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                >
                  🔗 Copy Link
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
}
