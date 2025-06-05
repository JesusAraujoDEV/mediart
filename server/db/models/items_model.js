const { Model, DataTypes, Sequelize } = require('sequelize');

const ITEM_TABLE = 'items'; // Definición de la tabla

const ItemSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  title: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  type: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'unspecified',
  },
  description: {
    allowNull: true,
    type: DataTypes.TEXT,
  },
  coverUrl: {
    allowNull: true,
    type: DataTypes.TEXT,
    field: 'cover_url',
  },
  releaseDate: {
    allowNull: true,
    type: DataTypes.DATEONLY,
    field: 'release_date',
  },
  externalId: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'external_id',
  },
  externalSource: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'external_source',
  },
  avgRating: {
    allowNull: true,
    type: DataTypes.DECIMAL,
    field: 'avg_rating',
  },
  vibeTags: {
    allowNull: true,
    type: DataTypes.JSONB,
    field: 'vibe_tags',
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: Sequelize.NOW,
  }
};

class Item extends Model {
  static associate(models) {
    // Relación de muchos a muchos con Playlist a través de PlaylistItem
    this.belongsToMany(models.Playlist, {
      as: 'playlists', // Alias para la relación cuando accedes desde Item
      through: models.PlaylistItem, // El modelo de la tabla intermedia
      foreignKey: 'item_id', // Clave foránea en PlaylistItem que apunta a Item
      otherKey: 'playlist_id' // Clave foránea en PlaylistItem que apunta a Playlist
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ITEM_TABLE,
      modelName: 'Item',
      timestamps: true,
      underscored: true
    };
  }
}

module.exports = { ITEM_TABLE, ItemSchema, Item };