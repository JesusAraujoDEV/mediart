// server/db/config.js
const { config } = require('./../config/config');
const fs = require('fs'); // Importa el módulo 'fs'
const path = require('path'); // Importa el módulo 'path'

let sslConfigCli = {};
if (config.isProd) {
  const caCertPath = path.join(__dirname, '..', 'ca.crt'); // Ajusta la ruta si ca.crt está en otro lugar
  // console.log('Path al certificado CA:', caCertPath); // Para depuración

  if (!fs.existsSync(caCertPath)) {
    console.error('ERROR: CA certificate file not found at:', caCertPath);
    throw new Error('Database CA certificate file not found for migrations. Cannot connect to PostgreSQL.');
  }
  const caCert = fs.readFileSync(caCertPath, 'utf8');

  sslConfigCli = {
    require: true,
    rejectUnauthorized: true,
    ca: caCert // Ahora lee del archivo
  };
}

module.exports = {
    development: {
        url: config.db_url,
        dialect: 'postgres',
    },
    production: {
        url: config.db_url,
        dialect: 'postgres',
        dialectOptions: { // ¡Asegúrate de que esto esté presente!
            ssl: sslConfigCli
        },
    },
}