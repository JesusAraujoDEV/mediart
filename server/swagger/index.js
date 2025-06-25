// server/swagger/index.js

const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

// Importa las definiciones de tags
const tags = require('./tags');
// Importa el index de schemas
const allSchemas = require('./components/schemas');
// Importa las respuestas comunes
const commonResponses = require('./components/responses');
// NO IMPORTAMOS allPaths aquí, porque swagger-jsdoc los escaneará con 'apis'

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'MediaRT API',
      version: '1.0.0',
      description: 'Documentación de la API de MediArt, una plataforma para gestionar y compartir contenido multimedia (playlists de películas, series, libros, etc.).',
      contact: {
        name: 'Tu Nombre/Equipo',
        url: 'https://github.com/tu_usuario',
        email: 'tu_email@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo Local',
      },
    ],
    tags: tags,
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
    // No definimos 'paths' aquí directamente, ya que swagger-jsdoc los buscará en 'apis'
    // paths: {
    //   ...allPaths, // <--- ESTO SE ELIMINA O COMENTA
    // },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // ¡CAMBIO CRUCIAL AQUÍ! Le decimos a swagger-jsdoc dónde buscar los JSDoc de las rutas
  apis: [path.join(__dirname, './paths/**/*.js')],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = setupSwagger;