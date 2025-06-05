const { Model, DataTypes, Sequelize } = require('sequelize');

const USER_TABLE = 'users';

const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  username: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  passwordHash: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'password_hash'
  },
  profilePictureUrl: {
    allowNull: true,
    type: DataTypes.TEXT,
    field: 'profile_picture_url'
  },
  bio: {
    allowNull: true,
    type: DataTypes.TEXT
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
}

class User extends Model {
  static associate(models) {
    // Un usuario es dueño de muchas Playlists
    this.hasMany(models.Playlist, {
      as: 'ownedPlaylists',
      foreignKey: 'owner_user_id'
    });

    // Un usuario tiene muchas entradas en su Biblioteca (Library)
    this.hasMany(models.Library, {
      as: 'savedPlaylists',
      foreignKey: 'user_id'
    });

    // Relación de muchos a muchos consigo mismo para 'seguir'
    // Alias para los usuarios a los que este usuario SIGUE
    this.belongsToMany(models.User, {
      as: 'followingUsers',
      through: models.UserFollow, // La tabla intermedia 'user_follows'
      foreignKey: 'follower_user_id', // En user_follows, 'follower_user_id' es el que sigue
      otherKey: 'followed_user_id' // En user_follows, 'followed_user_id' es el que es seguido
    });

    // Alias para los usuarios que SIGUEN a este usuario
    this.belongsToMany(models.User, {
      as: 'followersUsers',
      through: models.UserFollow, // La tabla intermedia 'user_follows'
      foreignKey: 'followed_user_id', // En user_follows, 'followed_user_id' es el que es seguido (este usuario)
      otherKey: 'follower_user_id' // En user_follows, 'follower_user_id' es el que sigue (el otro usuario)
    });

    // Si quieres un acceso directo a los registros de la tabla intermedia 'user_follows':
    this.hasMany(models.UserFollow, {
        as: 'initiatedFollows', // Las relaciones de seguimiento donde este usuario es el que inicia
        foreignKey: 'follower_user_id'
    });
    this.hasMany(models.UserFollow, {
        as: 'receivedFollows', // Las relaciones de seguimiento donde este usuario es el seguido
        foreignKey: 'followed_user_id'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: true, // Cambiado a true para que Sequelize gestione createdAt y updatedAt
      underscored: true, // Añadido para mapear camelCase a snake_case en la BD
    }
  }
}

module.exports = { USER_TABLE, UserSchema, User };