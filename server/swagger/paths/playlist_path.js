/**
 * @swagger
 * tags:
 *   - name: Playlists
 *     description: Endpoints relacionados con listas de reproducción
 *
 * /api/playlists:
 *   get:
 *     summary: Obtener todas las playlists
 *     tags: [Playlists]
 *     responses:
 *       200:
 *         description: Lista de playlists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Playlist'
 *
 *   post:
 *     summary: Crear una nueva playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isCollaborative:
 *                 type: boolean
 *               playlistCover:
 *                 type: string
 *                 format: binary
 *               playlistCoverUrl:
 *                 type: string
 *                 description: URL remota o vacía para eliminar
 *     responses:
 *       201:
 *         description: Playlist creada exitosamente
 *
 * /api/playlists/{playlistId}:
 *   get:
 *     summary: Obtener una playlist por ID
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Playlist encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playlist'
 *
 *   patch:
 *     summary: Actualizar una playlist
 *     tags: [Playlists]
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isCollaborative:
 *                 type: boolean
 *               playlistCover:
 *                 type: string
 *                 format: binary
 *               playlistCoverUrl:
 *                 type: string
 *                 example: ""
 *                 description: URL remota o cadena vacía para eliminar
 *     responses:
 *       200:
 *         description: Playlist actualizada
 *
 *   delete:
 *     summary: Eliminar una playlist
 *     tags: [Playlists]
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
 *         description: Playlist eliminada
 *
 * /api/playlists/{playlistId}/items:
 *   post:
 *     summary: Añadir ítems a una playlist
 *     tags: [Playlists]
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
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   itemIds:
 *                     type: array
 *                     items:
 *                       type: integer
 *               - type: object
 *                 properties:
 *                   items:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: Ítems añadidos
 *
 * /api/playlists/{playlistId}/items/{itemId}:
 *   delete:
 *     summary: Eliminar un ítem de una playlist
 *     tags: [Playlists]
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
 *         description: Ítem eliminado
 *
 * /api/playlists/{playlistId}/collaborators:
 *   post:
 *     summary: Agregar colaboradores a una playlist
 *     tags: [Playlists]
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
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *               - type: object
 *                 properties:
 *                   userIds:
 *                     type: array
 *                     items:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Colaboradores añadidos
 *
 * /api/playlists/{playlistId}/collaborators/remove:
 *   patch:
 *     summary: Eliminar colaboradores de una playlist
 *     tags: [Playlists]
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
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *               - type: object
 *                 properties:
 *                   userIds:
 *                     type: array
 *                     items:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Colaboradores eliminados
 */
