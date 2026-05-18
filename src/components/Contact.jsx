import { useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: 'error', msg: 'Please fill all fields.' });
      return;
    }
    // In production, wire up to Formspree, EmailJS, or a backend
    setStatus({ type: 'success', msg: '✅ Message sent! I\'ll get back to you soon.' });
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="section">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-title">Get In Touch</h2>

        <div className="contact-grid">
          <div className="contact-info">
            <p className="contact-lead">
              Have a project in mind? Let's build something amazing together.
            </p>
            <div className="contact-links">
              {profile.social.map(s => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="contact-link">
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </a>
              ))}
            </div>
          </div>

          <form className="contact-form card" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Tell me about your project..."
                value={form.message}
                onChange={handleChange}
              />
            </div>
            {status && (
              <div className={`form-status form-status-${status.type}`}>{status.msg}</div>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Send Message 🚀
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
