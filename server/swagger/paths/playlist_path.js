/**
 * @swagger
 * tags:
 *   name: Playlist
 *   description: Endpoints relacionados con la gestión de playlists
 */

/**
 * @swagger
 * /api/playlists:
 *   get:
 *     summary: Obtener todas las playlists
 *     tags: [Playlist]
 *     responses:
 *       200:
 *         description: Lista de playlists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PlaylistResponse'
 *   post:
 *     summary: Crear una nueva playlist
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/CreatePlaylistRequest'
 *     responses:
 *       201:
 *         description: Playlist creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistResponse'
 */

/**
 * @swagger
 * /api/playlists/{playlistId}:
 *   get:
 *     summary: Obtener una playlist por su ID
 *     tags: [Playlist]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de la playlist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistResponse'
 *   patch:
 *     summary: Actualizar una playlist existente
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePlaylistRequest'
 *     responses:
 *       200:
 *         description: Playlist actualizada correctamente
 *   delete:
 *     summary: Eliminar una playlist
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Playlist eliminada correctamente
 */

/**
 * @swagger
 * /api/playlists/{playlistId}/items:
 *   post:
 *     summary: Agregar ítems a una playlist
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         description: ID de la playlist
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddItemsToPlaylistRequest'
 *     responses:
 *       201:
 *         description: Ítems agregados correctamente
 */

/**
 * @swagger
 * /api/playlists/{playlistId}/items/{itemId}:
 *   delete:
 *     summary: Eliminar un ítem de una playlist
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ítem eliminado correctamente
 */

/**
 * @swagger
 * /api/playlists/{playlistId}/collaborators:
 *   post:
 *     summary: Agregar uno o más colaboradores a una playlist
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         description: ID de la playlist
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddCollaboratorsRequest'
 *     responses:
 *       200:
 *         description: Colaboradores agregados correctamente
 */
