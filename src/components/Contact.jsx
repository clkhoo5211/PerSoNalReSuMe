import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { profile } from '../data/profile';
import AnimatedTitle from './AnimatedTitle';
import './Contact.css';

// ─── EmailJS config ───────────────────────────────────────────────────────────
// 1. Sign up free at https://www.emailjs.com (200 emails/month free)
// 2. Create a service (Gmail) → copy Service ID below
// 3. Create a template with variables: {{from_name}}, {{from_email}}, {{message}}
//    Set "To Email" in the template to kcl5211@gmail.com
// 4. Copy your Public Key from Account → API Keys
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xyz456'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'AbCdEfGhIjKlMnOp'
// ─────────────────────────────────────────────────────────────────────────────

export default function Contact() {
  const formRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: 'error', msg: 'Please fill all fields.' });
      return;
    }

    // If EmailJS is not yet configured, fall back to mailto
    if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
      const subject = encodeURIComponent(`Portfolio contact from ${form.name}`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
      window.open(`mailto:kcl5211@gmail.com?subject=${subject}&body=${body}`, '_blank');
      setStatus({ type: 'success', msg: '✅ Opening your email client — message pre-filled!' });
      setForm({ name: '', email: '', message: '' });
      return;
    }

    setSending(true);
    setStatus(null);
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY,
      );
      setStatus({ type: 'success', msg: "✅ Message sent! I'll get back to you soon." });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: '❌ Failed to send. Please email kcl5211@gmail.com directly.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="section">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatedTitle>Get In Touch</AnimatedTitle>

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

          <form ref={formRef} className="contact-form card" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input id="name" name="from_name" type="text" placeholder="Your name"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="from_email" type="email" placeholder="your@email.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={5} placeholder="Tell me about your project..."
                value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
            </div>
            {status && (
              <div className={`form-status form-status-${status.type}`}>{status.msg}</div>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={sending}>
              {sending ? 'Sending…' : 'Send Message 🚀'}
            </button>
            <p className="contact-form-note">
              Or email directly: <a href="mailto:kcl5211@gmail.com">kcl5211@gmail.com</a>
            </p>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
