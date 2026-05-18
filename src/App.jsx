import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import LinkTree from './components/LinkTree';
import Projects from './components/Projects';
import Blog from './components/Blog';
import NewsFeed from './components/NewsFeed';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem('theme') || 'dark'
  );

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <>
      <Navbar theme={theme} onThemeToggle={toggleTheme} />
      <main>
        <Hero />
        <About />
        <LinkTree />
        <Projects />
        <Blog />
        <NewsFeed />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
