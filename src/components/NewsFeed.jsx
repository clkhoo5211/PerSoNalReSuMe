import { useMemo } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { saveToCache, loadFromCache } from '../hooks/useNewsCache';
import './NewsFeed.css';

const CACHE_KEY = 'hn-ai-news-v1';

// Try aihot first, fallback to HackerNews Algolia (guaranteed CORS-safe)
const AIHOT_URL = 'https://aihot.virxact.com/api/public/items?mode=selected&take=20';
const HN_URL = 'https://hn.algolia.com/api/v1/search_by_date?tags=story&query=artificial+intelligence+AI&hitsPerPage=20';

async function fetchNews() {
  // Try GitHub Actions baked news.json (same-origin, zero CORS)
  try {
    const res = await fetch('/PerSoNalReSuMe/news.json');
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json) && json.length > 0) return json;
    }
  } catch (_) {}

  // Try aihot
  try {
    const res = await fetch(AIHOT_URL, {
      headers: { 'User-Agent': navigator.userAgent, Accept: 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      const items = (json.items || json.data || []).map(item => ({
        id: item.id || item.url,
        title: item.title,
        url: item.url || '#',
        source: 'AIHot',
        time: item.publishedAt || item.date || '',
      }));
      if (items.length > 0) return items;
    }
  } catch (_) {}

  // Fallback to HackerNews Algolia
  const res = await fetch(HN_URL);
  const json = await res.json();
  return (json.hits || []).map(h => ({
    id: h.objectID,
    title: h.title,
    url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
    source: 'HackerNews',
    points: h.points,
    time: h.created_at,
  }));
}

function fetcher() {
  return fetchNews().then(data => {
    saveToCache(CACHE_KEY, data);
    return data;
  });
}

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NewsFeed() {
  const cached = useMemo(() => loadFromCache(CACHE_KEY)?.data, []);

  const { data: items = [], isValidating } = useSWR('ai-news', fetcher, {
    fallbackData: cached || [],
    refreshInterval: 5 * 60 * 1000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 60_000,
  });

  return (
    <section id="news" className="section">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="news-header">
          <h2 className="section-title">AI News Feed</h2>
          {isValidating && <span className="news-refresh-dot" title="Refreshing..." />}
        </div>

        {/* Marquee ticker */}
        {items.length > 0 && (
          <div className="ticker-wrap">
            <div className="ticker-label">🔥 LIVE</div>
            <div className="ticker-track">
              {[...items, ...items].map((item, i) => (
                <a
                  key={`${item.id}-${i}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ticker-item"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Card list */}
        <div className="news-grid">
          {items.slice(0, 12).map((item, i) => (
            <motion.a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="news-card card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="news-card-source">
                <span className={`tag${item.source === 'AIHot' ? '' : ' tag-secondary'}`}>{item.source}</span>
                {item.points && <span className="news-points">▲ {item.points}</span>}
                <span className="news-time">{timeAgo(item.time)}</span>
              </div>
              <p className="news-card-title">{item.title}</p>
            </motion.a>
          ))}
        </div>

        {items.length === 0 && !isValidating && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-2xl)' }}>
            Loading latest AI news...
          </p>
        )}
      </motion.div>
    </section>
  );
}
