// auth_handler.js
const boom = require('@hapi/boom');
const { config } = require('./../config/config');
const { models } = require('./../libs/sequelize');

function checkApiKey(req, res, next) {
    const apiKey = req.headers['api'];
    if(apiKey === config.apiKey){
        next();
    }else {
        next(boom.unauthorized());
    }
}

function checkAdminRole(req, res, next){
    console.log(req.user);
    const user = req.user;
    if (user.role === 'admin') {
        next();
    }
    else {
        next(boom.unauthorized());
    }
}

function checkRoles(...roles){
    return (req, res, next) => {
        console.log(roles);
        const user = req.user;
        if (roles.includes(user.role)) {
            next();
        }
        else {
            next(boom.unauthorized());
        }
    }
}

async function checkPlaylistOwnershipOrCollaboration(req, res, next) {
    try {
        const { playlistId } = req.params;
        const userId = req.user.sub;

        if (!playlistId || !userId) {
            // Esto es más una falla interna del middleware/ruta si falta,
            // pero es una buena verificación de seguridad.
            return next(boom.badImplementation('Missing playlistId or userId for authorization check.'));
        }

        const playlist = await models.Playlist.findByPk(playlistId);

        if (!playlist) {
            return next(boom.notFound('Playlist not found'));
        }

        // Verificar si el usuario es el dueño
        const isOwner = playlist.ownerUserId === userId;

        // Verificar si el usuario es un colaborador
        let isCollaborator = false;
        if (!isOwner) { // Solo si no es el dueño, verificamos si es colaborador
            const libraryEntry = await models.Library.findOne({
                where: {
                    playlistId: playlistId,
                    userId: userId,
                    isCollaborator: true
                }
            });
            isCollaborator = !!libraryEntry;
        }

        // Si no es el dueño y tampoco es un colaborador, denegar el acceso
        if (!isOwner && !isCollaborator) {
            return next(boom.forbidden('You do not have permission to perform this action on this playlist. Only the owner or a designated collaborator can perform this action.'));
        }

        // Adjuntar la playlist al objeto req para que las rutas posteriores no tengan que buscarla de nuevo
        req.playlist = playlist; 

        next(); // Permitir que la petición continúe a la siguiente función (la lógica de la ruta)

    } catch (error) {
        // En caso de cualquier error inesperado en la base de datos o lógica.
        console.error('Error in checkPlaylistOwnershipOrCollaboration middleware:', error);
        next(boom.internal('An error occurred during permission check.', error));
    }
}

module.exports = {
    checkApiKey,
    checkAdminRole,
    checkRoles,
    checkPlaylistOwnershipOrCollaboration // ¡Exporta el nuevo middleware!
}