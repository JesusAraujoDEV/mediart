'use strict';

const BaseRecommendation = require('./base_recommendation');

class VideogameRecommendation extends BaseRecommendation {
  constructor(searchService) {
    super(searchService);
  }

  async searchOneQuery(query) {
    const res = await this.searchService.searchIgdb(query);
    return (res || []).filter(item => item.type === 'videogame');
  }

  async recommend(_itemName, queries, limit = 10) {
    const candidates = await this.searchMany(queries);
    const added = new Set();
    const out = [];
    for (const vg of candidates) {
      const key = `${vg.type}-${vg.externalSource}-${vg.externalId}`;
      if (!vg.externalId || added.has(key)) continue;
      added.add(key);
      out.push(vg);
      if (out.length >= limit) break;
    }
    return out;
  }
}

module.exports = VideogameRecommendation;