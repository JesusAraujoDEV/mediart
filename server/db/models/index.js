const { User, UserSchema } = require('./user_model');
const { Playlist, PlaylistSchema } = require('./playlist_model');
const { Item, ItemSchema } = require('./items_model');
const { UserFollow, UserFollowSchema } = require('./user_follow_model');
const { PlaylistItem, PlaylistItemSchema } = require('./playlist_item_model');
const { Library, LibrarySchema } = require('./library_model');

function setupModels(sequelize){
  User.init(UserSchema, User.config(sequelize));
  Playlist.init(PlaylistSchema, Playlist.config(sequelize));
  Item.init(ItemSchema, Item.config(sequelize));
  UserFollow.init(UserFollowSchema, UserFollow.config(sequelize));
  PlaylistItem.init(PlaylistItemSchema, PlaylistItem.config(sequelize));
  Library.init(LibrarySchema, Library.config(sequelize));

  User.associate(sequelize.models);

  Playlist.associate(sequelize.models);

  Item.associate(sequelize.models);

  UserFollow.associate(sequelize.models);

  PlaylistItem.associate(sequelize.models);

  Library.associate(sequelize.models);
}

module.exports = { setupModels };
