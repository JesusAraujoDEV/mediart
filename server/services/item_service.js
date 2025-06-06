const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class ItemsService {

  constructor(){
  }

  async create(data) {
    const newItem = await models.Item.create(data);
    return newItem;
  }

  async find() {
    const items = await models.Item.findAll(
      {
        include: [
          {
            model: models.Playlist,
            as: 'playlists',
            through: { attributes: [] }
          },
          { // Nueva inclusión para acceder a los registros de la tabla intermedia
            model: models.PlaylistItem,
            as: 'playlistEntries' // Usamos el alias definido en item_model.js
          }
        ]
      }
    );
    return items;
  }

  async findOne(id) {
    const item = await models.Item.findByPk(id, {
      include: [
        {
          model: models.Playlist,
          as: 'playlists',
          through: { attributes: [] }
        },
        { // Nueva inclusión para acceder a los registros de la tabla intermedia
          model: models.PlaylistItem,
          as: 'playlistEntries' // Usamos el alias definido en item_model.js
        }
      ]
    });
    if (!item) {
      throw boom.notFound('Item not found');
    }
    return item;
  }

  async update(id, changes) {
    const item = await this.findOne(id);
    const rta = await item.update(changes);
    return rta;
  }

  async delete(id) {
    const item = await this.findOne(id);
    await item.destroy();
    return { id };
  }

}

module.exports = ItemsService;