'use strict';

const BaseRecommendation = require('./base_recommendation');

class ArtistRecommendation extends BaseRecommendation {
  constructor(searchService) {
    super(searchService);
  }

  async searchOneQuery(query) {
    const res = await this.searchService.searchSpotify(query, 'artist');
    return (res || []).filter(item => item.type === 'artist');
  }

  async recommend(_itemName, queries, limit = 10) {
    const candidates = await this.searchMany(queries);
    const added = new Set();
    const out = [];
    for (const artist of candidates) {
      const key = `${artist.type}-${artist.externalSource}-${artist.externalId}`;
      if (!artist.externalId || added.has(key)) continue;
      added.add(key);
      out.push(artist);
      if (out.length >= limit) break;
    }
    return out;
  }
}

module.exports = ArtistRecommendation;