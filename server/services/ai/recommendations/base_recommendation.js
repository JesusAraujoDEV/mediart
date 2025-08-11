'use strict';

const { normalize } = require('./utils/text');

// Base class providing shared helpers for recommendation strategies
class BaseRecommendation {
  constructor(searchService) {
    this.searchService = searchService;
  }

  // Abstract: sub-classes must implement and return array of unified items
  // eslint-disable-next-line no-unused-vars
  async searchOneQuery(query) {
    throw new Error('searchOneQuery(query) must be implemented by subclass');
  }

  // Run searches for multiple queries concurrently with Promise.allSettled
  async searchMany(queries, mapper = (v) => v) {
    const results = await Promise.allSettled(queries.map(q => this.searchOneQuery(q)));
    const out = [];
    for (const r of results) {
      if (r.status === 'fulfilled' && Array.isArray(r.value)) {
        out.push(...mapper(r.value));
      }
    }
    return out;
  }

  // Generic dedupe by unique key generator
  dedupe(items, getKey) {
    const seen = new Set();
    const out = [];
    for (const item of items) {
      const key = getKey(item);
      if (!key) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(item);
    }
    return out;
  }

  // Helper for canonical key by title (drop suffixes like " - something" or parenthesis)
  canonicalKeyByTitle(title) {
    return normalize(String(title || '')).replace(/[:\-–—(].*$/, '').trim();
  }

  // Similarity scoring used by movie/tv/book: title vs query plus rating fallback
  similarityScoreByTitleAndRating(itemTitle, query, rating = 0, extra = 0) {
    const t = normalize(itemTitle || '');
    const q = normalize(query || '');
    let sim = 0;
    if (t === q) sim += 3;
    if (t.startsWith(q)) sim += 2;
    if (t.includes(q)) sim += 1;
    return sim * 10 + (rating || 0) + (extra || 0);
  }

  // Rank candidates with provided scoring function and return sorted items
  rank(candidates, getScore) {
    return candidates
      .map(x => ({ x, score: getScore(x) }))
      .sort((a, b) => b.score - a.score)
      .map(r => r.x);
  }
}

module.exports = BaseRecommendation;