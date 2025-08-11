// server/swagger/components/schemas/auth_swagger_schema.js

module.exports = {
    LoginRequest: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email', example: 'usuario@example.com', description: 'Correo electrónico del usuario.' },
        password: { type: 'string', minLength: 8, example: 'MiClaveSegura123', description: 'Contraseña del usuario.' },
      },
    },
    RecoveryRequest: {
      type: 'object',
      required: ['email'],
      properties: {
        email: { type: 'string', format: 'email', example: 'usuario@example.com', description: 'Correo electrónico para recuperar contraseña.' },
      },
    },
    ChangePasswordRequest: {
      type: 'object',
      required: ['token', 'newPassword'],
      properties: {
        token: { 
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'Token JWT de recuperación de contraseña.'
        },
        newPassword: { 
          type: 'string', minLength: 8, example: 'NuevaClave1234', description: 'Nueva contraseña del usuario.' 
        },
      },
    },
    AuthResponse: {
      type: 'object',
      properties: {
        user: { 
          type: 'object',
          description: 'Datos del usuario autenticado (sin password).',
          example: {
            id: 1,
            email: 'usuario@example.com',
            username: 'usuario1',
            bio: 'Usuario de prueba',
            profilePictureUrl: null,
            createdAt: '2025-06-25T10:00:00.000Z',
            updatedAt: '2025-06-25T10:00:00.000Z',
          }
        },
        token: {
          type: 'string',
          description: 'Token JWT para autenticación.',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
    RecoveryResponse: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Si el correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña.'
        }
      }
    },
    ChangePasswordResponse: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Password changed!'
        }
      }
    }
  };
  