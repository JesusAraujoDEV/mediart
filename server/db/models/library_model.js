const { Model, DataTypes, Sequelize } = require('sequelize');
const { USER_TABLE } = require('./user_model'); // Asegúrate que 'user_model' exporta USER_TABLE
const { PLAYLIST_TABLE } = require('./playlist_model'); // Asegúrate que 'playlist_model' exporta PLAYLIST_TABLE

const LIBRARY_TABLE = 'library'; // Corregido a 'library' según tu DBML y la tabla

const LibrarySchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  userId: { // ID del usuario que guardó la playlist
    field: 'user_id', // Nombre de la columna en la BD
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: USER_TABLE, // Referencia la tabla de usuarios
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE' // Si el usuario es eliminado, se borran sus entradas de librería
  },
  playlistId: { // ID de la playlist guardada
    field: 'playlist_id', // Nombre de la columna en la BD
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: PLAYLIST_TABLE, // Referencia la tabla de playlists
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE' // Si la playlist es eliminada, se borran sus entradas de librería
  },
  savedAt: { // Nombre del campo en tu DBML es 'saved_at'
    field: 'saved_at', // Nombre de la columna en la BD
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  // No necesitamos 'updatedAt' en esta tabla de unión según tu DBML.
};

class Library extends Model { // ¡La clase debe ser Library!
  static associate(models) {
    // Una entrada de Library pertenece a un Usuario (el que la guarda)
    this.belongsTo(models.User, {
      as: 'user', // Alias para acceder al usuario que guardó la playlist
      foreignKey: 'user_id' // Clave foránea en la tabla 'library' que apunta al usuario
    });

    // Una entrada de Library pertenece a una Playlist (la que fue guardada)
    this.belongsTo(models.Playlist, {
      as: 'playlist', // Alias para acceder a la playlist que fue guardada
      foreignKey: 'playlist_id' // Clave foránea en la tabla 'library' que apunta a la playlist
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: LIBRARY_TABLE,
      modelName: 'Library', // El nombre del modelo debe ser 'Library'
      timestamps: false, // Tu DBML solo tiene 'saved_at', no 'created_at' ni 'updated_at' automáticos.
      underscored: true // Para mapear camelCase a snake_case en la BD
    };
  }
}

module.exports = { LIBRARY_TABLE, LibrarySchema, Library };