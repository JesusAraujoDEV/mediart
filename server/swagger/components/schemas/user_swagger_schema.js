// server/swagger/components/schemas/user_swagger_schema.js

module.exports = {
  User: {
    type: 'object',
    required: ['username', 'email'],
    properties: {
      id: { type: 'integer', format: 'int64', description: 'ID único del usuario.', readOnly: true },
      username: { type: 'string', description: 'Nombre de usuario único.', example: 'juanperez' },
      email: { type: 'string', format: 'email', description: 'Correo electrónico único del usuario.', example: 'juan.perez@example.com' },
      profilePictureUrl: { type: 'string', format: 'uri', nullable: true, description: 'URL de la foto de perfil del usuario.', example: '/uploads/profile_pictures/user-1-1678912345678.jpg' },
      bio: { type: 'string', nullable: true, description: 'Biografía del usuario.', example: 'Amante de la música y los videojuegos.' },
      createdAt: { type: 'string', format: 'date-time', description: 'Fecha y hora de creación del usuario.', readOnly: true },
      updatedAt: { type: 'string', format: 'date-time', description: 'Última fecha y hora de actualización del usuario.', readOnly: true },
    },
    example: {
      id: 1, username: 'testuser', email: 'test@example.com', profilePictureUrl: null,
      bio: 'Mi biografía de prueba.', createdAt: '2025-06-25T10:00:00.000Z', updatedAt: '2025-06-25T10:00:00.000Z'
    }
  },
  UserWithAssociations: {
    allOf: [
      { $ref: '#/components/schemas/User' },
      {
        type: 'object',
        properties: {
          ownedPlaylists: {
            type: 'array', description: 'Lista de playlists de las que el usuario es dueño.',
            items: { $ref: '#/components/schemas/Playlist' } // Necesitarás definir el schema de Playlist
          },
          savedPlaylists: {
            type: 'array', description: 'Lista de playlists guardadas por el usuario.',
            items: { $ref: '#/components/schemas/Playlist' }
          },
          followersUsers: {
            type: 'array', description: 'Lista de usuarios que siguen a este usuario.',
            items: { $ref: '#/components/schemas/User' }
          },
          followingUsers: {
            type: 'array', description: 'Lista de usuarios a los que este usuario sigue.',
            items: { $ref: '#/components/schemas/User' }
          },
          libraryEntries: {
            type: 'array', description: 'Entradas directas de la tabla intermedia Library.',
            items: { type: 'object', properties: { userId: { type: 'integer' }, playlistId: { type: 'integer' }, savedAt: { type: 'string', format: 'date-time' } } }
          },
          initiatedFollows: {
            type: 'array', description: 'Entradas directas de la tabla intermedia UserFollow (seguimientos iniciados).',
            items: { type: 'object', properties: { followerUserId: { type: 'integer' }, followedUserId: { type: 'integer' }, createdAt: { type: 'string', format: 'date-time' } } }
          },
          receivedFollows: {
            type: 'array', description: 'Entradas directas de la tabla intermedia UserFollow (seguimientos recibidos).',
            items: { type: 'object', properties: { followerUserId: { type: 'integer' }, followedUserId: { type: 'integer' }, createdAt: { type: 'string', format: 'date-time' } } }
          },
          collaboratorPlaylists: {
            type: 'array', description: 'Lista de playlists en las que el usuario es colaborador.',
            items: { $ref: '#/components/schemas/Playlist' }
          }
        }
      }
    ]
  },
  UserCreate: {
    type: 'object', required: ['username', 'email', 'passwordHash'],
    properties: {
      username: { type: 'string', minLength: 3, maxLength: 20, example: 'nuevo_usuario' },
      email: { type: 'string', format: 'email', example: 'nuevo@example.com' },
      passwordHash: { type: 'string', minLength: 8, example: 'MiSuperClaveSegura123' },
      bio: { type: 'string', nullable: true, maxLength: 600, example: 'Apasionado por la tecnología.' }
    }
  },
  UserUpdate: {
    type: 'object',
    properties: {
      username: { type: 'string', minLength: 3, maxLength: 20, example: 'usuario_actualizado' },
      email: { type: 'string', format: 'email', example: 'actualizado@example.com' },
      passwordHash: { type: 'string', minLength: 8, example: 'NuevaClaveSegura456' },
      bio: { type: 'string', nullable: true, maxLength: 600, example: 'Mi biografía actualizada.' }
    }
  },
  UserProfile: {
    type: 'object',
    required: ['username', 'email'],
    properties: {
      id: { type: 'integer', format: 'int64', description: 'ID único del usuario.', readOnly: true },
      username: { type: 'string', description: 'Nombre de usuario único.', example: 'juanperez' },
      email: { type: 'string', format: 'email', description: 'Correo electrónico único del usuario.', example: 'juan.perez@example.com' },
      profilePictureUrl: { type: 'string', format: 'uri', nullable: true, description: 'URL de la foto de perfil del usuario.', example: '/uploads/profile_pictures/user-1-1678912345678.jpg' },
      bio: { type: 'string', nullable: true, description: 'Biografía del usuario.', example: 'Amante de la música y los videojuegos.' },
      createdAt: { type: 'string', format: 'date-time', description: 'Fecha y hora de creación del usuario.', readOnly: true },
      updatedAt: { type: 'string', format: 'date-time', description: 'Última fecha y hora de actualización del usuario.', readOnly: true },
    },
    example: {
      id: 1, username: 'testuser', email: 'test@example.com', profilePictureUrl: null,
      bio: 'Mi biografía de prueba.', createdAt: '2025-06-25T10:00:00.000Z', updatedAt: '2025-06-25T10:00:00.000Z'
    }
  },
  UserBasic: {
    type: 'object',
    properties: {
      id: { type: 'integer', description: 'ID del usuario.' },
      username: { type: 'string', description: 'Nombre de usuario.' },
      profilePictureUrl: { type: 'string', format: 'uri', nullable: true, description: 'URL de la foto de perfil.' }
    },
    example: {
      id: 1, username: 'juanperez', profilePictureUrl: '/uploads/profile_pictures/user-1.jpg'
    }
  },
};