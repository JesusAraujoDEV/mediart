// services/playlist_service.js
const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const ItemService = require('./item_service');
const { uploadImageToImgBB, deleteImageFromImgBB } = require('../utils/imgbb_uploader');


class PlaylistService {

  constructor(){
    this.itemService = new ItemService();
  }

  async create(data, playlistCoverBuffer = null) {
    const { items, ...playlistData } = data;

    const user = await models.User.findByPk(playlistData.ownerUserId);
    if (!user) {
      throw boom.notFound('User not found');
    }
    
    let playlistCoverUrl = null;
    let imgbbDeleteUrl = null;

    // Si hay una imagen de portada, subirla a ImgBB
    if (playlistCoverBuffer) {
      try {
        const uploadResult = await uploadImageToImgBB(playlistCoverBuffer, `playlist_${Date.now()}.png`); // Nombre de archivo simple
        playlistCoverUrl = uploadResult.url;
        imgbbDeleteUrl = uploadResult.deleteUrl;
      } catch (uploadError) {
        console.error('Error uploading playlist cover to ImgBB:', uploadError);
        // Si falla la subida de la imagen, lanzamos un error que el router capturará
        throw boom.badImplementation('Failed to upload playlist cover image.', uploadError);
      }
    }

    // Asegurarse de que los campos del modelo se actualicen
    playlistData.playlistCoverUrl = playlistCoverUrl;
    playlistData.imgbbDeleteUrl = imgbbDeleteUrl;
    // Elimina thumbnailUrl si viene en data, ya que ahora usamos playlistCoverUrl
    delete playlistData.thumbnailUrl;

    const newPlaylist = await models.Playlist.create(playlistData);
    
    try {
      await models.Library.create({
        userId: user.id,
        playlistId: newPlaylist.id,
        isCollaborator: true
      });
    } catch (libraryError) {
      console.error("Error creating Library entry for new playlist:", libraryError);
      // Si falla la entrada en Library, deberías considerar también eliminar la imagen subida
      if (newPlaylist.imgbbDeleteUrl) {
        await deleteImageFromImgBB(newPlaylist.imgbbDeleteUrl);
        console.log('Cleaned up ImgBB image due to Library entry error.');
      }
      throw boom.internal('Failed to save playlist to user library after creation.', libraryError);
    }
    
    if (items && Array.isArray(items) && items.length > 0) {
      try {
        const addItemsResult = await this.addItemsToPlaylist(newPlaylist, items);
        console.log(`Successfully added ${addItemsResult.playlistItems.length} items during playlist creation.`);
        newPlaylist.dataValues.itemsAdded = addItemsResult.playlistItems.map(pi => pi.itemId);
      } catch (addItemsError) {
        console.error(`Error adding items to new playlist ${newPlaylist.id}:`, addItemsError);
        // Si falla la adición de ítems, deberías considerar también eliminar la imagen subida y la playlist.
        if (newPlaylist.imgbbDeleteUrl) {
          await deleteImageFromImgBB(newPlaylist.imgbbDeleteUrl);
          console.log('Cleaned up ImgBB image due to item addition error.');
        }
        await newPlaylist.destroy(); // Eliminar la playlist recién creada
        console.log(`Cleaned up new playlist ${newPlaylist.id} due to item addition error.`);
        throw boom.internal('Playlist created, but failed to add initial items. Rolled back playlist creation.', addItemsError);
      }
    }
    return newPlaylist;
  }

  async addCollaborator(playlistId, userIdToAdd) {
    const userLibraryEntry = await models.Library.findOne({
      where: {
        userId: userIdToAdd,
        playlistId: playlistId,
      },
    });

    if (!userLibraryEntry) {
      throw boom.badRequest(`User ${userIdToAdd} must have playlist ${playlistId} in their library to be added as a collaborator.`);
    }

    const [libraryEntry, created] = await models.Library.findOrCreate({
      where: {
        userId: userIdToAdd,
        playlistId: playlistId
      },
      defaults: {
        userId: userIdToAdd,
        playlistId: playlistId,
        isCollaborator: true
      }
    });

    if (!created) {
      // El registro ya existía
      if (!libraryEntry.isCollaborator) {
        await libraryEntry.update({ isCollaborator: true });
        return { status: 'success', message: `User ${userIdToAdd} updated to be a collaborator.` };
      }
      return { status: 'success', message: `User ${userIdToAdd} is already a collaborator and has the playlist in their library.` };
    }

    return { status: 'success', message: `User ${userIdToAdd} added as a collaborator and playlist saved to their library.` };
  }

  async addMultipleCollaborators(playlistId, userIdsToAdd) {
    const playlist = await this.findOne(playlistId);
    if (!playlist.isCollaborative) {
      throw boom.badRequest('This playlist is not configured as collaborative.');
    }

    const results = [];
    for (const userId of userIdsToAdd) {
      try {
        const result = await this.addCollaborator(playlistId, userId);
        results.push({ userId, status: 'success', message: result.message });
      } catch (error) {
        // Captura el error lanzado por boom.badRequest
        results.push({ userId, status: 'error', message: error.output?.payload?.message || error.message || 'Failed to add as collaborator' });
      }
    }
    return {
      message: `Attempted to add ${userIdsToAdd.length} collaborators.`,
      details: results
    };
  }

