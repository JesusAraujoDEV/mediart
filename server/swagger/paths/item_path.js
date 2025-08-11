/**
 * @swagger
 * tags:
 *   name: Item
 *   description: Endpoints relacionados con la gestión de ítems multimedia
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Obtener todos los ítems
 *     tags: [Item]
 *     responses:
 *       200:
 *         description: Lista de ítems
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemResponse'
 *   post:
 *     summary: Crear un nuevo ítem
 *     tags: [Item]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateItemRequest'
 *     responses:
 *       201:
 *         description: Ítem creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemResponse'
 */

/**
 * @swagger
 * /api/items/{itemId}:
 *   get:
 *     summary: Obtener un ítem por ID
 *     tags: [Item]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         description: ID del ítem
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle del ítem
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemResponse'
 *   patch:
 *     summary: Actualizar un ítem existente
 *     tags: [Item]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         description: ID del ítem
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateItemRequest'
 *     responses:
 *       200:
 *         description: Ítem actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemResponse'
 *   delete:
 *     summary: Eliminar un ítem por ID
 *     tags: [Item]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         description: ID del ítem
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Ítem eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 itemId:
 *                   type: integer
 *                   example: 1
 */
