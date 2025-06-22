const { config } = require('./../config/config');

let sslConfigCli = {};
if (config.isProd) {
  const caCertEnv = process.env.POSTGRES_CA_CERT;
  if (!caCertEnv) {
    console.error('ERROR: POSTGRES_CA_CERT environment variable is not set for sequelize-cli config!');
    throw new Error('Database CA certificate not found for migrations. Cannot connect to PostgreSQL.');
  }
  sslConfigCli = {
    // Estas son las opciones SSL para el dialectOptions
    require: true,
    rejectUnauthorized: true, // ¡Tal como lo indica Aiven!
    ca: caCertEnv // El certificado CA completo como string
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
    },
}