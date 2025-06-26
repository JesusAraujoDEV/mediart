// server/swagger/paths/search_paths.js

/**
 * @swagger
 * tags:
 *   - name: Search
 *     description: Búsqueda de contenido multimedia y usuarios

 * /api/search:
 *   get:
 *     summary: Buscar contenido multimedia
 *     description: Realiza una búsqueda en varias plataformas (TMDB, Spotify, IGDB, Google Books).
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda (ej. "Harry Potter")
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [movie, tvshow, song, artist, album, videogame, book, general]
 *           example: movie
 *         description: Filtro por tipo de contenido (opcional). Si se omite, busca en todas las fuentes.
 *     responses:
 *       200:
 *         description: Resultados de la búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movies:
 *                   type: array
 *                   items: { type: object }
 *                 tvshows:
 *                   type: array
 *                   items: { type: object }
 *                 songs:
 *                   type: array
 *                   items: { type: object }
 *                 artists:
 *                   type: array
 *                   items: { type: object }
 *                 albums:
 *                   type: array
 *                   items: { type: object }
 *                 books:
 *                   type: array
 *                   items: { type: object }
 *                 videogames:
 *                   type: array
 *                   items: { type: object }
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'

 * /api/search/users:
 *   get:
 *     summary: Buscar usuarios por nombre de usuario
 *     description: Busca usuarios cuyo nombre de usuario contenga el término indicado.
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda (ej. "juan")
 *     responses:
 *       200:
 *         description: Lista de usuarios coincidentes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
