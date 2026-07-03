/**
 * Daily blog post generator.
 * Reads public/blog.json, asks Claude for one new post in the site's voice,
 * validates it, prepends it, writes the file back.
 *
 * Env: ANTHROPIC_API_KEY (required)
 */
import { readFileSync, writeFileSync } from 'node:fs';

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) { console.error('ANTHROPIC_API_KEY missing'); process.exit(1); }

const BLOG_PATH = new URL('../public/blog.json', import.meta.url).pathname;
const posts = JSON.parse(readFileSync(BLOG_PATH, 'utf8'));

const today = new Date().toISOString().slice(0, 10);
if (posts.some(p => p.date === today)) {
  console.log(`Post for ${today} already exists — skipping.`);
  process.exit(0);
}

const recentTitles = posts.slice(0, 25).map(p => `- ${p.title}`).join('\n');
const sample = posts[0];

const TOPIC_POOL = [
  'a Web3 / blockchain engineering lesson (ICP, Motoko, Solidity, DeFi, NFTs, wallets)',
  'an AI engineering topic (LLM apps, MCP services, agents, prompt design, AI in trading)',
  'a frontend/performance topic (React, canvas animation, Vite, bundle size, perceived speed)',
  'a career/mindset piece from 15 years in IT (freelancing, remote work in Southeast Asia, learning)',
  'a systems/architecture opinion piece (dependencies, simplicity, build-vs-buy, tech debt)',
];
const topic = TOPIC_POOL[Math.floor(Math.random() * TOPIC_POOL.length)];

const prompt = `You write blog posts for Khoo Cheng Long — Web3 developer & AI engineer, ICP/Motoko background, Malaysia-based, 15 years in IT.

Write ONE new blog post about ${topic}. Pick a specific, fresh angle NOT covered by these existing posts:
${recentTitles}

Voice ("khazix-writer"): conversational first-person, like explaining to a friend over coffee. Hook in the first sentence. Short paragraphs (2-4 sentences). Flowing prose — NO bullet-point lectures. One small code snippet only if natural. End with a takeaway.

Return ONLY a JSON object (no markdown fences) with exactly these fields, matching this example's schema and content length:
${JSON.stringify({ id: sample.id, title: sample.title, date: today, readTime: sample.readTime, summary: sample.summary, tags: sample.tags, content: '(full post text, \\n\\n between paragraphs)' })}

Rules: unique kebab-case id not in the list above; date must be "${today}"; readTime like "6 min"; 2-4 tags; content 700-1100 words.`;

const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-api-key': API_KEY,
    'anthropic-version': '2023-06-01',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-5',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  }),
});

if (!res.ok) { console.error('API error', res.status, await res.text()); process.exit(1); }
const data = await res.json();
let text = data.content.map(b => b.text || '').join('').trim();
// strip accidental code fences
text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();

const post = JSON.parse(text);

// validate
const required = ['id', 'title', 'date', 'readTime', 'summary', 'tags', 'content'];
for (const k of required) if (!post[k]) { console.error(`missing field ${k}`); process.exit(1); }
if (posts.some(p => p.id === post.id)) post.id = `${post.id}-${today}`;
post.date = today;

posts.unshift(post);
writeFileSync(BLOG_PATH, JSON.stringify(posts, null, 2) + '\n');
console.log(`Added post: ${post.id} — ${post.title}`);
