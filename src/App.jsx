import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import BackgroundCanvas from './components/BackgroundCanvas';
import { motion } from 'framer-motion';
import { getTodayTheme } from './data/dayThemes';

function DayThemeBadge({ dayTheme }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.5, type: 'spring', stiffness: 180 }}
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '18px',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        padding: '6px 12px 6px 9px',
        borderRadius: '999px',
        background: 'rgba(5,10,22,0.72)',
        border: `1px solid ${dayTheme.css['--border-hi']}`,
        backdropFilter: 'blur(12px)',
        boxShadow: `0 0 16px ${dayTheme.css['--border-hi']}`,
        cursor: 'default',
        userSelect: 'none',
        fontSize: '11px',
        fontWeight: 700,
        color: dayTheme.css['--primary'],
        letterSpacing: '0.3px',
        fontFamily: 'Inter, sans-serif',
      }}
      title={`Today's theme: ${dayTheme.name} — ${dayTheme.desc}`}
    >
      <span style={{ fontSize: '14px', lineHeight: 1 }}>{dayTheme.emoji}</span>
      <span>{dayTheme.day}</span>
      <span style={{ opacity: 0.5, fontWeight: 500 }}>·</span>
      <span style={{ opacity: 0.7, fontWeight: 600 }}>{dayTheme.name}</span>
    </motion.div>
  );
}
import Hero from './components/Hero';
import About from './components/About';
import LinkTree from './components/LinkTree';
import Projects from './components/Projects';
import Blog from './components/Blog';
import NewsFeed from './components/NewsFeed';
import Contact from './components/Contact';
import Footer from './components/Footer';
import MediaPlayer from './components/MediaPlayer';
import CustomCursor from './components/CustomCursor';
import ProjectDetail from './components/ProjectDetail';
import TipJar from './components/TipJar';
import BlogDetail from './components/BlogDetail';

function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <LinkTree />
      <Projects />
      <Blog />
      <NewsFeed />
      <Contact />
    </main>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem('theme') || 'dark'
  );
  const location = useLocation();
  const dayTheme = getTodayTheme();

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply day-theme CSS variable overrides to :root
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(dayTheme.css).forEach(([k, v]) => root.style.setProperty(k, v));
    return () => {
      Object.keys(dayTheme.css).forEach(k => root.style.removeProperty(k));
    };
  }, [dayTheme]);

  useEffect(() => {
    const handleCardMouseMove = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
      card.style.setProperty('--mouse-x', x);
      card.style.setProperty('--mouse-y', y);
    };
    const attach = () => {
      document.querySelectorAll('.card').forEach(c => c.addEventListener('mousemove', handleCardMouseMove));
    };
    attach();
    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <>
      <BackgroundCanvas theme={theme} dayPalette={dayTheme.canvas} dayIndex={new Date().getDay()} />
      <DayThemeBadge dayTheme={dayTheme} />
      <CustomCursor />
      <Navbar theme={theme} onThemeToggle={toggleTheme} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/tip" element={<TipJar />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <MediaPlayer />
    </>
  );
}
