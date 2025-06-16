const { Model, DataTypes, Sequelize } = require('sequelize');
const { USER_TABLE } = require('./user_model');
const { PLAYLIST_TABLE } = require('./playlist_model');

const LIBRARY_TABLE = 'library';

const LibrarySchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  userId: {
    field: 'user_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: USER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  playlistId: {
    field: 'playlist_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: PLAYLIST_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  savedAt: {
    field: 'saved_at',
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  isCollaborator: {
    field: 'is_collaborator',
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
};

class Library extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'user_id'
    });

    this.belongsTo(models.Playlist, {
      as: 'playlist',
      foreignKey: 'playlist_id'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: LIBRARY_TABLE,
      modelName: 'Library',
      timestamps: false,
      underscored: true
    };
  }
}

module.exports = { LIBRARY_TABLE, LibrarySchema, Library };