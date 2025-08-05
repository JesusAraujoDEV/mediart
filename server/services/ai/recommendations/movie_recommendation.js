'use strict';

const BaseRecommendation = require('./base_recommendation');
const { normalize } = require('./utils/text');

class MovieRecommendation extends BaseRecommendation {
  constructor(searchService) {
    super(searchService);
    this.droppedPattern = /\b(Season|Episode|Trailer|Featurette|Bundle|Collection|Pack)\b/i;
  }

  async searchOneQuery(query) {
    const res = await this.searchService.searchTmdb(query);
    return (res || []).filter(x => x.type === 'movie' && !this.droppedPattern.test(x.title || ''));
  }

  async recommend(itemName, queries, limit = 10) {
    const candidates = await this.searchMany(queries);
    const usedFranchises = new Set();
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
      const title = cand.title || '';
      const canonicalKey = this.canonicalKeyByTitle(title);
      const franchiseKey = canonicalKey.split(' ').slice(0, 4).join(' ');
      if (usedCanonical.has(canonicalKey)) continue;
      if (usedFranchises.has(franchiseKey)) continue;
      usedCanonical.add(canonicalKey);
      usedFranchises.add(franchiseKey);
      finalItems.push(cand);
      if (finalItems.length >= limit) break;
    }

    // If not enough, fill from remaining unique canonicals
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

module.exports = MovieRecommendation;