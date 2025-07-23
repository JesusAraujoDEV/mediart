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
      const prompt = `Dame 10 ${itemCategory} que sean similares o tengan las "vibras" de "${itemName}" ${itemContext}. Responde ÚNICAMENTE con los nombres de los ${itemCategory}, separados por comas, sin números, sin introducciones y sin formato markdown. Asegúrate de que TODOS los elementos listados sean estrictamente ${itemCategory}.`;
      console.log('Sending prompt to DeepSeek API:', prompt);

      const completion = await this.openai.chat.completions.create({
        messages: [{ role: "system", content: `Eres un asistente útil especializado en dar recomendaciones de ${itemCategory}s.` }, { role: "user", content: prompt }], // Añadí contexto al rol del sistema
        model: "deepseek-chat",
        max_tokens: 200,
        temperature: 0.7,
      });

      const rawResponse = completion.choices[0].message.content;
      console.log('DeepSeek AI raw response:', rawResponse);

      const recommendedQueries = rawResponse
        .split(',')
        .map(query => query.trim())
        .filter(query => query.length > 0);

      return recommendedQueries;

    } catch (error) {
      console.error('DeepSeek API Error Response:', error.response ? error.response.data : error.message);
      throw new Error(`Error generating recommendations with DeepSeek AI: ${error.message}`);
    }
  }
}

module.exports = DeepSeekAiService;