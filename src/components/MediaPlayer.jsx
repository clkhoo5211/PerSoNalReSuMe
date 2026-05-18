import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GiscusComments from './GiscusComments';
import './MediaPlayer.css';

const DEFAULT_TRACKS = [
  {
    id: 'ambient-1',
    title: 'Ambient Background',
    artist: 'Portfolio Vibes',
    type: 'audio',
    src: null,
    cover: null,
  },
];

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MediaPlayer() {
  const [tracks, setTracks] = useState(DEFAULT_TRACKS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [minimized, setMinimized] = useState(true);
  const [mode, setMode] = useState('audio');
  const [tab, setTab] = useState('player'); // 'player' | 'comments'
  const [likes, setLikes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mp-likes') || '{}'); } catch { return {}; }
  });

  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const current = tracks[currentIndex] || null;
  const mediaRef = mode === 'video' ? videoRef : audioRef;

  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;
    el.volume = volume;
    el.muted = muted;
  }, [volume, muted, mode]);

  useEffect(() => {
    const el = mediaRef.current;
    if (!el || !current?.src) return;
    if (playing) el.play().catch(() => setPlaying(false));
    else el.pause();
  }, [playing, current]);

  const handleTimeUpdate = () => {
    const el = mediaRef.current;
    if (!el) return;
    setProgress(el.currentTime);
    setDuration(el.duration || 0);
  };

  const handleEnded = () => {
    if (currentIndex < tracks.length - 1) setCurrentIndex(i => i + 1);
    else setPlaying(false);
  };

  const seek = (e) => {
    const el = mediaRef.current;
    if (!el || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    el.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newTracks = files.map(f => ({
      id: f.name + Date.now(),
      title: f.name.replace(/\.[^.]+$/, ''),
      artist: 'My Upload',
      type: f.type.startsWith('video') ? 'video' : 'audio',
      src: URL.createObjectURL(f),
      cover: null,
    }));
    setTracks(prev => [...prev.filter(t => t.src), ...newTracks]);
    if (newTracks.length > 0) {
      setCurrentIndex(tracks.filter(t => t.src).length);
      setMode(newTracks[0].type);
    }
  };

  const toggleLike = (trackId) => {
    setLikes(prev => {
      const next = { ...prev, [trackId]: !prev[trackId] };
      localStorage.setItem('mp-likes', JSON.stringify(next));
      return next;
    });
  };

  const shareTrack = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: current?.title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  const progressPct = duration ? (progress / duration) * 100 : 0;
  if (!current) return null;

  return (
    <>
      <button
        className="media-fab"
        onClick={() => setMinimized(m => !m)}
        title={minimized ? 'Open media player' : 'Minimize'}
        aria-label="Toggle media player"
      >
        {playing ? '🎵' : '🎧'}
        {playing && <span className="media-fab-pulse" />}
      </button>

      <AnimatePresence>
        {!minimized && (
          <motion.div
            className="media-player"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header */}
            <div className="mp-header">
              <div className="mp-tabs">
                <button className={`mp-tab${tab === 'player' ? ' active' : ''}`} onClick={() => setTab('player')}>Player</button>
                <button className={`mp-tab${tab === 'comments' ? ' active' : ''}`} onClick={() => setTab('comments')}>💬 Comments</button>
              </div>
              <button className="mp-icon-btn" onClick={() => setMinimized(true)} title="Minimize">—</button>
            </div>

            {tab === 'player' && (
              <>
                {mode === 'video' && current.src && (
                  <div className="mp-video-wrap">
                    <video ref={videoRef} src={current.src} onTimeUpdate={handleTimeUpdate}
                      onEnded={handleEnded} onLoadedMetadata={handleTimeUpdate}
                      className="mp-video" playsInline />
                  </div>
                )}

                <audio ref={audioRef} src={mode === 'audio' ? current.src || '' : ''}
                  onTimeUpdate={handleTimeUpdate} onEnded={handleEnded}
                  onLoadedMetadata={handleTimeUpdate} preload="metadata" />

                {/* Track info + social actions */}
                <div className="mp-track-info">
                  <div className="mp-cover">
                    {current.cover ? <img src={current.cover} alt={current.title} /> : <span>{mode === 'video' ? '🎬' : '🎵'}</span>}
                  </div>
                  <div className="mp-meta">
                    <div className="mp-track-name">{current.title}</div>
                    <div className="mp-track-artist">{current.artist}</div>
                  </div>
                  <div className="mp-social-actions">
                    <button
                      className={`mp-icon-btn mp-like-btn${likes[current.id] ? ' liked' : ''}`}
                      onClick={() => toggleLike(current.id)}
                      title="Like"
                    >
                      {likes[current.id] ? '❤️' : '🤍'}
                    </button>
                    <button className="mp-icon-btn" onClick={shareTrack} title="Share / Copy link">
                      🔗
                    </button>
                    <button className={`mp-icon-btn${tab === 'comments' ? ' active' : ''}`}
                      onClick={() => setTab('comments')} title="Comments">
                      💬
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="mp-progress-wrap" onClick={seek}>
                  <div className="mp-progress-bg">
                    <div className="mp-progress-fill" style={{ width: `${progressPct}%` }} />
                  </div>
                  <div className="mp-times">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="mp-controls">
                  <button className="mp-icon-btn" onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                    disabled={currentIndex === 0} title="Previous">⏮</button>
                  <button className="mp-play-btn"
                    onClick={() => { if (!current.src) { fileInputRef.current?.click(); return; } setPlaying(p => !p); }}
                    title={playing ? 'Pause' : 'Play'}>
                    {playing ? '⏸' : '▶'}
                  </button>
                  <button className="mp-icon-btn" onClick={() => setCurrentIndex(i => Math.min(tracks.length - 1, i + 1))}
                    disabled={currentIndex >= tracks.length - 1} title="Next">⏭</button>
                  <button className={`mp-icon-btn${muted ? ' active' : ''}`} onClick={() => setMuted(m => !m)}
                    title={muted ? 'Unmute' : 'Mute'}>{muted ? '🔇' : '🔊'}</button>
                  <input type="range" className="mp-volume" min={0} max={1} step={0.05}
                    value={muted ? 0 : volume}
                    onChange={e => { setVolume(Number(e.target.value)); setMuted(false); }} title="Volume" />
                </div>

                {/* Mode toggle */}
                <div className="mp-mode-row">
                  <button className={`mp-icon-btn${mode === 'audio' ? ' active' : ''}`} onClick={() => setMode('audio')}>🎵 Audio</button>
                  <button className={`mp-icon-btn${mode === 'video' ? ' active' : ''}`} onClick={() => setMode('video')}>🎬 Video</button>
                </div>

                {/* Track list */}
                {tracks.filter(t => t.src).length > 0 && (
                  <div className="mp-tracklist">
                    {tracks.filter(t => t.src).map((t, i) => (
                      <button key={t.id} className={`mp-track-row${i === currentIndex ? ' active' : ''}`}
                        onClick={() => { setCurrentIndex(i); setPlaying(true); }}>
                        <span className="mp-track-row-icon">{t.type === 'video' ? '🎬' : '🎵'}</span>
                        <span className="mp-track-row-name">{t.title}</span>
                        {i === currentIndex && playing && <span className="mp-playing-dot" />}
                        {likes[t.id] && <span style={{ marginLeft: 'auto', fontSize: 11 }}>❤️</span>}
                      </button>
                    ))}
                  </div>
                )}

                <button className="mp-upload-btn btn btn-outline" onClick={() => fileInputRef.current?.click()}>
                  📁 Upload MP3 / MP4
                </button>
                <input ref={fileInputRef} type="file" accept="audio/*,video/*" multiple
                  onChange={handleFileUpload} style={{ display: 'none' }} />

                {!current.src && (
                  <p className="mp-no-track">No track loaded — upload an MP3 or MP4 to get started.</p>
                )}
              </>
            )}

            {tab === 'comments' && (
              <div className="mp-comments-panel">
                <p className="mp-comments-label">
                  Leave a comment or reaction about the music / this portfolio:
                </p>
                <GiscusComments term={`music-player-${current?.id || 'general'}`} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
