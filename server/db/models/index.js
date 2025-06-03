const { User, UserSchema } = require('./user_model');
const { Font, FontSchema } = require('./font_model');
const { Color, ColorSchema } = require('./color_model');


function setupModels(sequelize){
  User.init(UserSchema, User.config(sequelize));
  Font.init(FontSchema, Font.config(sequelize));
  Color.init(ColorSchema, Color.config(sequelize));  

  User.associate(sequelize.models);
  Font.associate(sequelize.models);
  Color.associate(sequelize.models);

}

module.exports = { setupModels };
