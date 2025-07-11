// services/googlebooks_api_service.js
const axios = require('axios');
const { config } = require('../../config/config');

class GoogleBooksApiService {
    constructor() {
        this.apiKey = config.apiKeys.googleBooks;
        this.baseUrl = 'https://www.googleapis.com/books/v1';
    }

    async search(query) {
        if (!this.apiKey) {
            console.error('Google Books API Key not configured. Returning empty array.');
            return [];
        }

        try {
            const response = await axios.get(`${this.baseUrl}/volumes`, {
                params: {
                    q: query,
                    key: this.apiKey,
                    maxResults: 5 // Reverted to original maxResults
                }
            });

            const data = response.data;
            const books = data.items ? data.items.map(item => {
                const bookId = item.id;
                // Reverted to original thumbnailUrl logic
                const thumbnailUrl = bookId ? `https://play.google.com/books/publisher/content/images/frontcover/${bookId}?fife=w240-h345` : null;

                return {
                    title: item.volumeInfo.title || 'N/A',
                    type: 'book', // Fixed type for books
                    description: item.volumeInfo.description || 'No description available.',
                    coverUrl: thumbnailUrl, // Using the original thumbnailUrl logic
                    // Map publishedDate to releaseDate in YYYY-MM-DD format
                    releaseDate: item.volumeInfo.publishedDate && item.volumeInfo.publishedDate !== 'N/A'
                                 ? new Date(item.volumeInfo.publishedDate).toISOString().split('T')[0]
                                 : null,
                    externalId: String(item.id), // Google Books ID as string
                    externalSource: 'Google Books', // Fixed source
                    // avgRating: from Google Books 'averageRating', formatted to 1 decimal or null
                    avgRating: item.volumeInfo.averageRating ? parseFloat(item.volumeInfo.averageRating.toFixed(1)) : null,
                    externalUrl: item.volumeInfo.infoLink || null, // Link to Google Books page
                };
            }) : [];

            // No specific sorting applied here, results will follow Google Books' default (relevance)
            // and the `maxResults: 5` limit.

            return books;

        } catch (error) {
            console.error('Error searching Google Books:', error.response ? error.response.data : error.message);
            throw error; // Re-throw to propagate the error up to SearchService
        }
    }
}

module.exports = GoogleBooksApiService;