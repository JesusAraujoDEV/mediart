// services/user_service.js
const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const bcrypt = require('bcrypt');

const { uploadImageToImgBB, deleteImageFromImgBB } = require('../utils/imgbb_uploader');

class UserService {

  constructor(){
  }


  async create(data, profilePictureBuffer = null) {
    const hash = await bcrypt.hash(data.passwordHash, 10);

    let profilePictureUrl = null;
    let imgbbDeleteUrl = null;

    if (profilePictureBuffer) {
      // Usar la función importada de imgbb_uploader
      const uploadResult = await uploadImageToImgBB(profilePictureBuffer, data.username ? `${data.username}-profile` : 'user-profile');
      if (uploadResult) {
        profilePictureUrl = uploadResult.url;
        imgbbDeleteUrl = uploadResult.deleteUrl;
      }
    }

    const newUser = await models.User.create(
      {
        ...data,
        passwordHash: hash,
        profilePictureUrl: profilePictureUrl,
        imgbbDeleteUrl: imgbbDeleteUrl
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

  async find(options = {}) {
    const users = await models.User.findAll({
      ...options,
      attributes: {
        exclude: ['passwordHash', 'recoveryToken', 'imgbbDeleteUrl']
      }
      });
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

    if (Array.isArray(associationsToInclude) && associationsToInclude.length > 0) {
      for (const associationName of associationsToInclude) {
        if (allowedAssociations[associationName]) {
          findOptions.include.push(allowedAssociations[associationName]);
        } else {
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

  async findSavedPlaylistsByUserId(userId) {
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
      throw boom.notFound('User not found');
    }

    return user.savedPlaylists;
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

  async update(id, changes, profilePictureBuffer = null) {
    const user = await models.User.findByPk(id);

    if (!user) {
        throw boom.notFound('User not found');
    }

    const updatedChanges = { ...changes };

    // Si se envía un passwordHash en los cambios, hashearlo
    if (updatedChanges.passwordHash) {
      updatedChanges.passwordHash = await bcrypt.hash(updatedChanges.passwordHash, 10);
    }

    // Lógica para el manejo de la imagen de perfil
    if (profilePictureBuffer) {
      // Si se envió un nuevo archivo, primero intentar borrar el antiguo de ImgBB
      if (user.imgbbDeleteUrl) {
        try {
          // Usar la función importada de imgbb_uploader
          await deleteImageFromImgBB(user.imgbbDeleteUrl);
          console.log(`Old profile picture deleted from ImgBB: ${user.imgbbDeleteUrl}`);
        } catch (error) {
          console.error(`Failed to delete old profile picture from ImgBB (might already be gone or URL expired):`, error.message);
          // No lanzamos error Boom aquí para no detener la actualización del usuario
        }
      }

      // Subir el nuevo archivo a ImgBB
      // Usar la función importada de imgbb_uploader
      const uploadResult = await uploadImageToImgBB(profilePictureBuffer, user.username ? `${user.username}-profile` : `user-${id}-profile`);
      if (uploadResult) {
        updatedChanges.profilePictureUrl = uploadResult.url;
        updatedChanges.imgbbDeleteUrl = uploadResult.deleteUrl; // Guarda la nueva delete_url
      }
    } else if (updatedChanges.profilePictureUrl === '') {
      // Si el frontend envió profilePictureUrl como cadena vacía, significa que se quiere eliminar la imagen
      if (user.profilePictureUrl && user.imgbbDeleteUrl) { // Solo si hay una URL existente y su delete_url
        try {
          // Usar la función importada de imgbb_uploader
          await deleteImageFromImgBB(user.imgbbDeleteUrl);
          console.log(`Profile picture deleted from ImgBB upon explicit removal: ${user.imgbbDeleteUrl}`);
        } catch (error) {
          console.error(`Failed to delete profile picture from ImgBB (might already be gone or URL expired) upon explicit removal:`, error.message);
        }
      }
      updatedChanges.profilePictureUrl = null; // Establecer a null en la BD
      updatedChanges.imgbbDeleteUrl = null;    // También limpiar la delete_url en la DB
    } else if (updatedChanges.profilePictureUrl === undefined) {
        // Si no se envía ni archivo ni el campo profilePictureUrl en el body,
        // significa que no se debe modificar la URL existente en la BD.
        delete updatedChanges.profilePictureUrl;
        // También aseguramos que imgbbDeleteUrl no se toque si no se cambia la imagen
        delete updatedChanges.imgbbDeleteUrl;
    }

    const rta = await user.update(updatedChanges);
    // Excluir passwordHash del objeto retornado después de la actualización
    delete rta.dataValues.passwordHash;
    return rta;
  }

  async delete(id) {
    // Es CRUCIAL obtener la delete_url de la base de datos para poder eliminar la imagen
    const user = await models.User.findByPk(id); // Traemos el usuario completo, incluyendo imgbbDeleteUrl

    if (!user) {
        throw boom.notFound('User not found');
    }

    // Si el usuario tiene una imagen de perfil y su delete_url, intentar eliminarla de ImgBB
    if (user.profilePictureUrl && user.imgbbDeleteUrl) {
      try {
        // Usar la función importada de imgbb_uploader
        await deleteImageFromImgBB(user.imgbbDeleteUrl);
        console.log(`Profile picture deleted from ImgBB for user ${id}: ${user.imgbbDeleteUrl}`);
      } catch (error) {
        console.error('Failed to delete profile picture from ImgBB for user %s (might already be gone or URL expired): %s', id, error.message);
        // Aquí decides si lanzas un error Boom o simplemente loggeas y continuas.
        // Generalmente, no quieres que la eliminación del usuario falle solo porque la imagen no se borró de ImgBB.
      }
    }

    await user.destroy();
    return { id };
  }

}

module.exports = UserService;