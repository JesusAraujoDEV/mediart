const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class UsersService {

  constructor(){
  }

  async create(data) {
    const newUser = await models.User.create(data);
    return newUser;
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

module.exports = UsersService;