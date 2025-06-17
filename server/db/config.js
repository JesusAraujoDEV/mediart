const { config } = require('./../config/config');
const fs = require('fs');

let sslOptions = {};
if (config.isProd) {
  try {
    const caCert = fs.readFileSync(__dirname + '/../ca.crt'); // Ajusta la ruta si es necesario.
                                                             // __dirname en db/config.js apunta a 'server/db/'.
                                                             // Necesitas ir a 'server/' para encontrar 'ca.crt'.
    sslOptions = {
      ssl: {
        require: true,
        rejectUnauthorized: true, // <--- CAMBIA ESTO A TRUE
        ca: caCert.toString()     // <--- AÑADE ESTA LÍNEA
      }
    };
    console.log('CA certificate loaded for sequelize-cli config.');
  } catch (error) {
    console.error('Error loading CA certificate for sequelize-cli config:', error);
  }
}


module.exports = {
    development: {
        url: config.db_url,
        dialect: 'postgres',
    },
    production: {
        url: config.db_url,
        dialect: 'postgres',
        ...sslOptions, // <--- USA SPREAD OPERATOR PARA AÑADIR LAS OPCIONES SSL
        // o manualmente:
        // dialectOptions: sslOptions.ssl ? sslOptions.ssl : undefined
    },
}