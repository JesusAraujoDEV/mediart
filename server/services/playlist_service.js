const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class PlaylistsService {

  constructor(){
  }

  async create(data) {
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

}

module.exports = PlaylistsService;