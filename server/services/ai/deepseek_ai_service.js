// services/deepseek_ai_service.js
const OpenAI = require("openai"); // <-- ¡CAMBIO AQUÍ! Usamos require
const { config } = require('../../config/config');

class DeepSeekAiService {
  constructor() {
    // Verificar si la API key de DeepSeek está configurada
    if (!config.apiKeys.deepseek) {
      console.warn('DeepSeek API Key not configured. DeepSeek AI service will be unavailable.');
      this.openai = null; // Establecer a null si no hay API key
    } else {
      this.openai = new OpenAI({
        baseURL: 'https://api.deepseek.com', // Base URL de DeepSeek
        apiKey: config.apiKeys.deepseek,      // Tu API Key de DeepSeek
      });
    }
  }

  async generateRecommendations(itemCategory, itemName, itemContext = '') {
    if (!this.openai) {
      console.error('DeepSeek AI service not initialized due to missing API Key.');
      return [];
    }

    try {
      // Prompt reforzado con formatos estrictos e idioma alineado con Gemini:
      // - Genera SIEMPRE en inglés para películas/libros/series. Música y videojuegos generalmente conservan títulos originales.
      // - No incluir el mismo título ni variantes mínimas (remix, live, acoustic, cover, re-record, Taylor's Version, sped up, slowed, extended, edit, karaoke).
      // - Variedad de artistas/obras; similitud por estilo/tempo/energía/mood/temática.
      // - SALIDA en UNA sola línea separada por comas, sin numeración, sin texto extra, sin comillas, sin markdown.
      // - Formatos estrictos por categoría:
      //   canciones:            "Title - Artist"
      //   álbumes:              "Album Title - Artist"
      //   artistas:             "Artist"
      //   peliculas:            "Movie Title (Year)"
      //   series de televisión: "Series Title (Year)"
      //   libros:               "Book Title - Author"
      //   videojuegos:          "Game Title (Year)"
      // - Todos los elementos deben ser ${itemCategory} válidos y adecuados para búsqueda posterior en sus APIs.
      const wantEnglish = ['peliculas','series de televisión','libros'].includes(itemCategory);
      const prompt = `Quiero 10 ${itemCategory} con la misma vibra que "${itemName}"${itemContext ? ' ' + itemContext : ''}. ` +
        `Prohibido incluir el mismo "${itemName}" ni sus variantes (remix, live, acoustic, cover, re-record, Taylor's Version, sped up, slowed, extended, edit, karaoke). ` +
        `Evita duplicados y títulos casi idénticos. ` +
        `${wantEnglish ? 'Responde en inglés. ' : ''}` +
        `Devuelve la lista en una sola línea separada por comas, sin números ni texto adicional, sin comillas. ` +
        `Formato estricto por categoría: ` +
        `canciones="Title - Artist"; álbumes="Album Title - Artist"; artistas="Artist"; ` +
        `peliculas="Movie Title (Year)"; series de televisión="Series Title (Year)"; libros="Book Title - Author"; videojuegos="Game Title (Year)".`;
      console.log('Sending prompt to DeepSeek API:', prompt);

      const completion = await this.openai.chat.completions.create({
        messages: [{ role: "system", content: `Eres un asistente útil especializado en dar recomendaciones de ${itemCategory}s.` }, { role: "user", content: prompt }], // Añadí contexto al rol del sistema
        model: "deepseek-chat",
        max_tokens: 200,
        temperature: 0.7,
      });

      const rawResponse = completion.choices[0].message.content;
      console.log('DeepSeek AI raw response:', rawResponse);

      // Normalización y deduplicación:
      const seen = new Set();
      const variantRegex = /\b(remix|live|acoustic|cover|re-?record|taylor'?s version|sped ?up|slowed|extended|edit|karaoke|instrumental|piano|lullaby|kids|parody|diss|version|versión)\b/i;

      // Si vino con prefijo tipo "canciones=...", eliminarlo
      const cleanedRaw = rawResponse.replace(/^\s*\w+\s*=\s*/i, '');

      const recommendedQueries = cleanedRaw
        .split(',')
        .map(q => q.replace(/(\d+\.\s*|["'*`\-_])/g, '').trim())
        .map(q => q.replace(/\s+-\s+/g, ' - ')) // normaliza separador
        .map(q => q.replace(/\s+\(\s*(\d{4})\s*\)\s*$/i, ' ($1)')) // normaliza "(Year)"
        .filter(q => q.length > 0 && !/no puedo/i.test(q))
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