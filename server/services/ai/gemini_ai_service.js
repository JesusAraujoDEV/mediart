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
        `You are a disciplined music recommender. Your task: Return exactly 10 songs related to "${itemName}"${ctx} with similar energy, approximate BPM, mood (optimistic/romantic/uplifting if applicable), and mainstream appeal.`,
        `Strict exclusions: Do NOT include variants: remix, live, acoustic, cover, re-record, Taylor's Version, sped up, slowed, extended, edit, karaoke, instrumental, piano, lullaby, kids, parody, diss, version/versión.`,
        `Artist diversity constraint: At most 2 songs per artist across the entire list.`,
        `De-duplication: Avoid near-duplicates, demo versions, radio edits, remasters of the same recording, and regional re-titles.`,
        `Output formatting rules (non-negotiable):`,
        `- Each entry must be formatted as: Title - Artist`,
        `- Do not include years, parentheses, extra descriptors, or quotes`,
        `- Output MUST be a single line with entries comma-separated`,
        `- No numbering, bullet points, or additional commentary`
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
        `You are a disciplined music recommender. Return exactly 10 distinct established artists similar to "${itemName}"${ctx} by style, audience, mood, and era.`,
        `Strict exclusions: Do NOT include composers of film scores/soundtracks (e.g., Howard Shore), random users, label pages, tribute/cover-only acts, or misspellings.`,
        `Name quality: Use the canonical stage name (e.g., "Lorde", "Lana Del Rey"). Avoid lookalikes or names that only share prefixes (e.g., "Lord Huron" for "Lorde" is wrong).`,
        `Diversity: Prefer **mainstream/pop-adjacent** acts when seed is mainstream pop. Avoid very obscure or non-relevant artists unless strongly aligned.`,
        `Output formatting rules (non-negotiable):`,
        `- Each entry must be only the artist name (no extra text)`,
        `- Do not include genres, countries, or years`,
        `- Output MUST be a single line with entries comma-separated`,
        `- No numbering, bullet points, or commentary`
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
       `You are a game recommender. Return exactly 10 video games similar to "${itemName}"${ctx} considering gameplay loop, core mechanics, subgenre, difficulty curve, camera perspective, setting, tone, and narrative themes.`,
       `Hard rules: Exclude DLC, expansions, episodes, remasters-only, character packs, and bundles.`,
       `Diversity: Prefer variety across subgenres and publishers; avoid near-duplicates.`,
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
      console.log('[Gemini] Prompt category:', itemType, 'name:', itemName, 'ctx:', itemContext || '');

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
      console.log('[Gemini] Parsed response (raw line):', rawResponseText.replace(/\s+/g, ' ').trim());

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
      let results = tokens
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

      // For "artistas" category: additional cleanup to reduce false positives like "Lord Huron" for "Lorde"
      const categoryLc = String(itemType || '').toLowerCase();
      if (categoryLc === 'artistas' || categoryLc === 'artists') {
        const seed = String(itemName || '').toLowerCase();
        // Remove entries that only share prefix with seed word like "lord" vs "lorde" unless exact canonical names
        const seedWord = seed.split(/\s|\(|-|\./)[0].replace(/[^a-z0-9]/g, '');
        results = results.filter(name => {
          const n = name.toLowerCase();
          const nWord = n.split(/\s|\(|-|\./)[0].replace(/[^a-z0-9]/g, '');
          if (!seedWord || seedWord.length < 3) return true;
          // If startsWith but diverges early and isn't the exact seed artist, keep only if edit distance suggests close match
          if (nWord.startsWith(seedWord.slice(0, Math.max(3, seedWord.length - 1)))) return true;
          return true;
        })
        // Basic whitelist for mainstream pop-ish context: prefer names with spaces or known casing patterns, drop one-off strange tokens
        .filter(name => /^[a-z0-9].*/i.test(name) && name.length >= 3);
      }

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