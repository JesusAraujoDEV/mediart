// services/gemini_ai_service.js
const { config } = require('../../config/config');

class GeminiAiService {
  constructor() {
    this.apiKey = config.apiKeys.googleGemini;
    if (!this.apiKey) {
      console.error('Google Gemini API Key not configured.');
      throw new Error('Google Gemini API Key is missing.');
    }
    this.modelName = 'gemini-2.0-flash';
    this.apiUrl = `https://generativelanguage.googleapis.com/v1/models/${this.modelName}:generateContent?key=${this.apiKey}`;
  }

  /**
   * Build a domain-specific strict JSON prompt for Gemini to reduce song-only bias.
   * We only update prompt construction here; downstream routing remains unchanged.
   */
  _buildDomainPrompt(itemCategory, itemName, itemContext = '') {
    // Map our Spanish categories to a domain and format rules
    const category = String(itemCategory || '').toLowerCase();
    const ctx = itemContext ? ` ${itemContext}` : '';

    if (category === 'canciones') {
      return [
        `You are a music recommender. Return exactly 10 pop/dance songs similar in energy, approximate BPM, and positive mood to "${itemName}"${ctx}.`,
        `Hard rules: Exclude remix, live, acoustic, cover, re-record, Taylor's Version, sped up, slowed, extended, edit, karaoke, instrumental, piano, lullaby, kids, parody, diss.`,
        `Diversity: at most 1 song per artist.`,
        `Output format per entry: Title - Artist.`,
        `Output: single line, comma-separated, no extra text, no quotes, no numbering, no category prefixes.`
      ].join(' ');
    }

    if (category === 'álbumes' || category === 'albums') {
      return [
        `You are a music recommender. Return exactly 10 albums related in mood, style, or artistic voice to "${itemName}"${ctx}.`,
        `Hard rules: Exclude deluxe/remaster/live/re-record/extended editions and compilations unless they are canonical.`,
        `Diversity: at most 1 album per primary artist.`,
        `Output format per entry: Album Title - Artist.`,
        `Output: single line, comma-separated, no extra text, no quotes, no numbering.`
      ].join(' ');
    }

    if (category === 'artistas' || category === 'artists') {
      return [
        `You are a music recommender. Return exactly 10 artists similar in style, audience, and mood to "${itemName}"${ctx}.`,
        `Hard rules: Avoid near-duplicates and tribute/cover-only acts.`,
        `Output format per entry: Artist.`,
        `Output: single line, comma-separated, no extra text, no quotes, no numbering.`
      ].join(' ');
    }

    if (category === 'peliculas' || category === 'películas' || category === 'movies') {
      return [
        `You are a movie recommender. Return exactly 10 movies similar to "${itemName}"${ctx} by theme, tone, character arcs, cultural context, and emotional resonance.`,
        `Hard rules: Recommend full feature films, avoid episodes/trailers. Do NOT include years in the output.`,
        `Diversity: at most 1 per franchise.`,
        `Output format per entry: Movie Title.`,
        `Output: single line, comma-separated, no extra text, no quotes, no numbering.`
      ].join(' ');
    }

    if (category === 'series de televisión' || category === 'series' || category === 'tv') {
      return [
        `You are a TV recommender. Return exactly 10 TV series similar to "${itemName}"${ctx} by tone, themes, character growth, and audience.`,
        `Hard rules: Recommend full series, not episodes. Do NOT include years in the output.`,
        `Diversity: at most 1 per franchise.`,
        `Output format per entry: Series Title.`,
        `Output: single line, comma-separated, no extra text, no quotes, no numbering.`
      ].join(' ');
    }

    if (category === 'libros' || category === 'books') {
      return [
        `You are a book recommender. Return exactly 10 books related to "${itemName}"${ctx} by coming-of-age motifs, family dynamics, identity, place versus ambition, or bittersweet tone (adapt to the seed).`,
        `Hard rules: Avoid study guides/summaries/compilations. Prefer original works or acclaimed translations.`,
        `Output format per entry: Book Title - Author.`,
        `Output: single line, comma-separated, no extra text, no quotes, no numbering.`
      ].join(' ');
    }

   if (category === 'videojuegos' || category === 'videojuego' || category === 'videogames' || category === 'videogame') {
     return [
       `You are a game recommender. Task: suggest exactly 10 video games with "Fantastic Four vibes" when users imply it (e.g., they ask for FF vibes or ensemble/science/cosmic themes) relative to "${itemName}"${ctx}.`,
       `Definition of "Fantastic Four vibes": ensemble superhero team (prefer 4–5 core members), science-driven problem solving, cosmic/space exploration, family/team dynamics, cooperative or team-synergy gameplay, big-brain antagonists or science catastrophes.`,
       `Constraints: Exclude DLC, expansions, episodes, character packs, and bundles. Avoid one-hero-centric games (like Spider-Man/Batman) unless the story/gameplay is genuinely ensemble/team-focused.`,
       `Prefer games whose descriptions mention team, squad, co-op, ensemble, family, cosmic, space, galaxy, interstellar, science, scientist, exploration.`,
       `Output format per entry: Game Title.`,
       `Output: single line, comma-separated, no extra text, no quotes, no numbering.`
     ].join(' ');
   }

    // Fallback: generic simple list to avoid failure
    return [
      `Return exactly 10 items related to "${itemName}"${ctx}.`,
      `Output: single line, comma-separated, no extra text, no quotes, no numbering.`
    ].join(' ');
  }

