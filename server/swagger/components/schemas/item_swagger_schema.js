module.exports = {
    ItemResponse: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1, description: 'ID del ítem' },
        title: { type: 'string', example: 'The Beatles', description: 'Título o nombre del ítem' },
        type: { 
          type: 'string',
          enum: ['movie', 'song', 'artist', 'album', 'tvshow', 'book', 'videogame'],
          example: 'artist',
          description: 'Tipo de ítem'
        },
        description: { type: 'string', example: 'Legendary British rock band.', description: 'Descripción del ítem', nullable: true },
        coverUrl: { type: 'string', format: 'uri', example: 'https://example.com/image.jpg', description: 'URL de la portada o imagen', nullable: true },
        releaseDate: { type: 'string', format: 'date-time', example: '1960-01-01T00:00:00.000Z', description: 'Fecha de lanzamiento', nullable: true },
        externalId: { type: 'string', example: '123456', description: 'ID externo del ítem' },
        externalSource: { 
          type: 'string',
          enum: ['Spotify', 'TMDB', 'IGDB', 'Google Books'],
          example: 'Spotify',
          description: 'Fuente externa del ítem'
        },
        avgRating: { type: 'number', minimum: 0, maximum: 100, example: 95, description: 'Calificación promedio', nullable: true },
        externalUrl: { type: 'string', format: 'uri', example: 'https://spotify.com/beatles', description: 'URL externa del ítem', nullable: true },
        createdAt: { type: 'string', format: 'date-time', example: '2025-06-26T12:00:00.000Z', description: 'Fecha de creación' },
        updatedAt: { type: 'string', format: 'date-time', example: '2025-06-26T12:00:00.000Z', description: 'Fecha de última actualización' }
      }
    },
  
    CreateItemRequest: {
      type: 'object',
      required: ['type', 'externalId', 'externalSource'],
      properties: {
        title: { type: 'string', example: 'The Beatles', description: 'Título o nombre del ítem' },
        type: { 
          type: 'string',
          enum: ['movie', 'song', 'artist', 'album', 'tvshow', 'book', 'videogame'],
          example: 'artist',
          description: 'Tipo de ítem'
        },
        description: { type: 'string', example: 'Legendary British rock band.', description: 'Descripción del ítem', nullable: true },
        coverUrl: { type: 'string', format: 'uri', example: 'https://example.com/image.jpg', description: 'URL de la portada o imagen', nullable: true },
        releaseDate: { type: 'string', format: 'date-time', example: '1960-01-01T00:00:00.000Z', description: 'Fecha de lanzamiento', nullable: true },
        externalId: { type: 'string', example: '123456', description: 'ID externo del ítem' },
        externalSource: { 
          type: 'string',
          enum: ['Spotify', 'TMDB', 'IGDB', 'Google Books'],
          example: 'Spotify',
          description: 'Fuente externa del ítem'
        },
        avgRating: { type: 'number', minimum: 0, maximum: 100, example: 95, description: 'Calificación promedio', nullable: true },
        externalUrl: { type: 'string', format: 'uri', example: 'https://spotify.com/beatles', description: 'URL externa del ítem', nullable: true }
      }
    },
  
    UpdateItemRequest: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'The Beatles', description: 'Título o nombre del ítem' },
        type: { 
          type: 'string',
          enum: ['movie', 'song', 'artist', 'album', 'tvshow', 'book', 'videogame'],
          example: 'artist',
          description: 'Tipo de ítem'
        },
        description: { type: 'string', example: 'Legendary British rock band.', description: 'Descripción del ítem', nullable: true },
        coverUrl: { type: 'string', format: 'uri', example: 'https://example.com/image.jpg', description: 'URL de la portada o imagen', nullable: true },
        releaseDate: { type: 'string', format: 'date-time', example: '1960-01-01T00:00:00.000Z', description: 'Fecha de lanzamiento', nullable: true },
        externalId: { type: 'string', example: '123456', description: 'ID externo del ítem' },
        externalSource: { 
          type: 'string',
          enum: ['Spotify', 'TMDB', 'IGDB', 'Google Books'],
          example: 'Spotify',
          description: 'Fuente externa del ítem'
        },
        avgRating: { type: 'number', minimum: 0, maximum: 100, example: 95, description: 'Calificación promedio', nullable: true },
        externalUrl: { type: 'string', format: 'uri', example: 'https://spotify.com/beatles', description: 'URL externa del ítem', nullable: true }
      }
    }
  };
  