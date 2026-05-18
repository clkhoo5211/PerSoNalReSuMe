import { useState } from 'react';
import { motion } from 'framer-motion';
import { posts } from '../data/blog';
import Modal from './Modal';
import './Blog.css';

export default function Blog() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="blog" className="section">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-title">Blog</h2>

        <div className="blog-list">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              className="blog-card card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              onClick={() => setSelected(post)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setSelected(post)}
            >
              <div className="blog-meta">
                <time>{post.date}</time>
                <span className="blog-readtime">· {post.readTime}</span>
              </div>
              <h3 className="blog-title">{post.title}</h3>
              <p className="blog-summary">{post.summary}</p>
              <div className="blog-tags">
                {post.tags.map(t => <span key={t} className="tag tag-secondary">{t}</span>)}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div className="blog-modal-meta">
            <time>{selected.date}</time>
            <span>· {selected.readTime}</span>
          </div>
          <h2 className="modal-title">{selected.title}</h2>
          <div className="blog-tags" style={{ marginBottom: 'var(--space-md)' }}>
            {selected.tags.map(t => <span key={t} className="tag tag-secondary">{t}</span>)}
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>{selected.content}</p>
        </Modal>
      )}
    </section>
  );
}
