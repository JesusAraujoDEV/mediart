// middlewares/auth_handler.js
const boom = require('@hapi/boom');
const { config } = require('./../config/config');
const { models } = require('./../libs/sequelize'); // Asumiendo que es necesario para otros middlewares
const passport = require('passport');

function checkMasterApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    
    console.log('API Key recibida:', apiKey);
    console.log('API Key configurada:', config.apiKey);
    console.log('¿Coinciden las API Keys?', apiKey === config.apiKey);

    if (config.apiKey && apiKey === config.apiKey) {
        console.log('✅ Master API Key MATCHEADA. Se otorga acceso directo.');
        req.user = {
            id: null, // Puedes usar un ID ficticio como 0 o -1 si lo necesitas
            sub: null, // Sub nulo para indicar que no es un usuario JWT real
        };
        console.log('req.user después de checkMasterApiKey:', req.user); // Confirma el objeto
        return next(); // ¡Acceso concedido si la API Key es válida!
    } else {
        console.log('❌ Master API Key NO MATCHEADA o no presente. Pasando a autenticación JWT.');
        return next(); // Continúa al siguiente middleware (passport.authenticate)
    }
}

// Estos middlewares de rol ya NO serían usados en las rutas protegidas por la API Key,
// pero los mantienes si los usas para otros endpoints con JWT normal.
function checkAdminRole(req, res, next){
    const user = req.user;
    if (!user) {
        return next(boom.unauthorized('Authentication required.'));
    }
    // Si tu usuario no tiene 'role', esta condición siempre será falsa para usuarios JWT.
    // Solo funcionaría si el JWT Token REALMENTE incluye un campo 'role'.
    if (user.role === 'admin') { // Si no hay roles, este middleware es innecesario.
        next();
    }
    else {
        next(boom.forbidden('Access denied. Admin role required.'));
    }
}

function checkRoles(...roles){
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return next(boom.unauthorized('Authentication required.'));
        }
        // Si no hay roles en tu modelo de usuario/JWT, este middleware no será útil.
        if (roles.includes(user.role)) { // Si no hay roles, este middleware es innecesario.
            next();
        }
        else {
            next(boom.forbidden('Access denied. Insufficient role.'));
        }
    }
}

async function checkPlaylistOwnershipOrCollaboration(req, res, next) {
    try {
        // Aquí es donde necesitamos un ajuste crucial.
        // Si req.user.sub === null (el usuario ficticio de API Key), entonces permitimos el acceso.
        if (req.user && req.user.sub === null) {
            return next(); // El usuario de la API Key tiene acceso total
        }

        const { playlistId } = req.params;
        const userId = req.user.sub; // ID del usuario real autenticado por JWT

        if (!playlistId || !userId) {
            return next(boom.badImplementation('Missing playlistId or userId for authorization check.'));
        }

        const playlist = await models.Playlist.findByPk(playlistId);

        if (!playlist) {
            return next(boom.notFound('Playlist not found'));
        }

        const isOwner = playlist.ownerUserId === userId;

        let isCollaborator = false;
        if (!isOwner) {
            const libraryEntry = await models.Library.findOne({
                where: {
                    playlistId: playlistId,
                    userId: userId,
                    isCollaborator: true
                }
            });
            isCollaborator = !!libraryEntry;
        }

        if (!isOwner && !isCollaborator) {
            return next(boom.forbidden('You do not have permission to perform this action on this playlist. Only the owner or a designated collaborator can perform this action.'));
        }

        req.playlist = playlist; 
        next();

    } catch (error) {
        console.error('Error in checkPlaylistOwnershipOrCollaboration middleware:', error);
        next(boom.internal('An error occurred during permission check.', error));
    }
}

// Nuevo middleware para autenticar con JWT SOLO si checkMasterApiKey no seteo req.user
const authenticateIfNoApiKey = (req, res, next) => {
    // Si req.user ya está establecido por checkMasterApiKey (con { id: null, sub: null }),
    // simplemente pasamos al siguiente middleware sin intentar autenticar con JWT.
    if (req.user && req.user.sub === null) { // req.user.sub === null es nuestra señal de Master API Key
        console.log('API Key detectada, saltando autenticación JWT.');
        return next();
    }
    // Si req.user NO está establecido, o es un objeto de usuario "real" (por ejemplo, en un flujo de Passport donde ya se autenticó previamente),
    // entonces procedemos con la autenticación JWT.
    console.log('No se detectó API Key o req.user no es el de API Key. Intentando autenticación JWT.');
    passport.authenticate('jwt', { session: false })(req, res, next);
};


module.exports = {
    checkMasterApiKey,
    checkAdminRole, // Lo dejas si lo usas en otras rutas con JWT que sí tengan rol
    checkRoles, // Lo dejas si lo usas en otras rutas con JWT que sí tengan rol
    checkPlaylistOwnershipOrCollaboration,
    authenticateIfNoApiKey
};