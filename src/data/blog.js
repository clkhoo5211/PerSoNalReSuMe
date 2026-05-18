// Blog posts are loaded from /public/blog.json at runtime.
// This module provides a synchronous fallback for SSR/build-time use
// and a fetch helper for runtime use.

let _cache = null;

export async function fetchPosts() {
  if (_cache) return _cache;
  const res = await fetch(`${import.meta.env.BASE_URL}blog.json`);
  _cache = await res.json();
  return _cache;
}

// Synchronous access after fetchPosts() has been called
export function getCachedPosts() {
  return _cache || [];
}

// Seed minimal stubs so components that import `posts` directly still work
// before the async fetch completes. Replace with real data by calling fetchPosts().
export const posts = [];
