const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class PlaylistService {

  constructor(){
  }

  async create(data) {
    const user = await models.User.findByPk(data.ownerUserId);
    console.log(user);
    if (!user) {
      throw boom.notFound('User not found');
    }

    // 1. Crear la nueva playlist
    const newPlaylist = await models.Playlist.create(data);

    // 2. ¡CORRECCIÓN AQUÍ!: Guardar la playlist recién creada en la librería del usuario que la creó
    // En lugar de usar el método mágico, insertamos directamente en la tabla 'Library'
    try {
        await models.Library.create({
            userId: user.id,         // Aseguramos que userId sea el ID del usuario
            playlistId: newPlaylist.id, // Aseguramos que playlistId sea el ID de la nueva playlist
            // savedAt no es necesario pasarlo explícitamente porque tiene defaultValue: Sequelize.NOW
        });
    } catch (libraryError) {
        // Opcional: Si la inserción en Library falla, podrías considerar eliminar la playlist recién creada
        // para mantener la consistencia de la base de datos, o al menos registrar el error.
        console.error("Error creating Library entry for new playlist:", libraryError);
        // Si no quieres que la playlist se cree sin guardarse en la librería, puedes lanzar un error.
        // Si quieres que se cree igual y registrar solo el error de librería, puedes omitir el throw.
        throw boom.internal('Failed to save playlist to user library after creation.', libraryError);
    }

    return newPlaylist;
  }

  async find() {
    const playlists = await models.Playlist.findAll(
      {
        include: [
            {
                model: models.User,
                as: 'owner',
            },
            {
                model: models.Item,
                as: 'items',
                through: { attributes: [] }
            },
            {
                model: models.User,
                as: 'savedByUsers',
                through: { attributes: [] }
            }
        ]
      }
    );
    return playlists;
  }

  async findByOwner(userId) {
    const playlists = await models.Playlist.findAll({
      where: {
        ownerUserId: userId
      },
      include: [
        {
          model: models.User,
          as: 'owner',
          attributes: ['id', 'username', 'email']
        },
        {
          model: models.Item,
          as: 'items',
          through: { attributes: [] }
        }
      ]
    });

    return playlists;
  }

  async findOne(id) {
    const playlist = await models.Playlist.findByPk(id, {
      include: [
        {
            model: models.User,
            as: 'owner',
        },
        {
            model: models.Item,
            as: 'items',
            through: { attributes: [] }
        },
        {
            model: models.User,
            as: 'savedByUsers',
            through: { attributes: [] }
        }
      ]
    });
    if (!playlist) {
      throw boom.notFound('Playlist not found');
    }
    return playlist;
  }

  async update(id, changes) {
    const playlist = await this.findOne(id);
    const rta = await playlist.update(changes);
    return rta;
  }

  async delete(id) {
    const playlist = await this.findOne(id);
    await playlist.destroy();
    return { id };
  }

  // --- MÉTODOS PARA GESTIONAR ÍTEMS EN PLAYLISTS ---

  async addItemToPlaylist(playlist, itemId) {
    // 1. Verificar si el item existe
    const item = await models.Item.findByPk(itemId);
    if (!item) {
      throw boom.notFound('Item not found');
    }

    // 2. Verificar si el item ya está en la playlist para evitar duplicados (opcional, pero buena práctica)
    const existingEntry = await models.PlaylistItem.findOne({
      where: {
        playlistId: playlist.id,
        itemId: itemId
      }
    });

    if (existingEntry) {
      throw boom.conflict('Item already exists in this playlist');
    }

    // 3. Crear la entrada en la tabla intermedia PlaylistItem
    // Aquí es donde interactuamos directamente con PlaylistItem
    const newPlaylistItem = await models.PlaylistItem.create({
      playlistId: playlist.id,
      itemId: itemId,
      // 'addedAt' se establecerá automáticamente por su defaultValue: Sequelize.NOW
      // 'orderInPlaylist' podría dejarse nulo o calcularse si tienes esa lógica
    });

    return { message: 'Item added to playlist successfully', playlistItem: newPlaylistItem };
  }

  async addItemsToPlaylist(playlist, itemIds) {
    // 1. Verificar si todos los items existen
    const existingItems = await models.Item.findAll({ where: { id: itemIds } });
    if (existingItems.length !== itemIds.length) {
      const foundIds = existingItems.map(item => item.id);
      const notFoundIds = itemIds.filter(id => !foundIds.includes(id));
      throw boom.badRequest(`One or more items not found with IDs: ${notFoundIds.join(', ')}`);
    }

    // 2. Obtener los ítems que *ya están* en la playlist para evitar duplicados
    const existingEntries = await models.PlaylistItem.findAll({
      where: {
        playlistId: playlist.id,
        itemId: itemIds // Busca si alguno de estos ítems ya está en la playlist
      },
      attributes: ['itemId'] // Solo necesitamos los IDs de los ítems existentes
    });
    const existingItemIdsInPlaylist = new Set(existingEntries.map(entry => entry.itemId));

    // 3. Filtrar los ítems que ya están y preparar los nuevos para insertar
    const itemsToInsert = existingItems.filter(item => !existingItemIdsInPlaylist.has(item.id));

    if (itemsToInsert.length === 0) {
        throw boom.conflict('All provided items already exist in this playlist');
    }

    // 4. Crear múltiples entradas en la tabla intermedia PlaylistItem
    // Usamos bulkCreate para eficiencia
    const newPlaylistItems = await models.PlaylistItem.bulkCreate(
      itemsToInsert.map(item => ({
        playlistId: playlist.id,
        itemId: item.id
        // addedAt se establecerá automáticamente
        // orderInPlaylist podría dejarse nulo o calcularse
      }))
    );

    return { message: `${newPlaylistItems.length} items added to playlist successfully`, playlistItems: newPlaylistItems };
  }


  async removeItemFromPlaylist(playlist, itemId) {
    // 1. Verificar si el item existe (opcional, pero buena práctica si el itemId es la única entrada)
    // Aunque el error de DB se lanzaría igual, es más amigable para el cliente.
    const item = await models.Item.findByPk(itemId);
    if (!item) {
      throw boom.notFound('Item not found');
    }

    // 2. Encontrar la entrada específica en la tabla intermedia
    const playlistItemEntry = await models.PlaylistItem.findOne({
      where: {
        playlistId: playlist.id,
        itemId: itemId
      }
    });

    if (!playlistItemEntry) {
      throw boom.notFound('Item not found in this playlist'); // O un 404 más específico
    }

    // 3. Eliminar la entrada de la tabla intermedia
    await playlistItemEntry.destroy();

    return { message: 'Item removed from playlist successfully' };
  }

}

module.exports = PlaylistService;