  /**
   * Generates a list of recommended queries (strings) for a given category.
   * Keeps existing return type (string[]). Only prompt changed to reduce bias.
   */
  async generateRecommendations(itemType, itemName, itemContext = '') {
    if (!this.apiKey) {
      console.error('Gemini API Key not configured. Gemini AI service will be unavailable.');
      return [];
    }

    try {
      const promptText = this._buildDomainPrompt(itemType, itemName, itemContext);

      const requestBody = {
        contents: [{
          parts: [{ text: promptText }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 220,
          topP: 0.9,
          topK: 40
        }
      };

      // Gate noisy logs by env flag
      const debug = String(process.env.SEARCH_DEBUG || '').toLowerCase() === 'true';
      if (debug) {
        console.log('Sending prompt to Gemini API:', promptText);
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API Error Response:', errorData);
        throw new Error(errorData.error?.message || `Error en la API de Gemini: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const rawResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!rawResponseText) {
        console.error('Invalid response from Gemini API:', JSON.stringify(data, null, 2));
        throw new Error('Respuesta inválida de la API de Gemini: Estructura inesperada.');
      }

      const debug2 = String(process.env.SEARCH_DEBUG || '').toLowerCase() === 'true';
      if (debug2) {
        console.log('Gemini raw response:', rawResponseText);
      }

      // Normalize single-line comma-separated output into array of strings
      const variantRegex = /\b(remix|live|acoustic|cover|re-?record|taylor'?s version|sped ?up|slowed|extended|edit|karaoke|instrumental|piano|lullaby|kids|parody|diss|version|versión)\b/i;
      // Strip any years like "(2015)" that the model may still include
      const cleanedLine = rawResponseText
        .replace(/\r?\n/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/\(\s*\d{4}\s*\)/g, '')
        .trim();
      const tokens = cleanedLine.split(',').map(s => s.trim()).filter(Boolean);

      const seen = new Set();
      const results = tokens
        .map(t => t.replace(/(\d+\.\s*|["'*`_])/g, '').trim())
        .map(t => t.replace(/\s+-\s+/g, ' - '))
        .map(t => t.replace(/\s+\(\s*(\d{4})\s*\)\s*$/i, ' ($1)'))
        .filter(t => t.length > 0)
        .filter(t => t.toLowerCase() !== String(itemName || '').toLowerCase())
        .filter(t => !variantRegex.test(t))
        .filter(t => {
          const key = t.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

      return results;
    } catch (error) {
      console.error('Error generating recommendations with Gemini AI:', error.message);
      if (String(error.message || '').includes('429')) {
        console.warn('Gemini API quota exceeded. Please wait or check your plan.');
      }
      throw error;
    }
  }
}

module.exports = GeminiAiService;