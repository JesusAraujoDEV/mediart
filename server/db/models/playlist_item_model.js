const { Model, DataTypes, Sequelize } = require('sequelize');
const { PLAYLIST_TABLE } = require('./playlist_model'); // Asegúrate que 'playlist_model' exporta PLAYLIST_TABLE
const { ITEM_TABLE } = require('./item_model'); // Asegúrate de que es 'item_model' y no 'items_model'

const PLAYLIST_ITEM_TABLE = 'playlist_items'; // ¡Correcto! Esta es la tabla 'playlist_items'

const PlaylistItemSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  playlistId: {
    field: 'playlist_id', // Nombre de la columna en la BD
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: PLAYLIST_TABLE, // Referencia la tabla de playlists
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE' // Si la playlist es eliminada, sus ítems en esta tabla también se eliminan
  },
  itemId: {
    field: 'item_id', // Nombre de la columna en la BD
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: ITEM_TABLE, // ¡Correcto! Referencia la tabla de items
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE' // Si el item es eliminado, se borran sus entradas de la playlist
  },
  addedAt: {
    field: 'added_at', // Nombre de la columna en la BD
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  orderInPlaylist: {
    field: 'order_in_playlist',
    allowNull: true, // Permitir nulos si el orden no es estricto
    type: DataTypes.INTEGER
  }
  // No se necesita 'updatedAt' ni 'createdAt' automáticos si ya tenemos 'addedAt' y timestamps: false
};

class PlaylistItem extends Model { // ¡La clase debe ser PlaylistItem!
  static associate(models) {
    // Una entrada de PlaylistItem pertenece a una Playlist
    this.belongsTo(models.Playlist, {
      as: 'playlist', // Alias para acceder a la Playlist asociada a esta entrada
      foreignKey: 'playlist_id' // Clave foránea en la tabla 'playlist_items' que apunta a la playlist
    });

    // Una entrada de PlaylistItem pertenece a un Item
    this.belongsTo(models.Item, {
      as: 'item', // Alias para acceder al Item asociado a esta entrada
      foreignKey: 'item_id' // Clave foránea en la tabla 'playlist_items' que apunta al item
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PLAYLIST_ITEM_TABLE,
      modelName: 'PlaylistItem', // ¡El nombre del modelo debe ser 'PlaylistItem'!
      timestamps: false, // Correcto, ya que solo tenemos 'added_at' y no 'createdAt'/'updatedAt' automáticos
      underscored: true
    };
  }
}

module.exports = { PLAYLIST_ITEM_TABLE, PlaylistItemSchema, PlaylistItem }; 