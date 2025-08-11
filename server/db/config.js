// server/db/config.js
const { config } = require('./../config/config');
const fs = require('fs');
const path = require('path');

let sslConfigCli = {};

// Solo aplicamos la lógica SSL si estamos en entorno de producción
// (esto incluye tu máquina local si NODE_ENV=production, o Render)
if (config.isProd) {
    let caCert = null;

    // Intentar leer el certificado desde un archivo local (para migraciones locales a DB de producción)
    const caCertPath = path.join(__dirname, '..', 'ca.crt'); // Ajusta la ruta si ca.crt está en otro lugar

    if (fs.existsSync(caCertPath)) {
        caCert = fs.readFileSync(caCertPath, 'utf8');
        console.log('INFO: CA certificate loaded from file for Sequelize CLI.');
    } else {
        // Si no se encuentra el archivo en producción local, lanzar un error.
        // Esto es porque las migraciones a la DB de Aiven SIEMPRE requieren SSL.
        console.error('ERROR: CA certificate file (ca.crt) not found for production migrations at:', caCertPath);
        throw new Error('Database CA certificate file not found for production migrations. Cannot connect to PostgreSQL.');
    }

    sslConfigCli = {
        require: true, // Obligatorio usar SSL
        rejectUnauthorized: true, // Requerir que el certificado del servidor sea válido
        ca: caCert // Usar el certificado CA leído del archivo
    };
}

module.exports = {
    development: {
        url: config.db_url,
        dialect: 'postgres',
        // logging: true, // Opcional: habilitar logging para desarrollo
    },
    production: {
        url: config.db_url,
        dialect: 'postgres',
        // Incluye las opciones SSL si están configuradas para producción
        // Si sslConfigCli está vacío (ej. en desarrollo), no se añadirán estas opciones.
        ...(Object.keys(sslConfigCli).length > 0 && { dialectOptions: { ssl: sslConfigCli } }),
    },
};