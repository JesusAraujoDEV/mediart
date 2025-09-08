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
    // Search for each query and take only the first result
    const results = await Promise.allSettled(queries.map(q => this.searchOneQuery(q)));
    const candidates = [];
    for (const r of results) {
      if (r.status === 'fulfilled' && Array.isArray(r.value) && r.value.length > 0) {
        candidates.push(r.value[0]); // Only first result
      }
    }
    const usedFranchises = new Set();
    const usedCanonical = new Set();
    const usedIds = new Set();

    // Fetch input movie to get genres for relevance filtering
    let inputGenres = new Set();
    try {
      const inputResults = await this.searchService.searchTmdb(itemName);
      const inputMovie = inputResults.find(x => x.type === 'movie' && !this.droppedPattern.test(x.title || ''));
      if (inputMovie) {
        inputGenres = new Set(inputMovie.genre_ids || []);
      }
    } catch (e) {
      // If can't fetch input, proceed without genre filter
    }

    // Rank by similarity + rating + genre overlap bonus
    const ranked = this.rank(candidates, (x) => {
      const titleNorm = normalize(x.title);
      const qNorm = normalize(queries[0] || itemName || '');
      const rating = x.avgRating || 0;
      let sim = 0;
      if (titleNorm === qNorm) sim += 3;
      if (titleNorm.startsWith(qNorm)) sim += 2;
      if (titleNorm.includes(qNorm)) sim += 1;

      // Genre overlap bonus for relevance
      let genreBonus = 0;
      if (inputGenres.size > 0 && x.genre_ids) {
        const candGenres = new Set(x.genre_ids);
        const overlap = [...inputGenres].some(g => candGenres.has(g));
        if (overlap) genreBonus = 5; // Boost for shared genres
      }

      return sim * 10 + rating + genreBonus;
    });

    const finalItems = [];
    for (const cand of ranked) {
      const title = cand.title || '';
      const canonicalKey = this.canonicalKeyByTitle(title);
      const franchiseKey = canonicalKey.split(' ').slice(0, 4).join(' ');

      // Skip if already used by canonical or franchise
      if (usedCanonical.has(canonicalKey)) continue;
      if (usedFranchises.has(franchiseKey)) continue;

      // Skip if no TMDB ID or already used
      if (!cand.externalId || usedIds.has(cand.externalId)) continue;

      usedCanonical.add(canonicalKey);
      usedFranchises.add(franchiseKey);
      usedIds.add(cand.externalId);
      finalItems.push(cand);
      if (finalItems.length >= limit) break;
    }

    // If not enough, fill from remaining unique canonicals and IDs
    if (finalItems.length < limit) {
      for (const cand of ranked) {
        const canonicalKey = this.canonicalKeyByTitle(cand.title);
        if (usedCanonical.has(canonicalKey)) continue;
        if (!cand.externalId || usedIds.has(cand.externalId)) continue;

        usedCanonical.add(canonicalKey);
        usedIds.add(cand.externalId);
        finalItems.push(cand);
        if (finalItems.length >= limit) break;
      }
    }

    return finalItems;
  }
}

module.exports = MovieRecommendation;