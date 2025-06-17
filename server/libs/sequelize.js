const { Sequelize } = require('sequelize');
const { config } = require('./../config/config');
const { setupModels } = require('./../db/models');

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('config.isProd:', config.isProd);
console.log('config.db_url:', config.db_url);

const options = {
  dialect: 'postgres',
  logging: config.isProd ? false : true,
}

if(config.isProd) {
  // Carga el certificado CA de la variable de entorno
  const caCertEnv = process.env.POSTGRES_CA_CERT; // <-- LEE LA VARIABLE DE ENTORNO
  if (!caCertEnv) {
    console.error('ERROR: POSTGRES_CA_CERT environment variable is not set!');
    // Considera lanzar un error aquí si el certificado es crítico
    // throw new Error('Database CA certificate not found in environment variables.');
  }

  options.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca: caCertEnv.toString() // Usa el valor de la variable de entorno
    }
  }
}

console.log('Sequelize final options:', options);

const sequelize = new Sequelize(config.db_url, options);

setupModels(sequelize);

module.exports = sequelize;