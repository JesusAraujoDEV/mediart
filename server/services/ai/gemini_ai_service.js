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
      // *** MODIFICACIÓN DEL PROMPT AQUÍ ***
      let promptText = `Dame 10 nombres de ${itemType} que sean similares o tengan las "vibras" de "${itemName}"`;
      if (itemContext) {
        promptText += ` ${itemContext}`;
      }
      promptText += `. Responde ÚNICAMENTE con los nombres de los ${itemType}, separados por comas, sin números, sin introducciones y sin formato markdown. Es CRÍTICO que todos los elementos listados sean estrictamente ${itemType}.`; // <-- Reforzado aquí

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

      const rawResponseText = data.candidates[0].content.parts[0].text;
      console.log('Gemini raw response:', rawResponseText);

      const recommendedTitles = rawResponseText
        .split(',')
        .map(title => title.replace(/(\d+\.\s*|["'*`\-_])/g, '').trim())
        .filter(title => title.length > 0 && !title.includes('No puedo'));

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