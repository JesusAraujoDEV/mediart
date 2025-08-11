// services/deepseek_ai_service.js
const OpenAI = require("openai");
const { config } = require('../../config/config');

class DeepSeekAiService {
  constructor() {
    if (!config.apiKeys.deepseek) {
      console.warn('DeepSeek API Key not configured. DeepSeek AI service will be unavailable.');
      this.openai = null;
    } else {
      this.openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: config.apiKeys.deepseek,
      });
    }
  }

  _buildDomainPrompt(itemCategory, itemName, itemContext = '') {
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
        `Hard rules: Recommend full feature films, avoid episodes/trailers. Prefer original titles; include year when known as "(Year)".`,
        `Diversity: at most 1 per franchise.`,
        `Output format per entry: Movie Title (Year).`,
        `Output: single line, comma-separated, no extra text, no quotes, no numbering.`
      ].join(' ');
    }

    if (category === 'series de televisión' || category === 'series' || category === 'tv') {
      return [
        `You are a TV recommender. Return exactly 10 TV series similar to "${itemName}"${ctx} by tone, themes, character growth, and audience.`,
        `Hard rules: Recommend full series, not episodes. Prefer original titles; include start year when known as "(Year)".`,
        `Diversity: at most 1 per franchise.`,
        `Output format per entry: Series Title (Year).`,
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
        `You are a game recommender. Return exactly 10 video games analogous to "${itemName}"${ctx} in vibe, narrative arcs, indie/dramedy feel, or slice-of-life/coming-of-age parallels when applicable.`,
        `Hard rules: Avoid DLC-only/expansions-only. Prefer base games. Do NOT include years in the output.`,
        `Output format per entry: Game Title.`,
        `Output: single line, comma-separated, no extra text, no quotes, no numbering.`
      ].join(' ');
    }

    return [
      `Return exactly 10 items related to "${itemName}"${ctx}.`,
      `Output: single line, comma-separated, no extra text, no quotes, no numbering.`
    ].join(' ');
  }

  async generateRecommendations(itemCategory, itemName, itemContext = '') {
    if (!this.openai) {
      console.error('DeepSeek AI service not initialized due to missing API Key.');
      return [];
    }

    try {
      const prompt = this._buildDomainPrompt(itemCategory, itemName, itemContext);
      console.log('Sending prompt to DeepSeek API:', prompt);

      const completion = await this.openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a recommender system. Output only a single comma-separated line. No extra commentary." },
          { role: "user", content: prompt }
        ],
        model: "deepseek-chat",
        max_tokens: 220,
        temperature: 0.3,
      });

      const rawResponse = completion.choices?.[0]?.message?.content || '';
      console.log('DeepSeek AI raw response:', rawResponse);

      const variantRegex = /\b(remix|live|acoustic|cover|re-?record|taylor'?s version|sped ?up|slowed|extended|edit|karaoke|instrumental|piano|lullaby|kids|parody|diss|version|versión)\b/i;
      const cleanedRaw = rawResponse.replace(/\r?\n/g, ' ').replace(/\s{2,}/g, ' ').replace(/^\s*\w+\s*=\s*/i, '').trim();

      const seen = new Set();
      const recommendedQueries = cleanedRaw
        .split(',')
        .map(q => q.replace(/(\d+\.\s*|["'*`_])/g, '').trim())
        .map(q => q.replace(/\s+-\s+/g, ' - '))
        .map(q => q.replace(/\s+\(\s*(\d{4})\s*\)\s*$/i, ' ($1)'))
        .filter(q => q.length > 0)
        .filter(q => q.toLowerCase() !== String(itemName || '').toLowerCase())
        .filter(q => !variantRegex.test(q))
        .filter(q => {
          const key = q.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

      return recommendedQueries;
    } catch (error) {
      console.error('DeepSeek API Error Response:', error.response ? error.response.data : error.message);
      throw new Error(`Error generating recommendations with DeepSeek AI: ${error.message}`);
    }
  }
}

module.exports = DeepSeekAiService;