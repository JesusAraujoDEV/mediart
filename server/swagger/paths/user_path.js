/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Endpoints relacionados con usuarios
 *
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - passwordHash
 *             properties:
 *               username:
 *                 type: string
 *                 example: nuevo_usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nuevo@example.com
 *               passwordHash:
 *                 type: string
 *                 example: MiClaveSegura123
 *               bio:
 *                 type: string
 *                 maxLength: 600
 *                 example: "Descripción opcional."
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Imagen JPEG, PNG, GIF o WEBP (máx. 2MB)
 *               profilePictureUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://cdn.miapp.com/avatar.png
 *                 description: URL remota de la imagen (opcional)
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 * /api/users/by-username/{username}:
 *   get:
 *     summary: Obtener un usuario por nombre de usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: include
 *         schema:
 *           type: string
 *           example: ownedPlaylists,savedPlaylists
 *         description: Relaciones a incluir (separadas por coma)
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserWithAssociations'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por su ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   patch:
 *     summary: Actualizar un usuario por ID (solo campos opcionales)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               username:
 *                 type: string
 *                 example: usuario_editado
 *               email:
 *                 type: string
 *                 format: email
 *                 example: editado@example.com
 *               passwordHash:
 *                 type: string
 *                 example: NuevaClave789
 *               bio:
 *                 type: string
 *                 maxLength: 600
 *                 example: Mi nueva biografía.
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen a subir como foto de perfil
 *               profilePictureUrl:
 *                 type: string
 *                 example: ""
 *                 description: URL remota para imagen o cadena vacía para eliminarla
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
