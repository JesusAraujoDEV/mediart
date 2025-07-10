// services/spotify_api_service.js
const axios = require('axios');
const { config } = require('../../config/config'); // Importa tu objeto de configuración

class SpotifyApiService {
    constructor() {
        this.clientId = config.apiKeys.spotifyClientId;
        this.clientSecret = config.apiKeys.spotifyClientSecret;
        this.accessToken = null;
        this.tokenExpiry = 0; // Almacena el timestamp de expiración
    }

    // Método privado para obtener/refrescar el token de acceso
    async #authenticate() {
        // Refrescar el token si no existe o si expira en menos de 1 minuto
        if (this.accessToken && Date.now() < this.tokenExpiry - 60000) {
            return; // Token válido, no es necesario refrescar
        }

        if (!this.clientId || !this.clientSecret) {
            console.error('Spotify Client ID or Client Secret not configured.');
            throw new Error('Spotify API credentials missing.');
        }

        try {
            const authString = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

            // URL de autenticación correcta de Spotify
            const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
                headers: {
                    'Authorization': `Basic ${authString}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            this.accessToken = response.data.access_token;
            // Calcular el timestamp de expiración
            this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
            console.log('Spotify access token obtained/refreshed successfully.');

        } catch (error) {
            console.error('Error obtaining/refreshing Spotify access token:', error.response ? error.response.data : error.message);
            throw new Error('Failed to obtain/refresh Spotify access token.'); // Lanza el error para que sea capturado
        }
    }

    async search(query) {
        try {
            await this.#authenticate(); // Asegura que el token esté disponible

            if (!this.accessToken) {
                throw new Error('Spotify access token not available after authentication attempt.');
            }

            // URL de búsqueda correcta de Spotify
            const response = await axios.get('https://api.spotify.com/v1/search', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                },
                params: {
                    q: query,
                    type: 'track,artist,album', // Buscar en canciones, artistas y álbumes
                    limit: 10 // Aumenta el límite para obtener más resultados si es necesario
                }
            });

            const data = response.data;
            let formattedResults = [];

            // Mapear Tracks (Canciones)
            if (data.tracks && data.tracks.items) {
                data.tracks.items.forEach(track => {
                    formattedResults.push({
                        // id: será autoIncrement en tu DB, este es el externalId
                        title: track.name,
                        type: 'music_track', // Tipo específico para canciones
                        description: `Artista(s): ${track.artists.map(a => a.name).join(', ')} - Álbum: ${track.album.name}. Duración: ${Math.floor(track.duration_ms / 60000)}:${(track.duration_ms % 60000 / 1000).toFixed(0).padStart(2, '0')}.`, // Construir descripción
                        coverUrl: track.album.images.length > 0 ? track.album.images[0].url : null,
                        releaseDate: track.album.release_date || null, // Algunos álbumes pueden no tener fecha
                        externalId: track.id,
                        externalSource: 'Spotify',
                        avgRating: null, // Spotify no proporciona rating directo
                        externalUrl: track.external_urls.spotify
                    });
                });
            }

            // Mapear Artists (Artistas)
            if (data.artists && data.artists.items) {
                data.artists.items.forEach(artist => {
                    formattedResults.push({
                        title: artist.name,
                        type: 'music_artist', // Tipo específico para artistas
                        description: `Géneros: ${artist.genres.join(', ') || 'N/A'}. Seguidores: ${artist.followers.total.toLocaleString()}.`, // Construir descripción
                        coverUrl: artist.images.length > 0 ? artist.images[0].url : null,
                        releaseDate: null, // Artistas no tienen una fecha de lanzamiento directa
                        externalId: artist.id,
                        externalSource: 'Spotify',
                        avgRating: null,
                        externalUrl: artist.external_urls.spotify
                    });
                });
            }

            // Mapear Albums (Álbumes)
            if (data.albums && data.albums.items) {
                data.albums.items.forEach(album => {
                    formattedResults.push({
                        title: album.name,
                        type: 'music_album', // Tipo específico para álbumes
                        description: `Artista(s): ${album.artists.map(a => a.name).join(', ')}. Tipo: ${album.album_type}. Total de canciones: ${album.total_tracks}.`, // Construir descripción
                        coverUrl: album.images.length > 0 ? album.images[0].url : null,
                        releaseDate: album.release_date || null,
                        externalId: album.id,
                        externalSource: 'Spotify',
                        avgRating: null,
                        externalUrl: album.external_urls.spotify
                    });
                });
            }

            // Si necesitas ordenar los resultados combinados de Spotify por algún criterio
            // Spotify no devuelve un campo de 'popularidad' combinado para todos los tipos en una búsqueda 'multi'
            // El ordenamiento global (entre diferentes APIs) debería hacerse en el ContentSearchService.

            return formattedResults; // Retorna un array plano de ítems unificados

        } catch (error) {
            console.error('Error searching Spotify:', error.response ? error.response.data : error.message);
            throw error; // Relanza el error para que un middleware de errores lo maneje
        }
    }

    async getTrackDetails(trackId) {
        try {
            await this.#authenticate();
            const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
                headers: { 'Authorization': `Bearer ${this.accessToken}` }
            });
            const track = response.data;
            if (!track) return null;

            return {
                title: track.name,
                type: 'music_track',
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
            const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
                headers: { 'Authorization': `Bearer ${this.accessToken}` }
            });
            const album = response.data;
            if (!album) return null;

            return {
                title: album.name,
                type: 'music_album',
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
            const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
                headers: { 'Authorization': `Bearer ${this.accessToken}` }
            });
            const artist = response.data;
            if (!artist) return null;

            return {
                title: artist.name,
                type: 'music_artist',
                description: `Géneros: ${artist.genres.join(', ') || 'N/A'}. Seguidores: ${artist.followers.total.toLocaleString()}. Popularidad: ${artist.popularity}%.`, // Añadimos popularidad del artista aquí
                coverUrl: artist.images.length > 0 ? artist.images[0].url : null,
                releaseDate: null, // Los artistas no tienen una fecha de lanzamiento directa
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