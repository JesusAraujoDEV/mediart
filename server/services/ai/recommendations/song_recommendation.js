// services/ai/recommendations/song_recommendation.js
'use strict';

const BaseRecommendation = require('./base_recommendation');
const { normalize } = require('./utils/text');

// Normalize song title for deduplication by stripping variations
function normalizeSongTitle(title) {
  let normalized = normalize(title || '');

  // Remove content in parentheses and brackets (episode info, language, etc.)
  normalized = normalized.replace(/\([^)]*\)/g, '').replace(/\[.*?\]/g, '');

  // Remove version indicators and metadata
  normalized = normalized.replace(/\s*-\s*[^-]*key[^-]*$/i, ''); // -4Key...
  normalized = normalized.replace(/\s*-\s*back\s*track.*$/i, ''); // - Back Track
  normalized = normalized.replace(/\s*-\s*original.*$/i, ''); // - Original...
  normalized = normalized.replace(/\s*-\s*remix.*$/i, ''); // - Remix
  normalized = normalized.replace(/\s*-\s*live.*$/i, ''); // - Live
  normalized = normalized.replace(/\s*-\s*cover.*$/i, ''); // - Cover

  // Remove track numbers and episode info
  normalized = normalized.replace(/\b\d+-\d+\b/g, ''); // episode ranges like 284-325
  normalized = normalized.replace(/\b\d+\w*\b/g, ''); // numbers with letters

  // Remove common separators and clean up
  normalized = normalized.replace(/\s*-\s*$/, '').replace(/^\s*-\s*/, '');
  normalized = normalized.replace(/\s+/g, ' ').trim();

  return normalized;
}

class SongRecommendation extends BaseRecommendation {
  constructor(searchService) {
    super(searchService);
  }

  async searchOneQuery(query) {
    const res = await this.searchService.searchSpotify(query, 'track');

    // Si no hay resultados, sal de la función.
    if (!res || res.length === 0) {
      return [];
    }

    // Extract song title from query (before " - ")
    const songTitleFromQuery = query.split(' - ')[0]?.trim() || query;
    const normalizedSongTitle = songTitleFromQuery.toLowerCase().trim();

    const filtered = res.filter(item => {
      // Normaliza los nombres a minúsculas y elimina espacios extra para una comparación más robusta.
      const normalizedItemTitle = (item.title || '').toLowerCase().trim();

      // Implementa un filtro estricto.
      // Revisa si el título del resultado es una coincidencia exacta o casi exacta.
      // Usa una lista de palabras clave a evitar para ser aún más preciso.
      const forbiddenWords = ['remix', 'live', 'cover', 'karaoke', 'tribute', 'version', 'acústico', 'instrumental'];
      const hasForbiddenWord = forbiddenWords.some(word => normalizedItemTitle.includes(word));

      // Compara el título de la canción del resultado con la parte de canción de la query.
      const isExactMatch = normalizedItemTitle === normalizedSongTitle;
      const isCloseMatch = normalizedItemTitle.startsWith(normalizedSongTitle) ||
                          normalizedSongTitle.startsWith(normalizedItemTitle) ||
                          normalizedItemTitle.includes(normalizedSongTitle) ||
                          normalizedSongTitle.includes(normalizedItemTitle);

      // Si es un "close match" y no tiene palabras prohibidas, acéptalo.
      if ((isExactMatch || isCloseMatch) && !hasForbiddenWord) {
        return true;
      }

      // Si no pasa los filtros anteriores, no lo incluyas.
      return false;
    });

    // Devuelve todos los resultados filtrados para mejor ranking posterior.
    return filtered;
  }

  async recommend(itemName, queries, limit = 10) {
    const candidates = await this.searchMany(queries);
    console.log(`[SongRecommendation] Total candidates: ${candidates.length}`);

    // Use first query for ranking relevance, extract song title part
    const firstQuery = queries?.[0] || itemName || '';
    const q0 = normalize(firstQuery.split(' - ')[0] || firstQuery); // Get song title before artist

    // Rank candidates by title similarity to query
    const ranked = this.rank(candidates, (song) => {
      const t = normalizeSongTitle(song.title || '');
      let sim = 0;
      if (t === q0) sim += 3;
      if (t.startsWith(q0)) sim += 2;
      if (t.includes(q0)) sim += 1;
      // Also check if query contains the song title
      if (q0.includes(t)) sim += 2;
      return sim * 10;
    });

    // Dedupe by normalized song title and externalId
    const seenExternal = new Set();
    const seenTitles = new Set();
    const out = [];

    for (const song of ranked) {
      const extKey = `${song.type}-${song.externalSource}-${song.externalId}`;
      if (!song.externalId || seenExternal.has(extKey)) continue;

      const normalizedTitle = normalizeSongTitle(song.title || '');
      if (seenTitles.has(normalizedTitle)) continue;

      seenExternal.add(extKey);
      seenTitles.add(normalizedTitle);
      out.push(song);
      if (out.length >= limit) break;
    }

    console.log(`[SongRecommendation] After first pass: ${out.length} items`);

    // If we didn't reach the limit, try to find more unique songs
    if (out.length < limit) {
      for (const song of ranked) {
        const extKey = `${song.type}-${song.externalSource}-${song.externalId}`;
        if (!song.externalId || seenExternal.has(extKey)) continue;

        const normalizedTitle = normalizeSongTitle(song.title || '');
        if (seenTitles.has(normalizedTitle)) continue;

        seenExternal.add(extKey);
        seenTitles.add(normalizedTitle);
        out.push(song);
        if (out.length >= limit) break;
      }
    }

    console.log(`[SongRecommendation] Final items: ${out.length}`);
    return out;
  }
}

module.exports = SongRecommendation;