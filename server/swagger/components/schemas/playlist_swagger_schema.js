module.exports = {
    PlaylistItem: {
      type: 'object',
      required: ['type', 'externalSource', 'title', 'externalId'],
      properties: {
        type: {
          type: 'string',
          enum: ['movie', 'tvshow', 'book', 'song', 'artist', 'album', 'videogame'],
          example: 'movie',
          description: 'Tipo de contenido de la playlist.'
        },
        externalSource: {
          type: 'string',
          example: 'TMDB',
          description: 'Fuente externa del ítem.'
        },
        title: {
          type: 'string',
          example: 'Inception',
          description: 'Título del ítem.'
        },
        description: {
          type: 'string',
          nullable: true,
          example: 'Una película de ciencia ficción.',
        },
        coverUrl: {
          type: 'string',
          format: 'uri',
          nullable: true,
          example: 'https://image.tmdb.org/inception.jpg'
        },
        releaseDate: {
          type: 'string',
          example: '2010-07-16'
        },
        externalId: {
          type: 'string',
          example: '123abc456'
        },
        avgRating: {
          type: 'number',
          nullable: true,
          example: 8.7
        },
        externalUrl: {
          type: 'string',
          format: 'uri',
          nullable: true,
          example: 'https://tmdb.org/movie/inception'
        }
      }
    },
  
    CreatePlaylistRequest: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', example: 'Mi Playlist de Películas' },
        description: { type: 'string', nullable: true, example: 'Ciencia ficción y más.' },
        isCollaborative: { type: 'boolean', example: false },
        thumbnailUrl: { type: 'string', nullable: true, example: '/uploads/playlist_pictures/abc.jpg' },
        items: {
          type: 'array',
          items: { $ref: '#/components/schemas/PlaylistItem' }
        }
      }
    },
  
    UpdatePlaylistRequest: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Nuevo nombre para la playlist' },
        description: { type: 'string', nullable: true, example: 'Descripción actualizada' },
        isCollaborative: { type: 'boolean', example: true },
        thumbnailUrl: { type: 'string', nullable: true, example: '/uploads/playlist_pictures/nueva.jpg' }
      }
    },
  
    AddItemsToPlaylistRequest: {
      type: 'object',
      oneOf: [
        {
          required: ['itemIds'],
          properties: {
            itemIds: {
              type: 'array',
              items: { type: 'integer', example: 1 }
            }
          }
        },
        {
          required: ['items'],
          properties: {
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/PlaylistItem' }
            }
          }
        }
      ]
    },
  
    AddCollaboratorsRequest: {
      type: 'object',
      properties: {
        userId: { type: 'integer', example: 4 },
        userIds: {
          type: 'array',
          items: { type: 'integer', example: 5 }
        }
      }
    },
  
    PlaylistResponse: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        name: { type: 'string', example: 'Películas Épicas' },
        description: { type: 'string', example: 'Mis películas favoritas.' },
        isCollaborative: { type: 'boolean', example: true },
        thumbnailUrl: { type: 'string', example: '/uploads/playlist_pictures/imagen.jpg' },
        createdAt: { type: 'string', format: 'date-time', example: '2025-06-25T10:00:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2025-06-26T11:00:00.000Z' },
        owner: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'usuario1' }
          }
        },
        items: {
          type: 'array',
          items: { $ref: '#/components/schemas/PlaylistItem' }
        }
      }
    }
  };
  