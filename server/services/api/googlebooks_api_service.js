const axios = require('axios');
const { config } = require('../../config/config'); // Importa tu objeto de configuración

class GoogleBooksApiService {
  constructor() {
    this.apiKey = config.apiKeys.googleBooks;
    this.baseUrl = 'https://www.googleapis.com/books/v1';
  }

  async search(query) {
    if (!this.apiKey) {
      console.error('Google Books API Key not configured.');
      return { books: [] };
    }

    try {
      const response = await axios.get(`${this.baseUrl}/volumes`, {
        params: {
          q: query,
          key: this.apiKey,
          maxResults: 5
        }
      });

      const data = response.data;
      const books = data.items ? data.items.map(item => ({
        id: item.id,
        title: item.volumeInfo.title || 'N/A',
        authors: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'N/A',
        published_date: item.volumeInfo.publishedDate || 'N/A',
        description: item.volumeInfo.description || 'No description available.',
        thumbnail_url: item.volumeInfo.imageLinks ? (item.volumeInfo.imageLinks.thumbnail || item.volumeInfo.imageLinks.smallThumbnail) : null,
        external_url: item.volumeInfo.infoLink || null
      })) : [];

      return { books };

    } catch (error) {
      console.error('Error searching Google Books:', error.response ? error.response.data : error.message);
      return { books: [] };
    }
  }
}

module.exports = GoogleBooksApiService;