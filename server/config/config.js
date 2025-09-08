require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3000,
  isProd: process.env.NODE_ENV === 'production',
  db_url: process.env.POSTGRES_DB_URL,
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  clientUrl: process.env.CLIENT_URL,
  backendUrl: process.env.BACKEND_URL,
  noReplyEmail: process.env.NO_REPLY_EMAIL,
  emailAppPassword: process.env.EMAIL_APP_PASSWORD,
  corsWhitelist: process.env.CORS_WHITELIST ? process.env.CORS_WHITELIST.split(',') : ['http://localhost:3000'],

  // PostgreSQL Configuration
  postgres: {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB,
    port: process.env.POSTGRES_PORT || 5432,
  },

  // Configuración para el envío de correos
  mail: {
    passwordApp: process.env.PASSWORD_APP,
    emailTesting: process.env.EMAIL_TESTING,
  },

  // Claves de API
  apiKeys: {
    tmdb: process.env.TMDB_API_KEY,
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    googleBooks: process.env.GOOGLE_BOOKS_API_KEY,
    igdbClientId: process.env.VIDEOGAMES_CLIENT_ID,
    igdbClientSecret: process.env.VIDEOGAMES_CLIENT_SECRET,
    rawgApiKey: process.env.RAWG_API_KEY,
    googleGemini: process.env.GOOGLE_GEMINI_API_KEY,
    googleGemini2: process.env.GOOGLE_GEMINI_2_API_KEY,
    googleGemini3: process.env.GOOGLE_GEMINI_3_API_KEY,
    deepseek: process.env.DEEPSEEK_API_KEY,
    imgbbApiKey: process.env.IMGBB_API_KEY,
    rawgApiKey: process.env.RAWG_API_KEY,
  },

/*
  // MySQL Configuration
  mysql: {
    user: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWORD,
    host: process.env.MYSQL_DB_HOST || 'localhost',
    database: process.env.MYSQL_DB_DATABASE,
    port: process.env.MYSQL_DB_PORT || 3306,
  },

  // PgAdmin Configuration
  pgadmin: {
    email: process.env.PGADMIN_EMAIL,
    password: process.env.PGADMIN_PASSWORD,
  }
*/
};

module.exports = { config };