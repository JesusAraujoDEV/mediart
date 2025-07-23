// server/swagger/components/schemas/recommendation_swagger_schema.js

module.exports = {
    RecommendationRequest: {
      type: 'object',
      properties: {
        itemName: {
          type: 'string',
          minLength: 1,
          example: 'Interstellar',
          description: 'Nombre del ítem base a partir del cual se generan recomendaciones',
        },
      },
      required: ['itemName'],
    },
  
    RecommendedItem: {
      type: 'object',
      description: 'Formato unificado de ítems recomendados desde distintas fuentes',
      properties: {
        type: {
          type: 'string',
          enum: ['movie', 'tvshow', 'song', 'artist', 'album', 'book', 'videogame'],
          description: 'Tipo de contenido',
          example: 'movie',
        },
        externalSource: {
          type: 'string',
          example: 'TMDB',
          description: 'Fuente externa desde donde se obtuvo la recomendación',
        },
        title: {
          type: 'string',
          description: 'Título del ítem',
          example: 'Inception',
        },
        description: {
          type: 'string',
          description: 'Breve descripción del ítem',
          example: 'A mind-bending thriller about dream invasion.',
        },
        coverUrl: {
          type: 'string',
          format: 'uri',
          description: 'URL de la portada o imagen del ítem',
          example: 'https://image.tmdb.org/t/p/original/abc123.jpg',
        },
        releaseDate: {
          type: 'string',
          format: 'date',
          description: 'Fecha de lanzamiento',
          example: '2010-07-16',
        },
        externalId: {
          type: 'string',
          description: 'ID de referencia externa',
          example: '123456',
        },
        avgRating: {
          type: 'number',
          description: 'Promedio de calificación (si aplica)',
          example: 8.7,
        },
        externalUrl: {
          type: 'string',
          format: 'uri',
          description: 'Enlace externo al ítem',
          example: 'https://www.themoviedb.org/movie/123456',
        },
      },
    },
  
    RecommendationResponse: {
      type: 'object',
      description: 'Respuesta general de recomendaciones para un tipo específico',
      additionalProperties: {
        type: 'array',
        items: { $ref: '#/components/schemas/RecommendedItem' },
      },
      example: {
        movies: [
          {
            type: 'movie',
            externalSource: 'TMDB',
            title: 'Inception',
            description: 'A mind-bending thriller...',
            coverUrl: 'https://image.tmdb.org/t/p/original/inception.jpg',
            releaseDate: '2010-07-16',
            externalId: '123456',
            avgRating: 8.8,
            externalUrl: 'https://www.themoviedb.org/movie/123456',
          },
        ],
      },
    },
  };
  