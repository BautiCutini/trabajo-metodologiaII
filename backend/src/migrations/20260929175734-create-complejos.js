'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('complejos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      
      direccion: {
        type: Sequelize.STRING,
        allowNull: false
      },
      
      telefono: {
        type: Sequelize.STRING,
        allowNull: false
      },
      
      descripcion: {
        type: Sequelize.STRING,
        allowNull: false
      },
  });
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('complejos');
  }
};
