'use strict';

const { DataTypes } = require('sequelize');
const { USER_TABLE } = require('./../models/user_model'); // Importa el nombre de la tabla de tu modelo

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(USER_TABLE, 'imgbb_delete_url', {
      allowNull: true, // Permitir nulos porque los usuarios existentes no tendrán este valor
      type: DataTypes.STRING, // Usamos DataTypes.STRING porque es una URL
      field: 'imgbb_delete_url', // Nombre de la columna en la base de datos (snake_case)
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(USER_TABLE, 'imgbb_delete_url');
  }
};