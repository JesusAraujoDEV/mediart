// recommendations/artist_recommendation.js
'use strict';

const BaseRecommendation = require('./base_recommendation');

class ArtistRecommendation extends BaseRecommendation {
  constructor(searchService) {
    super(searchService);
    // Block common noise patterns for artist entities
    this.forbiddenWords = [
      'tribute', 'tributo', 'karaoke', 'band', 'banda', 'made famous by',
      'version', 'versión', 'cover', 'kids', 'parody', 'parodia',
      'instrumental', 'piano', 'orchestra', 'orquesta', 'score', 'soundtrack',
      'composer', 'compositor', 'official audio', 'remix'
    ];
  }

  async searchOneQuery(query) {
    const res = await this.searchService.searchSpotify(query, 'artist');
    if (!res || res.length === 0) return [];

    const normalizedQuery = String(query || '').toLowerCase().trim();

    // Strict filtering: only accept exact or very close matches to AI-suggested name
    const filtered = (res || []).filter(item => {
      if (item.type !== 'artist') return false;
      const title = String(item.title || '').toLowerCase().trim();
      if (!title || title.length < 3) return false;

      // Reject obvious noise (tribute/karaoke/band/version/soundtrack/composer/etc.)
      const hasForbidden = this.forbiddenWords.some(w => title.includes(w));
      if (hasForbidden) return false;

      // Prefer exact or close matches to the query string
      const isExact = title === normalizedQuery;
      const isClose = title.startsWith(normalizedQuery) || normalizedQuery.startsWith(title);

      return isExact || isClose;
    });

    // Return only the best candidate if multiple matched
    return filtered.slice(0, 1);
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

    // Dedupe by external id and canonicalized name to avoid duplicates
    const addedExternalIds = new Set();
    const nameSeen = new Set();
    const out = [];

    for (const artist of candidates) {
      const uniqueKey = `${artist.type}-${artist.externalSource}-${artist.externalId}`;
      const nameKey = String(artist.title || '').toLowerCase().trim();
      if (!artist.externalId || addedExternalIds.has(uniqueKey)) continue;
      if (!nameKey || nameSeen.has(nameKey)) continue;

      addedExternalIds.add(uniqueKey);
      nameSeen.add(nameKey);
      out.push(artist);
      if (out.length >= limit) break;
    }

    return out;
  }
}

module.exports = ArtistRecommendation;