/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Endpoints relacionados con el perfil del usuario autenticado
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Obtener datos del usuario actual
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *
 * /api/profile/owned-playlists:
 *   get:
 *     summary: Listar playlists creadas por el usuario
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de playlists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Playlist'
 *
 * /api/profile/saved-playlists:
 *   get:
 *     summary: Listar playlists guardadas por el usuario
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de playlists guardadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Playlist'
 *
 * /api/profile/saved-playlists/{id}:
 *   post:
 *     summary: Guardar una playlist en el perfil del usuario
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la playlist
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Playlist guardada correctamente
 *
 *   delete:
 *     summary: Eliminar una playlist guardada
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la playlist
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Playlist eliminada de las guardadas
 *
 * /api/profile/my-followers:
 *   get:
 *     summary: Obtener lista de seguidores
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios seguidores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserBasic'
 *
 * /api/profile/my-followings:
 *   get:
 *     summary: Obtener lista de seguidos
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios seguidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserBasic'
 *
 * /api/profile/follow/{followedId}:
 *   post:
 *     summary: Seguir a un usuario
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: followedId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Usuario seguido exitosamente
 *
 *   delete:
 *     summary: Dejar de seguir a un usuario
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: followedId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario dejado de seguir
 */
