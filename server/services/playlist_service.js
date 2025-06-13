const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class PlaylistsService {

  constructor(){
  }

  async create(data) {
    const user = await models.User.findByPk(data.ownerUserId);
    console.log(user);
    if (!user) {
      throw boom.notFound('User not found');
    }
    const newPlaylist = await models.Playlist.create(data);
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

module.exports = PlaylistsService;