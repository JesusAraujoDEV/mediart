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
  options.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
}

// Mueve este console.log aquí, después de que 'options' esté completamente configurada
console.log('Sequelize final options:', options);

const sequelize = new Sequelize(config.db_url, options);

setupModels(sequelize);

module.exports = sequelize;