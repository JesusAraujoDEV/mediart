'use strict';

const BaseRecommendation = require('./base_recommendation');

class AlbumRecommendation extends BaseRecommendation {
  constructor(searchService) {
    super(searchService);
  }

  async searchOneQuery(query) {
    const res = await this.searchService.searchSpotify(query, 'album');
    return (res || []).filter(item => item.type === 'album');
  }

  async recommend(_itemName, queries, limit = 10) {
    const candidates = await this.searchMany(queries);
    const added = new Set();
    const out = [];
    for (const album of candidates) {
      const key = `${album.type}-${album.externalSource}-${album.externalId}`;
      if (!album.externalId || added.has(key)) continue;
      added.add(key);
      out.push(album);
      if (out.length >= limit) break;
    }
    return out;
  }
}

module.exports = AlbumRecommendation;