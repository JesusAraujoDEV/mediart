// services/spotify_api_service.js
const axios = require('axios');
const { config } = require('../../config/config'); // Importa tu objeto de configuración

class SpotifyApiService {
  constructor() {
    this.clientId = config.apiKeys.spotifyClientId;
    this.clientSecret = config.apiKeys.spotifyClientSecret;
    this.accessToken = null;
    this.tokenExpiry = 0;

    //this.#authenticate();
  }

  async #authenticate() {
    if (this.accessToken && Date.now() < this.tokenExpiry - 60000) {
      return;
    }

    try {
      const authString = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

      const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      this.accessToken = response.data.access_token;

      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      console.log('Spotify access token obtained/refreshed successfully.');

    } catch (error) {
      console.error('Error obtaining/refreshing Spotify access token:', error.response ? error.response.data : error.message);
    }
  }

  async search(query) {
    try {
      await this.#authenticate();

      if (!this.accessToken) {
        throw new Error('Spotify access token not available. Authentication failed.');
      }

      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        params: {
          q: query,
          type: 'track,artist,album', // Buscar en canciones, artistas y álbumes
          limit: 5 // Limita los resultados por cada tipo
        }
      });

      const data = response.data;
      const songs = data.tracks ? data.tracks.items.map(track => ({
        id: track.id,
        title: track.name,
        artist_name: track.artists.map(a => a.name).join(', '),
        album_name: track.album.name,
        release_date: track.album.release_date,
        thumbnail_url: track.album.images.length > 0 ? track.album.images[0].url : null,
        external_url: track.external_urls.spotify
      })) : [];

      const artists = data.artists ? data.artists.items.map(artist => ({
        id: artist.id,
        name: artist.name,
        genres: artist.genres,
        followers: artist.followers.total,
        image_url: artist.images.length > 0 ? artist.images[0].url : null,
        external_url: artist.external_urls.spotify
      })) : [];

      const albums = data.albums ? data.albums.items.map(album => ({
        id: album.id,
        name: album.name,
        artist_name: album.artists.map(a => a.name).join(', '),
        release_date: album.release_date,
        thumbnail_url: album.images.length > 0 ? album.images[0].url : null,
        external_url: album.external_urls.spotify
      })) : [];

      return { songs, artists, albums };

    } catch (error) {
      console.error('Error searching Spotify:', error.response ? error.response.data : error.message);
      return { songs: [], artists: [], albums: [] };
    }
  }
}

module.exports = SpotifyApiService;