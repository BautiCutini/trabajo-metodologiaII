'use strict';

// Las columnas ya se crean en 20260929204857-create-reservas.js.
// Esta migración solo las agrega en bases creadas antes de ese cambio,
// así puede ejecutarse tanto en una base nueva como en una existente.
module.exports = {
  async up(queryInterface, Sequelize) {
    const columnas = await queryInterface.describeTable('reservas');

    if (!columnas.nombre_contacto) {
      await queryInterface.addColumn('reservas', 'nombre_contacto', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!columnas.telefono_contacto) {
      await queryInterface.addColumn('reservas', 'telefono_contacto', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  // No se borran en el down: las columnas pertenecen a la migración que crea la tabla
  async down() {},
};