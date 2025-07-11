// services/spotify_api_service.js
const axios = require('axios');
const { config } = require('../../config/config'); // Importa tu objeto de configuración

class SpotifyApiService {
  constructor() {
    this.clientId = config.apiKeys.spotifyClientId;
    this.clientSecret = config.apiKeys.spotifyClientSecret;
    this.accessToken = null;
    this.tokenExpiry = 0;
  }

  async #authenticate() {
    if (this.accessToken && Date.now() < this.tokenExpiry - 60000) {
      return;
    }

    if (!this.clientId || !this.clientSecret) {
      console.error('Spotify Client ID or Client Secret not configured.');
      throw new Error('Spotify API credentials missing.');
    }

    try {
      const authString = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

      // Corrige la URL del endpoint de autenticación de Spotify
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
      throw new Error('Failed to obtain/refresh Spotify access token.');
    }
  }

  /**
   * Realiza una búsqueda en Spotify.
   * @param {string} query La cadena de búsqueda.
   * @param {string} [type='track,artist,album'] Los tipos de items a buscar (track, artist, album).
   * @returns {Promise<Array>} Un array plano de resultados formateados.
   */
  async search(query, type = 'track,artist,album') { // 👈 Acepta el parámetro 'type' con un valor por defecto
    try {
      await this.#authenticate();

      if (!this.accessToken) {
        throw new Error('Spotify access token not available. Authentication failed.');
      }

      // Corrige la URL del endpoint de búsqueda de Spotify
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        params: {
          q: query,
          type: type, // 👈 Usamos el parámetro 'type' recibido
          limit: 10 // Puedes ajustar el límite si lo deseas
        }
      });

      const data = response.data;
      let formattedResults = [];

      // Mapear Tracks (Canciones)
      if (data.tracks && data.tracks.items && (type.includes('track') || type === 'track')) {
          data.tracks.items.forEach(track => {
              formattedResults.push({
                  title: track.name,
                  type: 'song',
                  description: `Artista(s): ${track.artists.map(a => a.name).join(', ')} - Álbum: ${track.album.name}. Duración: ${Math.floor(track.duration_ms / 60000)}:${(track.duration_ms % 60000 / 1000).toFixed(0).padStart(2, '0')}.`,
                  coverUrl: track.album.images.length > 0 ? track.album.images[0].url : null,
                  releaseDate: track.album.release_date || null,
                  externalId: track.id,
                  externalSource: 'Spotify',
                  avgRating: null,
                  externalUrl: track.external_urls.spotify
              });
          });
      }

      // Mapear Artists (Artistas)
      if (data.artists && data.artists.items && (type.includes('artist') || type === 'artist')) {
          data.artists.items.forEach(artist => {
              formattedResults.push({
                  title: artist.name,
                  type: 'artist',
                  description: `Géneros: ${artist.genres.join(', ') || 'N/A'}. Seguidores: ${artist.followers.total.toLocaleString()}.`,
                  coverUrl: artist.images.length > 0 ? artist.images[0].url : null,
                  releaseDate: null,
                  externalId: artist.id,
                  externalSource: 'Spotify',
                  avgRating: null,
                  externalUrl: artist.external_urls.spotify
              });
          });
      }

      // Mapear Albums (Álbumes)
      if (data.albums && data.albums.items && (type.includes('album') || type === 'album')) {
          data.albums.items.forEach(album => {
              formattedResults.push({
                  title: album.name,
                  type: 'album',
                  description: `Artista(s): ${album.artists.map(a => a.name).join(', ')}. Tipo: ${album.album_type}. Total de canciones: ${album.total_tracks}.`,
                  coverUrl: album.images.length > 0 ? album.images[0].url : null,
                  releaseDate: album.release_date || null,
                  externalId: album.id,
                  externalSource: 'Spotify',
                  avgRating: null,
                  externalUrl: album.external_urls.spotify
              });
          });
      }

      return formattedResults; // Retorna un array plano de ítems unificados

    } catch (error) {
      console.error('Error searching Spotify:', error.response ? error.response.data : error.message);
      throw error; // Relanza el error para que un middleware de errores lo maneje
    }
  }

  // Los métodos getTrackDetails, getAlbumDetails, getArtistDetails también deben
  // tener sus URLs corregidas si los estás usando:
  async getTrackDetails(trackId) {
    try {
      await this.#authenticate();
      const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, { // 👈 URL corregida
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      });
      const track = response.data;
      if (!track) return null;

      return {
        title: track.name,
        type: 'song',
        description: `Artista(s): ${track.artists.map(a => a.name).join(', ')} - Álbum: ${track.album.name}. Duración: ${Math.floor(track.duration_ms / 60000)}:${(track.duration_ms % 60000 / 1000).toFixed(0).padStart(2, '0')}.`,
        coverUrl: track.album.images.length > 0 ? track.album.images[0].url : null,
        releaseDate: track.album.release_date || null,
        externalId: track.id,
        externalSource: 'Spotify',
        avgRating: null,
        externalUrl: track.external_urls.spotify
      };
    } catch (error) {
      console.error(`Error fetching Spotify track details for ID ${trackId}:`, error.response ? error.response.data : error.message);
      return null;
    }
  }

  async getAlbumDetails(albumId) {
    try {
      await this.#authenticate();
      const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, { // 👈 URL corregida
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      });
      const album = response.data;
      if (!album) return null;

      return {
        title: album.name,
        type: 'album',
        description: `Artista(s): ${album.artists.map(a => a.name).join(', ')}. Tipo: ${album.album_type}. Total de canciones: ${album.total_tracks}.`,
        coverUrl: album.images.length > 0 ? album.images[0].url : null,
        releaseDate: album.release_date || null,
        externalId: album.id,
        externalSource: 'Spotify',
        avgRating: null,
        externalUrl: album.external_urls.spotify
      };
    } catch (error) {
      console.error(`Error fetching Spotify album details for ID ${albumId}:`, error.response ? error.response.data : error.message);
      return null;
    }
  }

  async getArtistDetails(artistId) {
    try {
      await this.#authenticate();
      const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, { // 👈 URL corregida
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      });
      const artist = response.data;
      if (!artist) return null;

      return {
        title: artist.name,
        type: 'artist',
        description: `Géneros: ${artist.genres.join(', ') || 'N/A'}. Seguidores: ${artist.followers.total.toLocaleString()}. Popularidad: ${artist.popularity}%.`,
        coverUrl: artist.images.length > 0 ? artist.images[0].url : null,
        releaseDate: null,
        externalId: artist.id,
        externalSource: 'Spotify',
        avgRating: null,
        externalUrl: artist.external_urls.spotify
      };
    } catch (error) {
      console.error(`Error fetching Spotify artist details for ID ${artistId}:`, error.response ? error.response.data : error.message);
      return null;
    }
  }
}

module.exports = SpotifyApiService;