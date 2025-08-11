'use strict';

const { DataTypes } = require('sequelize');
const { PLAYLIST_TABLE } = require('../models/playlist_model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(PLAYLIST_TABLE, 'thumbnail_url', {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'thumbnail_url'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(PLAYLIST_TABLE, 'thumbnail_url');
  }
};
