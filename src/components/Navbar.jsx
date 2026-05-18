import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home',     id: 'hero'     },
  { label: 'About',    id: 'about'    },
  { label: 'Projects', id: 'projects' },
  { label: 'Blog',     id: 'blog'     },
  { label: 'News',     id: 'news'     },
  { label: 'Contact',  id: 'contact'  },
];

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Navbar({ theme, onThemeToggle }) {
  const [active, setActive] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      if (location.pathname !== '/') return;
      for (let i = NAV_LINKS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_LINKS[i].id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(NAV_LINKS[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  const handleNavClick = (id) => {
    setMenuOpen(false);
    if (location.pathname === '/') {
      scrollToId(id);
    } else {
      navigate('/');
      // wait for home page to mount then scroll
      setTimeout(() => scrollToId(id), 120);
    }
  };

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <button className="navbar-brand" onClick={() => handleNavClick('hero')}>
        <span className="brand-dot" />
        KCL
      </button>

      <ul className={`navbar-links${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(({ label, id }) => (
          <li key={id}>
            <button
              className={`nav-link-btn${active === id && location.pathname === '/' ? ' active' : ''}`}
              onClick={() => handleNavClick(id)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      <div className="navbar-actions">
        <Link to="/tip" className="tip-nav-btn" title="Buy me a coffee">☕</Link>
        <button className="theme-toggle" onClick={onThemeToggle} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button
          className={`hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
