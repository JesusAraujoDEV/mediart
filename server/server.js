// Cargar variables de entorno al inicio
require('dotenv').config();

// --- Módulos Principales y Configuración ---
const express = require('express');
const cors = require('cors');
const path = require('path');
const { config } = require('./config/config'); // Importamos la configuración

// --- Importación de Rutas y Middlewares ---
const routerApi = require('./routes'); // Asume que 'routes/index.js' exporta una función que configura las rutas
const { logErrors, errorHandler, ormErrorHandler, boomErrorHandler } = require('./middlewares/error_handler');
const setupSwagger = require('./swagger'); // Asume que este archivo configura la documentación Swagger

// --- Inicializar la Aplicación Express ---
const app = express();
const port = config.port || 3000; // Define el puerto de la aplicación, usando el de config o 3000 por defecto

// --- Configuración de CORS ---
// Lista de orígenes permitidos (frontend, backend, localhost para desarrollo)
const whitelist = config.corsWhitelist;
const corsOptions = {
    origin: (origin, callback) => {
        // Permitir solicitudes sin origen (como aplicaciones móviles o peticiones curl)
        // o si el origen está en la lista blanca.
        if (whitelist.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS')); // Bloquear la solicitud si el origen no está en la whitelist
        }
    }
};
app.use(cors(corsOptions)); // Aplica la configuración de CORS a la aplicación

// --- Middlewares Globales ---
// Habilitar el parseo de cuerpos de solicitud en formato JSON
app.use(express.json());

// Configuración de autenticación (asume que este archivo configura estrategias de Passport.js o similar)
require('./utils/auth');

// Servir archivos estáticos desde el directorio 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Definición de Rutas ---
// Rutas básicas (pueden servir como "health checks" o rutas informativas)
app.get('/', (req, res) => {
    res.send('¡Bienvenido al Backend de Mediart!');
});

app.get('/api', (req, res) => {
    res.send('Estado de la API de Mediart: OK');
});

// Rutas de la API (modularizadas y/o versionadas)
// Esta función adjunta todas tus rutas API a la aplicación Express
routerApi(app);

// Configurar la documentación de la API con Swagger UI
setupSwagger(app);

// --- Middlewares de Manejo de Errores ---
// Es CRUCIAL que estos middlewares se definan al final,
// después de todas las demás llamadas a app.use() y rutas,
// para que puedan capturar los errores de toda la aplicación.
app.use(logErrors);      // Para loguear los errores
app.use(ormErrorHandler); // Para manejar errores específicos del ORM (ej. Sequelize)
app.use(boomErrorHandler); // Para manejar errores generados con la librería Boom (errores HTTP amigables)
app.use(errorHandler);    // El manejador de errores final y general

// --- Iniciar el Servidor ---
app.listen(port, () => {
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`config.isProd: ${config.isProd}`);
    console.log(`config.db_url: ${config.db_url}`);
    console.log(`Servidor escuchando en http://localhost:${port}`);
});