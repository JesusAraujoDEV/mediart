const { Model, DataTypes, Sequelize } = require('sequelize');
const { USER_TABLE } = require('./user_model');

const USER_FOLLOW_TABLE = 'user_follows';

const UserFollowSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  followerUserId: {
    field: 'follower_user_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
        model: USER_TABLE,
        key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  followedUserId: {
    field: 'followed_user_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
        model: USER_TABLE,
        key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
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

class UserFollow extends Model {
    static associate(models) {
      // Una entrada de UserFollow pertenece al usuario que está SIGUIENDO
      this.belongsTo(models.User, {
        as: 'follower', // Alias para el usuario que está siguiendo
        foreignKey: 'follower_user_id' // Clave foránea que apunta al seguidor
      });

      // Una entrada de UserFollow pertenece al usuario que está SIENDO SEGUIDO
      this.belongsTo(models.User, {
        as: 'followed', // Alias para el usuario que está siendo seguido
        foreignKey: 'followed_user_id' // Clave foránea que apunta al seguido
      });
    }

    static config(sequelize) {
        return {
          sequelize,
          tableName: USER_FOLLOW_TABLE,
          modelName: 'UserFollow',
          timestamps: true, // Deja que Sequelize maneje 'createdAt' automáticamente
          underscored: true // Para mapear camelCase a snake_case en la BD
        }
    }
}
    
module.exports = { USER_FOLLOW_TABLE, UserFollowSchema, UserFollow };

