// server/libs/sequelize.js
const { Sequelize } = require('sequelize');
const { config } = require('./../config/config');
const { setupModels } = require('./../db/models');
const fs = require('fs');
const path = require('path');

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('config.isProd:', config.isProd);
console.log('config.db_url:', config.db_url);

const options = {
    dialect: 'postgres',
    logging: config.isProd ? false : true, // No loguear en producción
};

// En producción (Dokploy interno), desactivamos SSL
if (config.isProd) {
    options.dialectOptions = {
        ssl: false
    };
}

console.log('Sequelize final options:', options);

const sequelize = new Sequelize(config.db_url, options);

setupModels(sequelize);

module.exports = sequelize;