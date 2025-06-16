'use strict';

const { DataTypes, Sequelize } = require('sequelize'); // Importa Sequelize aquí si no está

const { ITEM_TABLE } = require('./../models/item_model'); // Asegúrate de que coincida con el nombre de tu tabla


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Eliminar la columna 'vibe_tags'
    await queryInterface.removeColumn(ITEM_TABLE, 'vibe_tags');
    console.log(`Column 'vibe_tags' removed from table '${ITEM_TABLE}'`);

    // 2. Añadir la columna 'external_url'
    await queryInterface.addColumn(ITEM_TABLE, 'external_url', {
      allowNull: true,
      type: DataTypes.TEXT,
      unique: false,
    });
    console.log(`Column 'external_url' added to table '${ITEM_TABLE}'`);
  },

  async down (queryInterface, Sequelize) {
    // En caso de querer revertir la migración:
    // 1. Eliminar la columna 'external_url'
    await queryInterface.removeColumn(ITEM_TABLE, 'external_url');
    console.log(`Column 'external_url' removed from table '${ITEM_TABLE}'`);

    // 2. Añadir de nuevo la columna 'vibe_tags'
    await queryInterface.addColumn(ITEM_TABLE, 'vibe_tags', {
      allowNull: true,
      type: DataTypes.JSONB, // Asegúrate de que el tipo de dato sea el original
    });
    console.log(`Column 'vibe_tags' added back to table '${ITEM_TABLE}'`);
  }
};
