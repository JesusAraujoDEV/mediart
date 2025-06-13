require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3000,
  isProd: process.env.NODE_ENV === 'production',
  db_url: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  // PostgreSQL Configuration
  postgres: {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB,
    port: process.env.POSTGRES_PORT || 5432,
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
  } */
}

module.exports = { config };
