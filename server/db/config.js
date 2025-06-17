const { config } = require('./../config/config');

let sslOptions = {};
if (config.isProd) {
  const caCertEnv = process.env.POSTGRES_CA_CERT; // <-- LEE LA VARIABLE DE ENTORNO
  if (!caCertEnv) {
    console.error('ERROR: POSTGRES_CA_CERT environment variable is not set for sequelize-cli config!');
    // Opcional: throw new Error('Database CA certificate not found for migrations.');
  }
  sslOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca: caCertEnv.toString() // Usa el valor de la variable de entorno
    }
  };
  console.log('CA certificate loaded from environment for sequelize-cli config.');
}


module.exports = {
    development: {
        url: config.db_url,
        dialect: 'postgres',
    },
    production: {
        url: config.db_url,
        dialect: 'postgres',
        ...sslOptions,
    },
}