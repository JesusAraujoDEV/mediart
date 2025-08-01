// services/gemini_ai_service.js
const { config } = require('../../config/config');

class GeminiAiService {
  constructor() {
    this.apiKey = config.apiKeys.googleGemini;
    if (!this.apiKey) {
      console.error('Google Gemini API Key not configured.');
      throw new Error('Google Gemini API Key is missing.');
    }
    // Usamos el modelo que vimos disponible en tu captura
    this.modelName = 'gemini-2.0-flash'; // <-- ¡CAMBIO AQUÍ!
    this.apiUrl = `https://generativelanguage.googleapis.com/v1/models/${this.modelName}:generateContent?key=${this.apiKey}`;
  }

  /**
   * Genera una lista de nombres de ítems (películas, canciones, etc.) usando el LLM de Gemini.
   * @param {string} itemType El tipo de ítem (e.g., 'peliculas', 'canciones').
   * @param {string} itemName El nombre del ítem base (e.g., "Misión Imposible", "Daylight").
   * @param {string} [itemContext=''] Contexto adicional del ítem base (ej. "Taylor Swift" para canciones).
   * @returns {Promise<string[]>} Un array de strings con los nombres/títulos recomendados.
   */
  async generateRecommendations(itemType, itemName, itemContext = '') {
    if (!this.apiKey) {
      console.error('Gemini API Key not configured. Gemini AI service will be unavailable.');
      return [];
    }

    try {
      // Prompt minimalista y más controlado para mejorar exactitud en Spotify:
      // Objetivo: devolver 10 canciones parecidas en energía/tempo/estado de ánimo a la pista base, con formato estable.
      // Reglas estrictas:
      // - Solo canciones diferentes a la base, NO incluir: remix, live, acoustic, cover, re-record, Taylor's Version, sped up, slowed, extended, edit, karaoke, instrumental, piano, lullaby, kids, parody, diss.
      // - Diversidad de artistas: máximo 1 canción por artista (evita múltiples del mismo artista).
      // - Sin prefijos de categoría, sin texto adicional, sin numeración, sin comillas, sin markdown.
      // - Formato de salida para canciones: "Title - Artist".
      // - Devuelve exactamente 10 entradas separadas por comas, sin saltos de línea.
      const promptText = [
        `Return exactly 10 pop/dance songs with similar energy, tempo (approx BPM), and positive mood to "${itemName}"${itemContext ? ' ' + itemContext : ''}.`,
        `Only different songs from the seed. Exclude: remix, live, acoustic, cover, re-record, Taylor's Version, sped up, slowed, extended, edit, karaoke, instrumental, piano, lullaby, kids, parody, diss.`,
        `Diversity: at most 1 song per artist.`,
        `Output format: Title - Artist`,
        `Output: a single line, comma-separated, no extra text, no quotes, no numbering, no category prefixes.`
      ].join(' ');

      const requestBody = {
        contents: [{
          parts: [{
            text: promptText
          }]
        }],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
            topP: 1,
            topK: 1,
        }
      };

      console.log('Sending prompt to Gemini API:', promptText);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error Response:', errorData);
        throw new Error(errorData.error?.message || `Error en la API de Gemini: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        console.error('Invalid response from Gemini API:', JSON.stringify(data, null, 2));
        throw new Error('Respuesta inválida de la API de Gemini: Estructura inesperada.');
      }

      const rawResponseText = data.candidates[0].content.parts[0].text || '';
      console.log('Gemini raw response:', rawResponseText);

      // Post-procesamiento robusto para obtener "Title - Artist"
      const variantRegex = /\b(remix|live|acoustic|cover|re-?record|taylor'?s version|sped ?up|slowed|extended|edit|karaoke|instrumental|piano|lullaby|kids|parody|diss|version|versión)\b/i;

      // 1) Quitar prefijos tipo "canciones=" y normalizar espacios
      let cleaned = rawResponseText.replace(/^\s*\w+\s*=\s*/i, '').trim();

      // 2) Cortar por coma y limpiar tokens
      let tokens = cleaned.split(',').map(s => s.trim()).filter(Boolean);

      // 3) Reglas de recomposición: arreglar splits erróneos por comas dentro del artista (p. ej. "Earth, Wind & Fire")
      const recombined = [];
      for (let i = 0; i < tokens.length; i++) {
        const cur = tokens[i];
        const next = tokens[i + 1] || '';
        if (/^September\s+Earth$/i.test(cur) && /^Wind\s*&\s*Fire$/i.test(next)) {
          recombined.push('September - Earth, Wind & Fire');
          i += 1;
        } else {
          recombined.push(cur);
        }
      }

      // 4) Normalizar a "Title - Artist" cuando sea posible
      const seen = new Set();
      const recommendedTitles = recombined
        .map(t => t.replace(/(\d+\.\s*|["'*`\-_])/g, '').trim())
        .map(t => t.replace(/\s{2,}/g, ' '))
        .map(t => t.includes(' - ') ? t : t.replace(/\s{2,}/, ' - ')) // intentar inferir separador si hubo doble espacio
        .map(t => t.replace(/\s+-\s+/g, ' - '))
        .map(t => t.replace(/\s+\(\s*(\d{4})\s*\)\s*$/i, ' ($1)'))
        .filter(t => t.length > 0 && !/no puedo|i can't/i.test(t))
        .filter(t => !variantRegex.test(t))
        .filter(t => t.toLowerCase() !== String(itemName || '').toLowerCase())
        .filter(t => {
          const key = t.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

      return recommendedTitles;

    } catch (error) {
      console.error('Error generating recommendations with Gemini AI:', error.message);
      if (error.message.includes('429 Too Many Requests')) {
        console.warn('Gemini API quota exceeded. Please wait or check your plan.');
      }
      throw error; // Es importante relanzar el error para que el fallback funcione
    }
  }
}

module.exports = GeminiAiService;