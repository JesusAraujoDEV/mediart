// middlewares/rate_limit_handler.js
const rateLimit = require('express-rate-limit');

// Limitador general para rutas que consumen muchos recursos (ej. POST, DELETE, PATCH)
const generalWriteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 solicitudes por IP en el período
    message: 'Demasiadas solicitudes desde esta IP, por favor, inténtalo de nuevo más tarde.',
    headers: true, // Envía encabezados X-RateLimit-*
});

// Limitador más estricto para operaciones de borrado sensibles
const deleteUserLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos
    max: 20, // Límite de 20 solicitudes de borrado por IP en el período
    message: 'Demasiadas solicitudes de eliminación desde esta IP, por favor, inténtalo de nuevo más tarde.',
    headers: true,
});

// Limitador para intentos de inicio de sesión fallidos (ej. en auth routes)
const loginAttempLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 5, // Límite de 5 intentos por IP en el período
    message: 'Demasiados intentos de inicio de sesión fallidos desde esta IP, por favor, inténtalo de nuevo en unos minutos.',
    statusCode: 429, // Too Many Requests
    headers: true,
    // Puedes añadir un `handler` para personalizar la respuesta cuando se excede el límite
    handler: (req, res, next) => {
        res.status(429).json({
            statusCode: 429,
            message: 'Has excedido el límite de intentos de inicio de sesión. Por favor, espera.',
        });
    },
});


module.exports = {
    generalWriteLimiter,
    deleteUserLimiter,
    loginAttempLimiter,
    // Exporta cualquier otro limitador que definas
};