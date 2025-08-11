'use strict';

const { DataTypes } = require('sequelize');
const { PLAYLIST_TABLE } = require('./../models/playlist_model'); // Importa el nombre de la tabla de tu modelo

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Renombrar la columna 'thumbnail_url' a 'playlist_cover_url'
    await queryInterface.renameColumn(
      PLAYLIST_TABLE,
      'thumbnail_url', // Nombre actual de la columna
      'playlist_cover_url' // Nuevo nombre de la columna
    );
    console.log(`Column 'thumbnail_url' in '${PLAYLIST_TABLE}' renamed to 'playlist_cover_url'.`);

    // 2. Añadir la nueva columna 'imgbb_delete_url'
    await queryInterface.addColumn(PLAYLIST_TABLE, 'imgbb_delete_url', {
      allowNull: true, // Permitir nulos porque las playlists existentes no tendrán este valor
      type: DataTypes.STRING, // Es una URL
      field: 'imgbb_delete_url', // Nombre de la columna en la base de datos (snake_case)
    });
    console.log(`Column 'imgbb_delete_url' added to '${PLAYLIST_TABLE}'.`);
  },

  async down (queryInterface, Sequelize) {
    // 1. Revertir la adición de 'imgbb_delete_url'
    await queryInterface.removeColumn(PLAYLIST_TABLE, 'imgbb_delete_url');
    console.log(`Column 'imgbb_delete_url' removed from '${PLAYLIST_TABLE}'.`);

    // 2. Revertir el renombramiento: renombrar 'playlist_cover_url' de vuelta a 'thumbnail_url'
    await queryInterface.renameColumn(
      PLAYLIST_TABLE,
      'playlist_cover_url', // Nombre actual de la columna
      'thumbnail_url' // Nombre al que se revertirá
    );
    console.log(`Column 'playlist_cover_url' in '${PLAYLIST_TABLE}' renamed back to 'thumbnail_url'.`);
  }
};