// services/ai/recommendations/song_recommendation.js
'use strict';

const BaseRecommendation = require('./base_recommendation');

class SongRecommendation extends BaseRecommendation {
  constructor(searchService) {
    super(searchService);
  }

  async searchOneQuery(query) {
    // Search Spotify for the exact query
    const res = await this.searchService.searchSpotify(query, 'track');

    // Return the first result if available, or empty array
    if (!res || res.length === 0) {
      return [];
    }

    // Return just the first (best) match for this query
    return [res[0]];
  }

  async recommend(itemName, queries, limit = 10) {
    console.log(`[SongRecommendation] Processing ${queries.length} queries`);

    // Search for each query and take only the first result
    const results = await Promise.allSettled(queries.map(q => this.searchOneQuery(q)));
    const candidates = [];
    for (const r of results) {
      if (r.status === 'fulfilled' && Array.isArray(r.value) && r.value.length > 0) {
        candidates.push(r.value[0]); // Only first result
      }
    }

    console.log(`[SongRecommendation] Found ${candidates.length} total results`);

    // Simple deduplication by externalId only
    const seenExternalIds = new Set();
    const out = [];

    for (const song of candidates) {
      const extKey = `${song.type}-${song.externalSource}-${song.externalId}`;
      if (!song.externalId || seenExternalIds.has(extKey)) continue;

      seenExternalIds.add(extKey);
      out.push(song);

      if (out.length >= limit) break;
    }

    console.log(`[SongRecommendation] Returning ${out.length} unique songs`);
    return out;
  }
}

module.exports = SongRecommendation;