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
    const userExists = await models.User.findByPk(userId, { attributes: ['id'] });
    if (!userExists) {
      throw boom.notFound('User not found');
    }

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
    const userExists = await models.User.findByPk(userId, { attributes: ['id'] });
    if (!userExists) {
      throw boom.notFound('User not found');
    }

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
          },
          {
            model: models.Playlist,
            as: 'collaboratorPlaylists',
            foreignKey: 'user_id'
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

  async findOneByUsername(username) {
    const user = await models.User.findOne(
      {
        where: { username },
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
          },
          {
            model: models.Playlist,
            as: 'collaboratorPlaylists',
            foreignKey: 'user_id'
          }
        ]
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

  async findMyFollowers(userId) {
    const userWithFollowers = await models.User.findByPk(userId, {
      attributes: ['id'],
      include: [
        {
          model: models.User,
          as: 'followersUsers',
          attributes: ['id', 'username', 'email', 'profilePictureUrl']
        }
      ]
    });

    if (!userWithFollowers) {
      throw boom.notFound('User not found');
    }

    return userWithFollowers.followersUsers;
  }

  async findMyFollowings(userId) {
    const userWithFollowings = await models.User.findByPk(userId, {
      attributes: ['id'],
      include: [
        {
          model: models.User,
          as: 'followingUsers',
          attributes: ['id', 'username', 'email', 'profilePictureUrl']
        }
      ]
    });

    if (!userWithFollowings) {
      throw boom.notFound('User not found');
    }

    return userWithFollowings.followingUsers;
  }

  async followUser(followerUserId, followedUserId) {
    const followerUser = await models.User.findByPk(followerUserId, { attributes: ['id'] });
    if (!followerUser) {
      throw boom.notFound('Follower user not found');
    }

    const followedUser = await models.User.findByPk(followedUserId, { attributes: ['id'] });
    if (!followedUser) {
      throw boom.notFound('User to follow not found');
    }

    if (followerUserId === followedUserId) {
      throw boom.badRequest('Cannot follow yourself');
    }

    const existingFollow = await models.UserFollow.findOne({
      where: {
        followerUserId: followerUserId,
        followedUserId: followedUserId
      }
    });

    if (existingFollow) {
      throw boom.conflict('Already following this user.');
    }

    const newFollow = await models.UserFollow.create({
      followerUserId: followerUserId,
      followedUserId: followedUserId
    });

    return { message: 'User followed successfully', followEntry: newFollow };
  }

  async unfollowUser(followerUserId, followedUserId) {
    const followerUser = await models.User.findByPk(followerUserId, { attributes: ['id'] });
    if (!followerUser) {
      throw boom.notFound('Follower user not found');
    }

    const followEntry = await models.UserFollow.findOne({
      where: {
        followerUserId: followerUserId,
        followedUserId: followedUserId
      }
    });

    if (!followEntry) {
      throw boom.notFound('Not following this user.');
    }

    await followEntry.destroy();

    return { message: 'User unfollowed successfully' };
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