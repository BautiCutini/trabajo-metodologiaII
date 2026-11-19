'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('reservas', 'nombre_contacto', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('reservas', 'telefono_contacto', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('reservas', 'telefono_contacto');
    await queryInterface.removeColumn('reservas', 'nombre_contacto');
  },
};