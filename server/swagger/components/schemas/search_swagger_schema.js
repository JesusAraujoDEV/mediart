// server/swagger/components/schemas/search_swagger_schema.js

module.exports = {
    SearchQuery: {
      type: 'object',
      properties: {
        q: {
          type: 'string',
          minLength: 1,
          description: 'Término de búsqueda',
          example: 'Stranger Things',
        },
        type: {
          type: 'string',
          description: 'Tipo de contenido a buscar (opcional)',
          enum: ['movie', 'tvshow', 'song', 'artist', 'album', 'videogame', 'book', 'general'],
          example: 'tvshow',
        },
      },
      required: ['q'],
    },
    SearchResults: {
      type: 'object',
      description: 'Resultados combinados de múltiples plataformas',
      properties: {
        movies: {
          type: 'array',
          items: { type: 'object' },
          example: [{ id: 1, title: 'Inception' }],
        },
        tvshows: {
          type: 'array',
          items: { type: 'object' },
          example: [{ id: 1, name: 'Breaking Bad' }],
        },
        songs: {
          type: 'array',
          items: { type: 'object' },
          example: [{ id: '123', name: 'Bohemian Rhapsody' }],
        },
        artists: {
          type: 'array',
          items: { type: 'object' },
          example: [{ id: '456', name: 'Queen' }],
        },
        albums: {
          type: 'array',
          items: { type: 'object' },
          example: [{ id: '789', name: 'A Night at the Opera' }],
        },
        books: {
          type: 'array',
          items: { type: 'object' },
          example: [{ id: 'abc', title: 'The Hobbit' }],
        },
        videogames: {
          type: 'array',
          items: { type: 'object' },
          example: [{ id: 'xyz', title: 'The Witcher 3' }],
        },
      },
    },
    UserSearchResults: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/User',
      },
      description: 'Resultados de búsqueda de usuarios por username',
    },
  };
  