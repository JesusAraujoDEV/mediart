const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const PROFILE_PICTURES_DIR = path.join(__dirname, '../../uploads/profile_pictures');


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

  async find(options = {}) { // Ahora acepta un objeto de opciones
    const users = await models.User.findAll(options); // Pasa las opciones a findAll
    return users;
  }

  async findOneByEmail(email) {
    const user = await models.User.findOne(
      {
        where: { email }
      }
    );
    return user;
  }

  async findOneByUsername(username, associationsToInclude = []) {
    const allowedAssociations = {
      'ownedPlaylists': { model: models.Playlist, as: 'ownedPlaylists' },
      'savedPlaylists': { model: models.Playlist, as: 'savedPlaylists', through: { attributes: ['savedAt'] } },
      'followersUsers': {
        model: models.User,
        as: 'followersUsers',
        attributes: ['id', 'username', 'email', 'profilePictureUrl'],
        through: { attributes: [] }
      },
      'followingUsers': {
        model: models.User,
        as: 'followingUsers',
        attributes: ['id', 'username', 'email', 'profilePictureUrl'],
        through: { attributes: [] }
      },
      'libraryEntries': { model: models.Library, as: 'libraryEntries' },
      'initiatedFollows': { model: models.UserFollow, as: 'initiatedFollows' },
      'receivedFollows': { model: models.UserFollow, as: 'receivedFollows' },
      'collaboratorPlaylists': {
        model: models.Playlist,
        as: 'collaboratorPlaylists',
        through: { attributes: [] },
      }
    };

    let findOptions = {
        where: { username },
        attributes: { exclude: ['passwordHash', 'recoveryToken'] },
        include: []
    };

    // Si se especifican asociaciones, las añadimos si están en la lista de permitidas
    if (Array.isArray(associationsToInclude) && associationsToInclude.length > 0) {
      for (const associationName of associationsToInclude) {
        if (allowedAssociations[associationName]) {
          findOptions.include.push(allowedAssociations[associationName]);
        } else {
          // Opcional: Podrías lanzar un boom.badRequest aquí si quieres que la API falle si se pide una asociación inválida
          console.warn(`Attempted to include unknown or disallowed association: ${associationName} for username.`);
        }
      }
    }

    if (findOptions.include.length === 0) {
        findOptions.include.push(
            {
                model: models.User,
                as: 'followersUsers',
                attributes: ['id', 'username', 'email', 'profilePictureUrl'],
                through: { attributes: [] }
            },
            {
                model: models.User,
                as: 'followingUsers',
                attributes: ['id', 'username', 'email', 'profilePictureUrl'],
                through: { attributes: [] }
            }
        );
    }

    const user = await models.User.findOne(findOptions);

    if (!user) {
      throw boom.notFound('User not found');
    }
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

  async findOne(id, associationsToInclude = [], includeRecoveryToken = false) {
    const allowedAssociations = {
      'ownedPlaylists': {
        model: models.Playlist,
        as: 'ownedPlaylists',
        through: { attributes: [] }
      },
      'savedPlaylists': {
        model: models.Playlist,
        as: 'savedPlaylists',
        through: { attributes: ['savedAt'] }
      },
      'followersUsers': {
        model: models.User,
        as: 'followersUsers',
        attributes: ['id', 'username', 'email', 'profilePictureUrl'],
        through: { attributes: [] }
      },
      'followingUsers': {
        model: models.User,
        as: 'followingUsers',
        attributes: ['id', 'username', 'email', 'profilePictureUrl'],
        through: { attributes: [] }
      },
      'libraryEntries': {
        model: models.Library,
        as: 'libraryEntries',
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      },
      'initiatedFollows': {
        model: models.UserFollow,
        as: 'initiatedFollows',
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      },
      'receivedFollows': {
        model: models.UserFollow,
        as: 'receivedFollows',
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      },
      'collaboratorPlaylists': {
        model: models.Playlist,
        as: 'collaboratorPlaylists',
        through: { attributes: [] },
      }
    };

    let findOptions = {
      attributes: { exclude: ['passwordHash'] }
    };
    if (!includeRecoveryToken) {
      findOptions.attributes.exclude.push('recoveryToken');
    }
    findOptions.include = [];

    if (Array.isArray(associationsToInclude) && associationsToInclude.length > 0) {
      for (const associationName of associationsToInclude) {
        if (allowedAssociations[associationName]) {
          findOptions.include.push(allowedAssociations[associationName]);
        } else {
          console.warn(`Attempted to include unknown or disallowed association: ${associationName}`);
        }
      }
    }

    const user = await models.User.findByPk(id, findOptions);

    if (!user) {
      throw boom.notFound('User not found');
    }
    return user;
  }

  async findMyFollowers(userId) {
    const userWithFollowers = await models.User.findByPk(userId, {
      attributes: [],
      include: [
        {
          model: models.User,
          as: 'followersUsers',
          attributes: ['id', 'username', 'email', 'profilePictureUrl'],
          through: { attributes: [] }
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
      attributes: [],
      include: [
        {
          model: models.User,
          as: 'followingUsers',
          attributes: ['id', 'username', 'email', 'profilePictureUrl'],
          through: { attributes: [] }
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

    if (changes.profilePictureUrl !== undefined && user.profilePictureUrl) {
      const oldPictureFilename = path.basename(user.profilePictureUrl);
      const oldPicturePath = path.join(PROFILE_PICTURES_DIR, oldPictureFilename);

      // Solo borramos si el nuevo valor no es el mismo que el actual
      // O si el nuevo valor es nulo (indicando que se quiere eliminar)
      if (changes.profilePictureUrl !== user.profilePictureUrl || changes.profilePictureUrl === null) {
        if (fs.existsSync(oldPicturePath)) {
          fs.unlink(oldPicturePath, (err) => {
            if (err) console.error('Error deleting old profile picture:', err);
          });
        }
      }
    }

    const rta = await user.update(changes);

    return rta;
  }

  async delete(id) {
    const user = await this.findOne(id);
    if (user.profilePictureUrl) {
      const picturePath = path.join(PROFILE_PICTURES_DIR, path.basename(user.profilePictureUrl));
      if (fs.existsSync(picturePath)) {
        fs.unlink(picturePath, (err) => {
          if (err) console.error('Error deleting profile picture on user delete:', err);
        });
      }
    }
    await user.destroy();
    return { id };
  }

}

module.exports = UserService;