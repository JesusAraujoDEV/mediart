const { Model, DataTypes, Sequelize } = require('sequelize');
const { USER_TABLE } = require('./user_model');

const PLAYLIST_TABLE = 'playlists'; // Definición de la tabla

const PlaylistSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  ownerUserId: {
    allowNull: false,
    field: 'owner_user_id',
    type: DataTypes.INTEGER,
    references: {
        model: USER_TABLE,
        key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  description: {
    allowNull: true,
    type: DataTypes.TEXT,
  },
  isCollaborative: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    field: 'is_collaborative'
  },
  thumbnailUrl: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'thumbnail_url'
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

class Playlist extends Model {
    static associate(models) {
      // Relación One-to-Many: Una Playlist pertenece a un User (dueño)
      this.belongsTo(models.User, {
        as: 'owner',
        foreignKey: 'owner_user_id'
      });
  
      // Relación Many-to-Many: Una Playlist tiene muchos Items (a través de playlist_items)
      this.belongsToMany(models.Item, {
        as: 'items',
        through: models.PlaylistItem,
        foreignKey: 'playlist_id',
        otherKey: 'item_id'
      });
  
      // ¡CORRECCIÓN AQUÍ!
      // Relación Many-to-Many: Una Playlist puede ser guardada por muchos Usuarios
      this.belongsToMany(models.User, {
        as: 'savedByUsers', // Alias para acceder a los usuarios que han guardado esta playlist
        through: models.Library, // La tabla intermedia es Library
        foreignKey: 'playlist_id', // Clave foránea en Library que apunta a Playlist
        otherKey: 'user_id' // Clave foránea en Library que apunta a User
      });

      this.belongsToMany(models.User, {
        as: 'collaborators', // Nuevo alias para acceder solo a los colaboradores
        through: {
            model: models.Library, // La tabla intermedia sigue siendo Library
            scope: {
                isCollaborator: true
            }
        },
        foreignKey: 'playlist_id',
        otherKey: 'user_id'
      });
    }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PLAYLIST_TABLE,
      modelName: 'Playlist',
      timestamps: true,
      underscored: true
    };
  }
}

module.exports = { PLAYLIST_TABLE, PlaylistSchema, Playlist };