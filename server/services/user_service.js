const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const bcrypt = require('bcrypt');

class UserService {

  constructor(){
  }

  async create(data) {
    const hash = await bcrypt.hash(data.passwordHash, 10);
    const newUser = await models.User.create(
      {
        ...data,
        passwordHash: hash
      }
    );
    delete newUser.dataValues.passwordHash;
    return newUser;
  }

  async savePlaylist(userId, playlistId) {
    const user = await this.findOne(userId);
    console.log(user);

    const playlist = await models.Playlist.findByPk(playlistId);
    if (!playlist) {
      throw boom.notFound('Playlist not found');
    }

    const existingEntry = await models.Library.findOne({
      where: {
        userId: userId,
        playlistId: playlistId
      }
    });

    if (existingEntry) {
      throw boom.conflict('Playlist is already saved by this user.');
    }

    const newLibraryEntry = await models.Library.create({
      userId: userId,
      playlistId: playlistId,
    });

    return { message: 'Playlist saved successfully', libraryEntry: newLibraryEntry };
  }

  async unsavePlaylist(userId, playlistId) {
    const user = await this.findOne(userId);

    const libraryEntry = await models.Library.findOne({
      where: {
        userId: userId,
        playlistId: playlistId
      }
    });

    if (!libraryEntry) {
      throw boom.notFound('Playlist is not saved by this user.');
    }

    await libraryEntry.destroy();

    return { message: 'Playlist unsaved successfully' };
  }

  async find() {
    const users = await models.User.findAll( // Renombrado 'client' a 'users' para mayor claridad
      {
        include: [
          {
            model: models.Playlist,
            as: 'ownedPlaylists' // Incluye las playlists que este usuario posee
          },
          {
            model: models.Playlist,
            as: 'savedPlaylists', // Incluye las playlists que este usuario ha guardado
            through: { attributes: ['savedAt'] } // Incluye el campo 'savedAt' de la tabla intermedia
          },
          {
            model: models.User,
            as: 'followersUsers' // Incluye los usuarios que siguen a este usuario
          },
          {
            model: models.User,
            as: 'followingUsers' // Incluye los usuarios a los que este usuario sigue
          },
          {
            model: models.Library, // Acceso directo a las entradas de la tabla 'library'
            as: 'libraryEntries',
            foreignKey: 'user_id'
          },
          {
            model: models.UserFollow, // Acceso directo a las relaciones de seguimiento iniciadas por este usuario
            as: 'initiatedFollows',
            foreignKey: 'follower_user_id'
          },
          {
            model: models.UserFollow, // Acceso directo a las relaciones de seguimiento recibidas por este usuario
            as: 'receivedFollows',
            foreignKey: 'followed_user_id'
          }
        ]
      }
    );
    return users; // Renombrado 'client' a 'users'
  }

  async findOneByEmail(email) {
    const user = await models.User.findOne(
      {
        where: { email }
      }
    );
    return user;
  }

  async findSavedPlaylistsByUserId(userId) { // Cambia el parámetro a userId
    const user = await models.User.findByPk(userId, {
      include: [
        {
          model: models.Playlist,
          as: 'savedPlaylists',
          through: { attributes: ['savedAt'] },
          include: [
            {
              model: models.Item,
              as: 'items',
              through: { attributes: [] }
            }
          ]
        }
      ]
    });

    if (!user) {
      throw boom.notFound('User not found'); // Si el usuario no existe
    }

    return user.savedPlaylists; // Devuelve el array de playlists guardadas
  }

  async findOne(id) {
    const user = await models.User.findByPk(id, {
      include: [
        {
          model: models.Playlist,
          as: 'ownedPlaylists' // Incluye las playlists que este usuario posee
        },
        {
          model: models.Playlist,
          as: 'savedPlaylists', // Incluye las playlists que este usuario ha guardado
          through: { attributes: ['savedAt'] }
        },
        {
          model: models.User,
          as: 'followersUsers' // Incluye los usuarios que siguen a este usuario
        },
        {
          model: models.User,
          as: 'followingUsers' // Incluye los usuarios a los que este usuario sigue
        },
        {
          model: models.Library, // Acceso directo a las entradas de la tabla 'library'
          as: 'libraryEntries',
          foreignKey: 'user_id'
        },
        {
          model: models.UserFollow, // Acceso directo a las relaciones de seguimiento iniciadas por este usuario
          as: 'initiatedFollows',
          foreignKey: 'follower_user_id'
        },
        {
          model: models.UserFollow, // Acceso directo a las relaciones de seguimiento recibidas por este usuario
          as: 'receivedFollows',
          foreignKey: 'followed_user_id'
        }
      ]
    });
    if (!user) {
      throw boom.notFound('User not found');
    }
    return user;
  }

  async update(id, changes) {
    const user = await this.findOne(id);
    const rta = await user.update(changes);
    return rta;
  }

  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }

}

module.exports = UserService;