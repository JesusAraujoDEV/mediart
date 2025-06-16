const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const ItemService = require('./item_service');

class PlaylistService {

  constructor(){
    this.itemService = new ItemService();
  }

  async create(data) {
    const user = await models.User.findByPk(data.ownerUserId);
    console.log(user);
    if (!user) {
      throw boom.notFound('User not found');
    }

    const newPlaylist = await models.Playlist.create(data);

    try {
        await models.Library.create({
            userId: user.id,
            playlistId: newPlaylist.id,
        });
    } catch (libraryError) {
        console.error("Error creating Library entry for new playlist:", libraryError);
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

  async addItemsToPlaylist(playlist, itemsData) {
    if (!Array.isArray(itemsData) || itemsData.length === 0) {
      throw boom.badRequest('itemsData must be a non-empty array of item objects.');
    }

    const newPlaylistItems = [];
    const existingItemIdsInPlaylist = new Set();
    
    const currentPlaylistEntries = await models.PlaylistItem.findAll({
        where: { playlistId: playlist.id },
        attributes: ['itemId']
    });
    currentPlaylistEntries.forEach(entry => existingItemIdsInPlaylist.add(entry.itemId));


    for (const itemData of itemsData) {
      const externalIdString = String(itemData.externalId); 

      let existingItem = await models.Item.findOne({
        where: {
          externalId: externalIdString,
          type: itemData.type,
          externalSource: itemData.externalSource
        }
      });

      let itemIdToAdd;

      if (existingItem) {
        itemIdToAdd = existingItem.id;
        await existingItem.update(itemData); 
      } else {
        try {
          const newItem = await this.itemService.create({ 
            title: itemData.title,
            description: itemData.description,
            coverUrl: itemData.coverUrl,
            releaseDate: itemData.releaseDate,
            externalId: externalIdString,
            avgRating: itemData.avgRating,
            externalUrl: itemData.externalUrl,
            type: itemData.type,
            externalSource: itemData.externalSource
          });
          itemIdToAdd = newItem.id;
        } catch (error) {
          console.error(`Error creating item ${itemData.title} (${itemData.externalId}):`, error);
          continue;
        }
      }

      if (itemIdToAdd && !existingItemIdsInPlaylist.has(itemIdToAdd)) {
        try {
          const playlistItem = await models.PlaylistItem.create({
            playlistId: playlist.id,
            itemId: itemIdToAdd
          });
          newPlaylistItems.push(playlistItem);
          existingItemIdsInPlaylist.add(itemIdToAdd);
        } catch (error) {
          if (error.name === 'SequelizeUniqueConstraintError') {
             console.warn(`Item ${itemIdToAdd} already exists in playlist ${playlist.id}.`);
          } else {
             console.error(`Error adding item ${itemIdToAdd} to playlist ${playlist.id}:`, error);
             throw error; 
          }
        }
      } else if (itemIdToAdd && existingItemIdsInPlaylist.has(itemIdToAdd)) {
        console.warn(`Item (ID: ${itemIdToAdd}) already exists in playlist ${playlist.id}. Skipping.`);
      }
    }

    if (newPlaylistItems.length === 0) {
      throw boom.conflict('No new items were added to the playlist. All provided items might already exist or failed to be created/added.');
    }

    return { message: `${newPlaylistItems.length} new items added to playlist successfully`, playlistItems: newPlaylistItems };
  }

  async addExistingItemsToPlaylist(playlist, itemIds) {
    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      throw boom.badRequest('itemIds must be a non-empty array of item IDs.');
    }

    const newPlaylistItems = [];
    const existingItemIdsInPlaylist = new Set();

    const currentPlaylistEntries = await models.PlaylistItem.findAll({
      where: { playlistId: playlist.id },
      attributes: ['itemId']
    });
    currentPlaylistEntries.forEach(entry => existingItemIdsInPlaylist.add(entry.itemId));

    for (const itemId of itemIds) {
      if (existingItemIdsInPlaylist.has(itemId)) {
        console.warn(`Item ID ${itemId} already exists in playlist ${playlist.id}. Skipping.`);
        continue;
      }

      const item = await models.Item.findByPk(itemId);
      if (!item) {
        console.warn(`Item with ID ${itemId} not found. Skipping.`);
        continue;
      }

      try {
        const playlistItem = await models.PlaylistItem.create({
          playlistId: playlist.id,
          itemId: itemId
        });
        newPlaylistItems.push(playlistItem);
        existingItemIdsInPlaylist.add(itemId);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          console.warn(`Item ${itemId} already exists in playlist ${playlist.id} (caught unique constraint).`);
        } else {
          console.error(`Error adding item ${itemId} to playlist ${playlist.id}:`, error);
          throw error;
        }
      }
    }

    if (newPlaylistItems.length === 0) {
      throw boom.conflict('No new items were added to the playlist. All provided items might already exist or failed to be added.');
    }

    return { message: `${newPlaylistItems.length} new items added to playlist successfully`, playlistItems: newPlaylistItems };
  }


  async removeItemFromPlaylist(playlist, itemId) {
    const item = await models.Item.findByPk(itemId);
    if (!item) {
      throw boom.notFound('Item not found');
    }

    const playlistItemEntry = await models.PlaylistItem.findOne({
      where: {
        playlistId: playlist.id,
        itemId: itemId
      }
    });

    if (!playlistItemEntry) {
      throw boom.notFound('Item not found in this playlist');
    }

    await playlistItemEntry.destroy();

    return { message: 'Item removed from playlist successfully' };
  }

}

module.exports = PlaylistService;