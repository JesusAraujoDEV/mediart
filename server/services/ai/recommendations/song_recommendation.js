'use strict';

const BaseRecommendation = require('./base_recommendation');

class SongRecommendation extends BaseRecommendation {
  constructor(searchService) {
    super(searchService);
    // Variants we want to avoid for tracks
    this.variantRegex = /\b(remix|live|acoustic|cover|re-?record|taylor'?s version|sped ?up|slowed|extended|edit|karaoke|instrumental|piano|lullaby|kids|parody|diss|version|versión)\b/i;
  }

  // Normalize "Title - Artist" => "Title artist:Artist" if not already using artist:
  normalizeQueryForSpotifyTracks(q) {
    const parts = q.split(/\s-\s/);
    if (parts.length === 2) {
      const title = parts[0].trim();
      const artist = parts[1].trim();
      if (!/artist:/i.test(q)) return `${title} artist:${artist}`;
    }
    return q;
  }

  async searchOneQuery(query) {
    const normalized = this.normalizeQueryForSpotifyTracks(query);
    const res = await this.searchService.searchSpotify(normalized, 'track');
    // SpotifyApiService already unifies; filter here for extra rules
    const filtered = (res || [])
      .filter(item => item.type === 'song')
      .filter(item => !this.variantRegex.test((item.title || '') + ' ' + (item.description || '')));
    return filtered;
  }

  async recommend(itemName, queries, limit = 10) {
    // run searches
    const candidates = await this.searchMany(queries);
    const addedExternalIds = new Set();
    const artistSeen = new Set();

    const out = [];
    for (const song of candidates) {
      const uniqueKey = `${song.type}-${song.externalSource}-${song.externalId}`;
      if (!song.externalId || addedExternalIds.has(uniqueKey)) continue;

      // Try extract artist from description "Artista(s): X"
      const artistMatch = (song.description || '').match(/Artista\(s\): ([^.-]+)/i);
      const artistName = artistMatch ? artistMatch[1].trim() : null;

      if (artistName) {
        const artistKey = artistName.toLowerCase();
        if (artistSeen.has(artistKey)) continue;
        artistSeen.add(artistKey);
      }

      out.push(song);
      addedExternalIds.add(uniqueKey);
      if (out.length >= limit) break;
    }

    return out;
  }
}

module.exports = SongRecommendation;