// server/libs/sequelize.js
const { Sequelize } = require('sequelize');
const { config } = require('./../config/config');
const { setupModels } = require('./../db/models');

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('config.isProd:', config.isProd);
console.log('config.db_url:', config.db_url);

let sslConfig = {};
if (config.isProd) {
  const caCertEnv = process.env.POSTGRES_CA_CERT;
  if (!caCertEnv) {
    console.error('ERROR: POSTGRES_CA_CERT environment variable is not set!');
    throw new Error('Database CA certificate not found in environment variables. Cannot connect to PostgreSQL.');
  }

  sslConfig = {
    // Estas son las opciones SSL para el dialectOptions
    require: true,
    rejectUnauthorized: true, // ¡Tal como lo indica Aiven!
    ca: caCertEnv // El certificado CA completo como string
  };
}

const options = {
  dialect: 'postgres',
  logging: config.isProd ? false : true,
  // Pasar todas las opciones SSL a dialectOptions
  dialectOptions: {
    ssl: sslConfig
  }
};

console.log('Sequelize final options:', options);

// Crea la instancia de Sequelize. Usa la URL de DB con las opciones dialectOptions.
// Nota: Cuando pasas un objeto de opciones completo, no siempre es necesario el sslmode en la URL.
// Sin embargo, Render está pasando la URL completa, así que la mantenemos.
const sequelize = new Sequelize(config.db_url, options);

setupModels(sequelize);

module.exports = sequelize;