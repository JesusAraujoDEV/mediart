const { Model, DataTypes, Sequelize } = require('sequelize');
const { USER_TABLE } = require('./user_model');

const FONT_TABLE = 'fonts-settings';

const FontSchema = {
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
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  titleSize: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  subtitleSize: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  paragraphSize: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  fontFamily: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  fontFilePath: {
    allowNull: false,
    type: DataTypes.STRING(512),
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  }
}

class Font extends Model {
    static associate(models) {
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId'
        });
    }

    static config(sequelize) {
        return {
          sequelize,
          tableName: FONT_TABLE,
          modelName: 'Font',
          timestamps: false,
        }
    }
}
    
module.exports = { FONT_TABLE, FontSchema, Font };

