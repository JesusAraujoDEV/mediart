// services/ai/recommendations/artist_recommendation.js
'use strict';

const BaseRecommendation = require('./base_recommendation');

class ArtistRecommendation extends BaseRecommendation {
  constructor(searchService) {
    super(searchService);
  }

  async searchOneQuery(query) {
    const res = await this.searchService.searchSpotify(query, 'artist');
    
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
      const forbiddenWords = ['tribute', 'karaoke', 'band', 'version', 'tributo', 'acústico'];
      const hasForbiddenWord = forbiddenWords.some(word => normalizedItemTitle.includes(word));

      // Compara el nombre del artista del resultado con la query original.
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

    // Devuelve solo el mejor resultado si hay varios (el más relevante).
    return filtered.slice(0, 1);
  }

  async recommend(itemName, queries, limit = 10) {
    // Run searches for each AI query
    const candidates = await this.searchMany(queries);

    // Filter out duplicates and ensure variety
    const addedExternalIds = new Set();
    const out = [];
    for (const artist of candidates) {
      const uniqueKey = `${artist.type}-${artist.externalSource}-${artist.externalId}`;
      if (!artist.externalId || addedExternalIds.has(uniqueKey)) continue;

      out.push(artist);
      addedExternalIds.add(uniqueKey);
      if (out.length >= limit) break;
    }

    return out;
  }
}

module.exports = ArtistRecommendation;