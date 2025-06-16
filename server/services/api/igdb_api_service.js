const axios = require('axios');
const { config } = require('../../config/config');

class IgdbApiService {
  constructor() {
    this.clientId = config.apiKeys.igdbClientId;
    this.clientSecret = config.apiKeys.igdbClientSecret;
    this.accessToken = null;
    this.tokenExpiry = 0;
    this.baseUrl = 'https://api.igdb.com/v4';
  }

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
      await this.#authenticate();

      if (!this.accessToken) {
        throw new Error('IGDB access token not available. Authentication failed.');
      }

      const response = await axios.post(`${this.baseUrl}/games`,
        `search "${query}"; fields name, summary, cover.url, first_release_date, genres.name, platforms.name, slug, aggregated_rating; limit 10;`,
        {
          headers: {
            'Client-ID': this.clientId,
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'text/plain'
          }
        }
      );

      const gamesData = response.data;

      const videogames = gamesData.map(game => {
        let coverUrl = null;
        if (game.cover && game.cover.url) {
          // Reemplazar 't_thumb' por 't_cover_big' y '.jpg' por '.webp'
          coverUrl = `https:${game.cover.url.replace('t_thumb', 't_cover_big').replace('.jpg', '.webp')}`;
        }

        return {
          id: game.id,
          name: game.name,
          summary: game.summary || 'No summary available.',
          cover_url: coverUrl, // <--- ¡CAMBIO AQUÍ!
          release_date: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString().split('T')[0] : null,
          genres: game.genres ? game.genres.map(g => g.name) : [],
          platforms: game.platforms ? game.platforms.map(p => p.name).join(', ') : 'N/A',
          external_url: game.slug ? `https://www.igdb.com/games/${game.slug}` : null,
          avg_rating: game.aggregated_rating || null,
        };
      });

      return videogames;

    } catch (error) {
      console.error('Error searching IGDB:', error.response ? error.response.data : error.message);
      return [];
    }
  }
}

module.exports = IgdbApiService;