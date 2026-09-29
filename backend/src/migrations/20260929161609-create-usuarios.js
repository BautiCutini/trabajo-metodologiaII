"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("usuarios", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      
      apellido: {
        type: Sequelize.STRING,
        allowNull: false
      },
      
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }, 
      
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      
      telefono: {
        type: Sequelize.STRING,
        allowNull: false
      },
      
      rol: {
        type: Sequelize.ENUM(
          "JUGADOR",
          "ENCARGADO",
          "ADMIN_COMPLEJO",
          "ADMIN_PLATAFORMA"
        ),
        allowNull: false
      }
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("usuarios");
  }
};