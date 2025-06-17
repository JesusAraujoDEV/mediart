const { Sequelize } = require('sequelize');
const { config } = require('./../config/config');
const { setupModels } = require('./../db/models');

console.log('NODE_ENV:', process.env.NODE_ENV); // <-- Añade esto
console.log('config.isProd:', config.isProd); // <-- Añade esto
console.log('config.db_url:', config.db_url); // <-- Añade esto
console.log('Sequelize options:', options); // <-- Añade esto

const options = {
  dialect: 'postgres',
  logging: config.isProd ? false : true,
}

if(config.isProd) {
  options.dialectOptions = {
    ssl: {
      rejectUnauthorized: false
    }
  }
}

const sequelize = new Sequelize(config.db_url, options);

setupModels(sequelize);

module.exports = sequelize;