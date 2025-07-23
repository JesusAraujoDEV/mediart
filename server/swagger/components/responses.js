// server/swagger/components/responses.js

module.exports = {
    UnauthorizedError: {
      description: 'No autorizado. Se requiere un token de autenticación válido.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 401 },
              error: { type: 'string', example: 'Unauthorized' },
              message: { type: 'string', example: 'Unauthorized' }
            }
          }
        }
      }
    },
    BadRequest: {
      description: 'Solicitud inválida. Faltan parámetros o son incorrectos.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 400 },
              error: { type: 'string', example: 'Bad Request' },
              message: { type: 'string', example: '"username" is required' },
              details: { type: 'array', items: { type: 'object' } }
            }
          }
        }
      }
    },
    NotFound: {
      description: 'Recurso no encontrado.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 404 },
              error: { type: 'string', example: 'Not Found' },
              message: { type: 'string', example: 'User not found' }
            }
          }
        }
      }
    },
    ForbiddenError: {
      description: 'Prohibido. No tienes permiso para realizar esta acción.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 403 },
              error: { type: 'string', example: 'Forbidden' },
              message: { type: 'string', example: 'You can only update your own profile.' }
            }
          }
        }
      }
    },
    InternalServerError: {
      description: 'Error interno del servidor.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 500 },
              error: { type: 'string', example: 'Internal Server Error' },
              message: { type: 'string', example: 'Something went wrong' }
            }
          }
        }
      }
    },
  };