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

    // Search for each query and collect results
    const candidates = await this.searchMany(queries);

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