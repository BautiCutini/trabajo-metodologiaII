'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("reservas", {
      fields: ["usuario_id"],
      type: "foreign key",
      name: "fk_reservas_usuario",
      references: {
        table: "usuarios",
        field: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT"
    });
    
    await queryInterface.addConstraint("reservas", {
      fields: ["cancha_id"],
      type: "foreign key",
      name: "fk_reservas_cancha",
      references: {
        table: "canchas",
        field: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT"
    });
    
    await queryInterface.addConstraint("pagos", {
      fields: ["reserva_id"],
      type: "foreign key",
      name: "fk_pagos_reserva",
      references: {
        table: "reservas",
        field: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT"
    });
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "pagos",
      "fk_pagos_reserva"
    );
    
    await queryInterface.removeConstraint(
      "reservas",
      "fk_reservas_cancha"
    );
    
    await queryInterface.removeConstraint(
      "reservas",
      "fk_reservas_usuario"
    );
  }
};