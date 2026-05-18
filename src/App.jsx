import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
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

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

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
