import { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let ringX = 0, ringY = 0;
    let dotX  = 0, dotY  = 0;
    let raf;

    const onMove = (e) => {
      dotX = e.clientX; dotY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX}px, ${dotY}px)`;
      }
      setVisible(true);
    };

    const loop = () => {
      ringX += (dotX - ringX) * 0.12;
      ringY += (dotY - ringY) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const onDown  = () => setClicked(true);
    const onUp    = () => setClicked(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onHoverIn = () => setHovered(true);
    const onHoverOut = () => setHovered(false);

    const attachHover = () => {
      document.querySelectorAll('a,button,.card,.btn,.filter-btn,.news-card').forEach(el => {
        el.addEventListener('mouseenter', onHoverIn);
        el.addEventListener('mouseleave', onHoverOut);
      });
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);
    attachHover();

    const obs = new MutationObserver(attachHover);
    obs.observe(document.body, { childList: true, subtree: true });

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className={`cursor-dot ${visible ? 'visible' : ''} ${clicked ? 'clicked' : ''} ${hovered ? 'hovered' : ''}`}
      />
      <div
        ref={ringRef}
        className={`cursor-ring ${visible ? 'visible' : ''} ${clicked ? 'clicked' : ''} ${hovered ? 'hovered' : ''}`}
      />
    </>
  );
}
