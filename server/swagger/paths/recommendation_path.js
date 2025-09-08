/**
 * @swagger
 * tags:
 *   - name: Recommendations
 *     description: Rutas para obtener recomendaciones basadas en ítems de música, cine, libros, videojuegos, etc.

 * /api/recommendation/movies:
 *   post:
 *     summary: Obtener recomendaciones de películas basadas en un título
 *     tags: [Recommendations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecommendationRequest'
 *     responses:
 *       200:
 *         description: Lista de películas recomendadas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecommendationResponse'

 * /api/recommendation/tvshows:
 *   post:
 *     summary: Obtener recomendaciones de series de televisión
 *     tags: [Recommendations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecommendationRequest'
 *     responses:
 *       200:
 *         description: Lista de series recomendadas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecommendationResponse'

 * /api/recommendation/songs:
 *   post:
 *     summary: Obtener recomendaciones de canciones
 *     tags: [Recommendations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecommendationRequest'
 *     responses:
 *       200:
 *         description: Lista de canciones recomendadas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecommendationResponse'

 * /api/recommendation/artists:
 *   post:
 *     summary: Obtener recomendaciones de artistas musicales
 *     tags: [Recommendations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecommendationRequest'
 *     responses:
 *       200:
 *         description: Lista de artistas recomendados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecommendationResponse'

 * /api/recommendation/albums:
 *   post:
 *     summary: Obtener recomendaciones de álbumes musicales
 *     tags: [Recommendations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecommendationRequest'
 *     responses:
 *       200:
 *         description: Lista de álbumes recomendados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecommendationResponse'

 * /api/recommendation/books:
 *   post:
 *     summary: Obtener recomendaciones de libros
 *     tags: [Recommendations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecommendationRequest'
 *     responses:
 *       200:
 *         description: Lista de libros recomendados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecommendationResponse'

 * /api/recommendation/videogames:
 *   post:
 *     summary: Obtener recomendaciones de videojuegos
 *     tags: [Recommendations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecommendationRequest'
 *     responses:
 *       200:
 *         description: Lista de videojuegos recomendados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecommendationResponse'

 * /api/recommendation/mix:
 *   post:
 *     summary: Obtener una mezcla de recomendaciones variadas
 *     tags: [Recommendations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecommendationRequest'
 *     responses:
 *       200:
 *         description: Lista mezclada de ítems recomendados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecommendationResponse'
 */
