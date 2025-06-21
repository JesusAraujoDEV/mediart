// server/libs/sequelize.js
const { Sequelize } = require('sequelize');
const { config } = require('./../config/config');
const { setupModels } = require('./../db/models');
const fs = require('fs'); // Importa el módulo 'fs'
const path = require('path'); // Importa el módulo 'path'

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('config.isProd:', config.isProd);
console.log('config.db_url:', config.db_url);

let sslConfig = {};
if (config.isProd) {
  const caCertPath = path.join(__dirname, '..', 'ca.crt'); // Ajusta la ruta
  // console.log('Path al certificado CA en libs:', caCertPath); // Para depuración

  if (!fs.existsSync(caCertPath)) {
    console.error('ERROR: CA certificate file not found at:', caCertPath);
    throw new Error('Database CA certificate file not found. Cannot connect to PostgreSQL.');
  }
  const caCert = fs.readFileSync(caCertPath, 'utf8');

  sslConfig = {
    require: true,
    rejectUnauthorized: true,
    ca: caCert
  };
}

const options = {
  dialect: 'postgres',
  logging: config.isProd ? false : true,
  // Solo añade las opciones SSL si estás en producción
  ...(config.isProd && { dialectOptions: { ssl: sslConfig } }) // Agregado aquí
};

console.log('Sequelize final options:', options);

const sequelize = new Sequelize(config.db_url, options);

setupModels(sequelize);

module.exports = sequelize;