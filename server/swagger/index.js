// server/swagger/index.js

const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const {config} = require('./../config/config');

// Importa las definiciones de tags

// Importa el index de schemas
const allSchemas = require('./components/schemas');
// Importa las respuestas comunes
const commonResponses = require('./components/responses');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'MediaRT API',
      version: '1.0.0',
      description: 'Documentación de la API de MediArt, una plataforma para gestionar y compartir contenido multimedia (playlists de películas, series, libros, etc.).',
      contact: {
        name: 'Tu Nombre/Equipo',
        url: config.clientUrl, // Puedes dejar esta URL del cliente si no es la del backend de Swagger
        email: 'chamitolol777@gmail.com',
      },
    },
    servers: [
      {
        url: config.backendUrl || 'http://localhost:3000', // Fallback a localhost si no está definida
        description: 'Servidor API Principal',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ...allSchemas,
      },
      responses: {
        ...commonResponses,
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    path.join(__dirname, './paths/**/*.js'),
  ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = setupSwagger;