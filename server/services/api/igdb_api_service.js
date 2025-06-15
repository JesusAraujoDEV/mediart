// services/igdb_api_service.js
const axios = require('axios');
const { config } = require('../../config/config'); // Importa tu objeto de configuración

class IgdbApiService {
  constructor() {
    this.clientId = config.apiKeys.igdbClientId;
    this.clientSecret = config.apiKeys.igdbClientSecret;
    this.accessToken = null;
    this.tokenExpiry = 0;
    this.baseUrl = 'https://api.igdb.com/v4';

    // Llama al método de autenticación en el constructor para obtener el token inicial
    this.#authenticate();
  }

  // Método privado para obtener/refrescar el token de acceso de Twitch para IGDB
  async #authenticate() {
    if (this.accessToken && Date.now() < this.tokenExpiry - 60000) {
      return;
    }

    if (!this.clientId || !this.clientSecret) {
        console.error('IGDB Client ID or Client Secret not configured.');
        throw new Error('IGDB authentication credentials missing.');
    }

    try {
      const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
        params: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials'
        }
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      console.log('IGDB/Twitch access token obtained/refreshed successfully.');

    } catch (error) {
      console.error('Error obtaining/refreshing IGDB/Twitch access token:', error.response ? error.response.data : error.message);
      throw new Error('Could not authenticate with IGDB/Twitch API');
    }
  }

  async search(query) {
    try {
      // Asegura que tengamos un token válido antes de hacer la búsqueda
      await this.#authenticate();

      if (!this.accessToken) {
        throw new Error('IGDB access token not available. Authentication failed.');
      }

      // La API de IGDB usa POST y el cuerpo de la petición para las consultas
      const response = await axios.post(`${this.baseUrl}/games`,
        `search "${query}"; fields name, summary, cover.url, first_release_date, genres.name, platforms.name; limit 10;`, // Body con la query
        {
          headers: {
            'Client-ID': this.clientId,
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'text/plain' // Importante: el cuerpo es texto plano para IGDB
          }
        }
      );

      const gamesData = response.data;

      const videogames = gamesData.map(game => ({
        id: game.id,
        name: game.name,
        summary: game.summary || 'No summary available.',
        cover_url: game.cover && game.cover.url ? `https:${game.cover.url}` : null, // IGDB a veces devuelve // en la URL, añadir https:
        release_date: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString().split('T')[0] : 'N/A', // Convertir timestamp a fecha
        genres: game.genres ? game.genres.map(g => g.name).join(', ') : 'N/A',
        platforms: game.platforms ? game.platforms.map(p => p.name).join(', ') : 'N/A',
        // No hay una URL "externa" directa como TMDB o Spotify, podrías construir una con un ID de juego si la necesitas
        // external_url: `https://www.igdb.com/games/${game.slug}` // Esto requeriría el slug del juego
      }));

      return { videogames };

    } catch (error) {
      console.error('Error searching IGDB:', error.response ? error.response.data : error.message);
      // Devuelve array vacío en caso de error
      return { videogames: [] };
    }
  }
}

module.exports = IgdbApiService;