  async removeCollaborator(playlistId, userIdToRemove) {
    const playlist = await models.Playlist.findByPk(playlistId);
    if (!playlist) {
      throw boom.notFound('Playlist not found.');
    }
    if (!playlist.isCollaborative) {
      throw boom.badRequest('This playlist is not configured as collaborative.');
    }

    // El dueño no puede ser "removido" como colaborador
    if (playlist.ownerUserId === userIdToRemove) {
      throw boom.badRequest('The playlist owner cannot be removed as a collaborator.');
    }

    const libraryEntry = await models.Library.findOne({
      where: {
        userId: userIdToRemove,
        playlistId: playlistId,
        isCollaborator: true // Nos aseguramos de que realmente era un colaborador
      }
    });

    if (!libraryEntry) {
      throw boom.notFound(`User ${userIdToRemove} is not a collaborator of playlist ${playlistId}.`);
    }

    // Establecer isCollaborator a false
    await libraryEntry.update({ isCollaborator: false });

    return { status: 'success', message: `User ${userIdToRemove} is no longer a collaborator of playlist ${playlistId}.` };
  }

  async removeMultipleCollaborators(playlistId, userIdsToRemove) {
    const playlist = await this.findOne(playlistId);
    if (!playlist.isCollaborative) {
      throw boom.badRequest('This playlist is not configured as collaborative.');
    }

    const results = [];
    for (const userId of userIdsToRemove) {
      try {
        const result = await this.removeCollaborator(playlistId, userId);
        results.push({ userId, status: 'success', message: result.message });
      } catch (error) {
        results.push({ userId, status: 'error', message: error.output?.payload?.message || error.message || 'Failed to remove as collaborator' });
      }
    }
    return {
      message: `Attempted to remove ${userIdsToRemove.length} collaborators.`,
      details: results
    };
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
        },
        {
          model: models.User,
          as: 'collaborators',
          through: { attributes: [] }
        },
      ]
    });
    if (!playlist) {
      throw boom.notFound('Playlist not found');
    }
    return playlist;
  }

  async update(id, changes, playlistCoverBuffer = null) {
    const playlist = await this.findOne(id); // Obtener la playlist para tener la URL actual
    
    let newPlaylistCoverUrl = changes.playlistCoverUrl;
    let newImgbbDeleteUrl = changes.imgbbDeleteUrl; // Aunque no se espera que venga del frontend, lo manejamos por si acaso
    
    // 1. Manejo de la nueva imagen subida (si existe)
    if (playlistCoverBuffer) {
      try {
        const uploadResult = await uploadImageToImgBB(playlistCoverBuffer, `playlist_${Date.now()}.png`);
        newPlaylistCoverUrl = uploadResult.url;
        newImgbbDeleteUrl = uploadResult.deleteUrl;
        
        // Si ya existía una imagen anterior en ImgBB, eliminarla
        if (playlist.imgbbDeleteUrl) {
          await deleteImageFromImgBB(playlist.imgbbDeleteUrl);
          console.log(`Old ImgBB playlist cover deleted for playlist ${id}.`);
        }
      } catch (uploadError) {
        console.error('Error uploading new playlist cover to ImgBB:', uploadError);
        throw boom.badImplementation('Failed to upload new playlist cover image.', uploadError);
      }
    }

    else if (changes.playlistCoverUrl === '') {
      // 2. Si el frontend indica que se quiere eliminar la imagen (pasando playlistCoverUrl como cadena vacía)
      // y la playlist tenía una imagen
      if (playlist.imgbbDeleteUrl) {
        await deleteImageFromImgBB(playlist.imgbbDeleteUrl);
        console.log(`ImgBB playlist cover deleted for playlist ${id} due to explicit removal.`);
      }
      newPlaylistCoverUrl = null; // Establecer a null en la BD
      newImgbbDeleteUrl = null; // Eliminar también la URL de borrado
    }

    else {
      // 3. Si no se subió una nueva imagen y no se pidió eliminar,
      // conservar la URL de la imagen actual (o null si no había)
      newPlaylistCoverUrl = playlist.playlistCoverUrl;
      newImgbbDeleteUrl = playlist.imgbbDeleteUrl;
    }
    
    // Actualizar los campos en 'changes' para la actualización de la base de datos
    changes.playlistCoverUrl = newPlaylistCoverUrl;
    changes.imgbbDeleteUrl = newImgbbDeleteUrl;
    // Asegurarse de eliminar la propiedad thumbnailUrl si aún existe en changes
    delete changes.thumbnailUrl;
    
    const rta = await playlist.update(changes);
    return rta;
  }

  async delete(id) {
    const playlist = await this.findOne(id);

    // Eliminar la imagen de ImgBB si existe
    if (playlist.imgbbDeleteUrl) {
      try {
        await deleteImageFromImgBB(playlist.imgbbDeleteUrl);
        console.log(`ImgBB playlist cover deleted for playlist ${id} on playlist deletion.`);
      } catch (error) {
        console.error(`Failed to delete ImgBB playlist cover for playlist ${id}:`, error);
        // No impedimos la eliminación de la playlist si falla la eliminación de la imagen
      }
    }
    
    await playlist.destroy();

    return { id, message: 'Playlist deleted successfully' };
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
          console.error('Error adding item %s to playlist %s:', String(itemId), String(playlist.id), error);
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
