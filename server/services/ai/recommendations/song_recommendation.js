// services/ai/recommendations/song_recommendation.js
'use strict';

const BaseRecommendation = require('./base_recommendation');

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

    const filtered = res.filter(item => {
      // Normaliza los nombres a minúsculas y elimina espacios extra para una comparación más robusta.
      const normalizedItemTitle = (item.title || '').toLowerCase().trim();
      const normalizedQuery = query.toLowerCase().trim();

      // Implementa un filtro estricto.
      // Revisa si el título del resultado es una coincidencia exacta o casi exacta.
      // Usa una lista de palabras clave a evitar para ser aún más preciso.
      const forbiddenWords = ['remix', 'live', 'cover', 'karaoke', 'tribute', 'version', 'acústico', 'instrumental'];
      const hasForbiddenWord = forbiddenWords.some(word => normalizedItemTitle.includes(word));

      // Compara el título de la canción del resultado con la query original.
      // Usa un método de coincidencia más flexible, como `startsWith`, para manejar nombres parciales.
      const isExactMatch = normalizedItemTitle === normalizedQuery;
      const isCloseMatch = normalizedItemTitle.startsWith(normalizedQuery) || normalizedQuery.startsWith(normalizedItemTitle);

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
    // Run searches for each AI query
    const candidates = await this.searchMany(queries);

    // Filter out duplicates and ensure variety
    const addedExternalIds = new Set();
    const out = [];
    for (const song of candidates) {
      const uniqueKey = `${song.type}-${song.externalSource}-${song.externalId}`;
      if (!song.externalId || addedExternalIds.has(uniqueKey)) continue;

      out.push(song);
      addedExternalIds.add(uniqueKey);
      if (out.length >= limit) break;
    }

    return out;
  }
}

module.exports = SongRecommendation;