const { Sequelize } = require('sequelize');
const { config } = require('./../config/config');
const { setupModels } = require('./../db/models');
const fs = require('fs');

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('config.isProd:', config.isProd);
console.log('config.db_url:', config.db_url);

const options = {
  dialect: 'postgres',
  logging: config.isProd ? false : true,
}

if(config.isProd) {
  // Carga el certificado CA
  let caCert;
  try {
    caCert = fs.readFileSync(__dirname + '/../ca.crt');
    console.log('CA certificate loaded successfully.');
  } catch (error) {
    console.error('Error loading CA certificate:', error);
  }

  options.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca: caCert.toString()
    }
  }
}

console.log('Sequelize final options:', options);

const sequelize = new Sequelize(config.db_url, options);

setupModels(sequelize);

module.exports = sequelize;