const TTL = 10 * 60 * 1000;

export function saveToCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch (_) {}
}

export function loadFromCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    return { data, isStale: Date.now() - ts > TTL };
  } catch (_) {
    return null;
  }
}
