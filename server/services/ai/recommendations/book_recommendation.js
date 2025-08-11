'use strict';

const BaseRecommendation = require('./base_recommendation');
const { normalize } = require('./utils/text');

class BookRecommendation extends BaseRecommendation {
  constructor(searchService) {
    super(searchService);
    this.droppedPattern = /\b(Study Guide|Summary|Workbook|Collection|Bundle|Pack)\b/i;
  }

  async searchOneQuery(query) {
    const res = await this.searchService.searchGoogleBooks(query);
    return (res || []).filter(x => x.type === 'book' && !this.droppedPattern.test(x.title || ''));
  }

  async recommend(itemName, queries, limit = 10) {
    const candidates = await this.searchMany(queries);
    const usedCanonical = new Set();

    // Rank by similarity + rating
    const ranked = this.rank(candidates, (x) => {
      const titleNorm = normalize(x.title);
      const qNorm = normalize(queries[0] || itemName || '');
      const rating = x.avgRating || 0;
      let sim = 0;
      if (titleNorm === qNorm) sim += 3;
      if (titleNorm.startsWith(qNorm)) sim += 2;
      if (titleNorm.includes(qNorm)) sim += 1;
      return sim * 10 + rating;
    });

    const finalItems = [];
    for (const cand of ranked) {
      const canonicalKey = this.canonicalKeyByTitle(cand.title);
      if (usedCanonical.has(canonicalKey)) continue;
      usedCanonical.add(canonicalKey);
      finalItems.push(cand);
      if (finalItems.length >= limit) break;
    }

    if (finalItems.length < limit) {
      for (const cand of ranked) {
        const canonicalKey = this.canonicalKeyByTitle(cand.title);
        if (usedCanonical.has(canonicalKey)) continue;
        usedCanonical.add(canonicalKey);
        finalItems.push(cand);
        if (finalItems.length >= limit) break;
      }
    }

    return finalItems;
  }
}

module.exports = BookRecommendation;