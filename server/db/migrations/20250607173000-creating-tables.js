'use strict';

const { UserSchema, USER_TABLE } = require('./../models/user_model')
const { ItemSchema, ITEM_TABLE } = require('./../models/item_model')
const { PlaylistSchema, PLAYLIST_TABLE } = require('./../models/playlist_model')
const { UserFollowSchema, USER_FOLLOW_TABLE } = require('./../models/user_follow_model')
const { LibrarySchema, LIBRARY_TABLE } = require('./../models/library_model')
const { PlaylistItemSchema, PLAYLIST_ITEM_TABLE } = require('./../models/playlist_item_model')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Primero creamos las tablas principales
    await queryInterface.createTable(USER_TABLE, UserSchema);
    await queryInterface.createTable(ITEM_TABLE, ItemSchema);
    await queryInterface.createTable(PLAYLIST_TABLE, PlaylistSchema);
    
    // Luego las tablas de relaciones
    await queryInterface.createTable(USER_FOLLOW_TABLE, UserFollowSchema);
    await queryInterface.createTable(LIBRARY_TABLE, LibrarySchema);
    await queryInterface.createTable(PLAYLIST_ITEM_TABLE, PlaylistItemSchema);
  },

  async down (queryInterface, Sequelize) {
    // Eliminamos las tablas en orden inverso para respetar las dependencias
    await queryInterface.dropTable(PLAYLIST_ITEM_TABLE);
    await queryInterface.dropTable(LIBRARY_TABLE);
    await queryInterface.dropTable(USER_FOLLOW_TABLE);
    await queryInterface.dropTable(PLAYLIST_TABLE);
    await queryInterface.dropTable(ITEM_TABLE);
    await queryInterface.dropTable(USER_TABLE);
  }
};
