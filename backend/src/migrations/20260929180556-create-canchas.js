'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('canchas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      
      tipo: {
        type: Sequelize.ENUM('techada', 'descubierta'),
        allowNull: false
      },
      
      capacidad: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      
      horarios: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      precio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      
      complejo_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('canchas');
  }
};
