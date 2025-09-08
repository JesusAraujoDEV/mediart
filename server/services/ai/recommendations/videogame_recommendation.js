'use strict';

const BaseRecommendation = require('./base_recommendation');
const { normalize } = require('./utils/text');

class VideogameRecommendation extends BaseRecommendation {
  constructor(searchService) {
    super(searchService);
    // Titles often include editions/remasters. Canonicalize to dedupe families.
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
  }

  async searchOneQuery(query) {
    const cacheKey = `rawg_${query}`;
    const now = Date.now();

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (now - cached.timestamp < this.cacheExpiry) {
        console.log(`Cache hit for query: ${query}`);
        return cached.data;
      } else {
        this.cache.delete(cacheKey);
      }
    }

    try {
      const res = await this.searchService.searchRawg(query);
      const filtered = (res || []).filter(item => item.type === 'videogame');

      // Cache the result
      this.cache.set(cacheKey, {
        data: filtered,
        timestamp: now
      });

      return filtered;
    } catch (error) {
      console.error('Error in VideogameRecommendation searchOneQuery:', error.message);
      // Fallback to IGDB if RAWG fails
      try {
        const fallbackRes = await this.searchService.searchIgdb(query);
        const filteredFallback = (fallbackRes || []).filter(item => item.type === 'videogame');

        // Cache fallback result too
        this.cache.set(cacheKey, {
          data: filteredFallback,
          timestamp: now
        });

        return filteredFallback;
      } catch (fallbackError) {
        console.error('Fallback to IGDB also failed:', fallbackError.message);
        return [];
      }
    }
  }

  async recommend(itemName, queries, limit = 10) {
    const startTime = Date.now();
    console.log('VideogameRecommendation: Starting recommendation for', itemName, 'with queries:', queries);

    const candidates = await this.searchMany(queries);
    console.log('VideogameRecommendation: Found', candidates.length, 'candidates');

    if (candidates.length === 0) {
      console.log('VideogameRecommendation: No candidates found, returning empty array');
      return [];
    }

    // Build canonical family key to avoid series/edition spam, e.g., "Life is Strange"
    const seenExternal = new Set();
    const seenFamilies = new Set();

    // Pre-normalize the main query for performance
    const q0 = normalize(queries?.[0] || itemName || '');

    // Use more efficient ranking with early termination
    const ranked = candidates
      .map(x => {
        const t = normalize(x.title || '');
        let sim = 0;
        if (t === q0) sim += 3;
        else if (t.startsWith(q0)) sim += 2;
        else if (t.includes(q0)) sim += 1;

        const rating = x.avgRating || 0;
        const score = sim * 10 + rating;

        return { item: x, score, title: t };
      })
      .sort((a, b) => b.score - a.score);

    const out = [];
    const maxIterations = Math.min(ranked.length, limit * 3); // Limit iterations for performance

    for (let i = 0; i < maxIterations && out.length < limit; i++) {
      const { item: vg } = ranked[i];
      const extKey = `${vg.type}-${vg.externalSource}-${vg.externalId}`;

      if (!vg.externalId || seenExternal.has(extKey)) continue;

      const canonical = this.canonicalKeyByTitle(vg.title);
      const family = canonical.split(' ').slice(0, 4).join(' ');

      // Avoid repeating same franchise/family
      if (seenFamilies.has(family)) continue;

      seenExternal.add(extKey);
      seenFamilies.add(family);
      out.push(vg);
    }

    console.log('VideogameRecommendation: First pass completed, found', out.length, 'recommendations');

    // Only do second pass if we haven't reached the limit and it's worth it
    if (out.length < limit && ranked.length > maxIterations) {
      for (let i = maxIterations; i < ranked.length && out.length < limit; i++) {
        const { item: vg } = ranked[i];
        const extKey = `${vg.type}-${vg.externalSource}-${vg.externalId}`;

        if (!vg.externalId || seenExternal.has(extKey)) continue;

        const canonical = this.canonicalKeyByTitle(vg.title);
        const family = canonical.split(' ').slice(0, 4).join(' ');
        if (seenFamilies.has(family)) continue;

        seenExternal.add(extKey);
        seenFamilies.add(family);
        out.push(vg);
      }
    }

    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`VideogameRecommendation: Completed in ${duration}ms`);
    console.log('VideogameRecommendation: Final recommendations count:', out.length);
    console.log('VideogameRecommendation: Recommendation titles:', out.map(vg => vg.title).join(', '));

    return out;
  }

  // Method to clear cache manually
  clearCache() {
    this.cache.clear();
    console.log('VideogameRecommendation: Cache cleared');
  }

  // Method to get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }

  // Pre-compute popular recommendations for faster response
  async precomputePopularRecommendations(limit = 20) {
    const popularQueries = [
      'action', 'adventure', 'rpg', 'strategy', 'shooter',
      'zelda', 'mario', 'pokemon', 'final fantasy', 'minecraft'
    ];

    console.log('VideogameRecommendation: Pre-computing popular recommendations...');

    for (const query of popularQueries) {
      try {
        await this.searchOneQuery(query);
        console.log(`Pre-computed recommendations for: ${query}`);
      } catch (error) {
        console.error(`Failed to pre-compute for ${query}:`, error.message);
      }
    }

    console.log('VideogameRecommendation: Pre-computation completed');
  }
}

module.exports = VideogameRecommendation;