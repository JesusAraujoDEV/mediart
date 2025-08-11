'use strict';

const BaseRecommendation = require('./base_recommendation');
const { normalize } = require('./utils/text');

class VideogameRecommendation extends BaseRecommendation {
  constructor(searchService) {
    super(searchService);
    // Titles often include editions/remasters. Canonicalize to dedupe families.
  }

  async searchOneQuery(query) {
    const res = await this.searchService.searchIgdb(query);
    return (res || []).filter(item => item.type === 'videogame');
  }

  async recommend(itemName, queries, limit = 10) {
    const candidates = await this.searchMany(queries);

    // Build canonical family key to avoid series/edition spam, e.g., "Life is Strange"
    // Use BaseRecommendation.canonicalKeyByTitle() and cut to the first 4 tokens.
    const seenExternal = new Set();
    const seenFamilies = new Set();

    // Lightweight relevance score by approximate title-similarity to seed term and any first query
    const q0 = normalize(queries?.[0] || itemName || '');
    const ranked = this.rank(candidates, (x) => {
      const t = normalize(x.title || '');
      let sim = 0;
      if (t === q0) sim += 3;
      if (t.startsWith(q0)) sim += 2;
      if (t.includes(q0)) sim += 1;
      // Prefer higher ratings if available
      const rating = x.avgRating || 0;
      return sim * 10 + rating;
    });

    const out = [];
    for (const vg of ranked) {
      const extKey = `${vg.type}-${vg.externalSource}-${vg.externalId}`;
      if (!vg.externalId || seenExternal.has(extKey)) continue;

      const canonical = this.canonicalKeyByTitle(vg.title);
      const family = canonical.split(' ').slice(0, 4).join(' ');

      // Avoid repeating same franchise/family
      if (seenFamilies.has(family)) continue;

      seenExternal.add(extKey);
      seenFamilies.add(family);
      out.push(vg);
      if (out.length >= limit) break;
    }

    // If we did not hit limit, fill with remaining unique externalIds but still avoid exact canonical dupes
    if (out.length < limit) {
      for (const vg of ranked) {
        const extKey = `${vg.type}-${vg.externalSource}-${vg.externalId}`;
        if (!vg.externalId || seenExternal.has(extKey)) continue;

        const canonical = this.canonicalKeyByTitle(vg.title);
        const family = canonical.split(' ').slice(0, 4).join(' ');
        if (seenFamilies.has(family)) continue; // still avoid family spam

        seenExternal.add(extKey);
        seenFamilies.add(family);
        out.push(vg);
        if (out.length >= limit) break;
      }
    }

    return out;
  }
}

module.exports = VideogameRecommendation;