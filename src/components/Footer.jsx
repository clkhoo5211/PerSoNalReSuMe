import { profile } from '../data/profile';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand-dot" style={{ width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px var(--primary)', marginRight: 8 }} />
          {profile.name}
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} {profile.name}. Built with React + Remotion.</p>
        <div className="footer-social">
          {profile.social.map(s => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" title={s.label} className="footer-social-link">
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
