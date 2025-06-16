const axios = require('axios');
const { config } = require('../../config/config');

class GoogleBooksApiService {
  constructor() {
    this.apiKey = config.apiKeys.googleBooks;
    this.baseUrl = 'https://www.googleapis.com/books/v1';
  }

  async search(query) {
    if (!this.apiKey) {
      console.error('Google Books API Key not configured.');
      return [];
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
      const books = data.items ? data.items.map(item => {
        const bookId = item.id;
        const thumbnailUrl = bookId ? `https://play.google.com/books/publisher/content/images/frontcover/${bookId}?fife=w240-h345` : null;

        return {
          id: item.id,
          title: item.volumeInfo.title || 'N/A',
          authors: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'N/A',
          published_date: item.volumeInfo.publishedDate || 'N/A',
          description: item.volumeInfo.description || 'No description available.',
          thumbnail_url: thumbnailUrl,
          external_url: item.volumeInfo.infoLink || null,
          avg_rating: item.volumeInfo.averageRating || null,
        };
      }) : [];

      return books;

    } catch (error) {
      console.error('Error searching Google Books:', error.response ? error.response.data : error.message);
      return [];
    }
  }
}

module.exports = GoogleBooksApiService;