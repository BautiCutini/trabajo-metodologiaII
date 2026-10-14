'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("usuarios", "complejo_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "complejos",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT"
    });
    await queryInterface.addConstraint("canchas", {
      fields: ["complejo_id"],
      type: "foreign key",
      name: "fk_canchas_complejo",
      references: {
        table: "complejos",
        field: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT"
    });
  },
  
  async down(queryInterface, Sequelize) {
    
    await queryInterface.removeConstraint(
      "canchas",
      "fk_canchas_complejo"
      );
      
    await queryInterface.removeColumn("usuarios", "complejo_id");
  }
  }