'use strict';

const { DataTypes, Sequelize } = require('sequelize');

const { LIBRARY_TABLE } = require('./../models/library_model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(LIBRARY_TABLE, 'is_collaborator', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    console.log(`Column 'is_collaborator' added to table '${LIBRARY_TABLE}'`);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(LIBRARY_TABLE, 'is_collaborators');
    console.log(`Column 'is_collaborator' removed from table '${LIBRARY_TABLE}'`);
  }
};
