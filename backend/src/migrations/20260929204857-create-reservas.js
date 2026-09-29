'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('reservas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      
      cancha_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      
      fecha_turno : {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      
      fecha_reserva : {
        type: Sequelize.DATE,
        allowNull: false
      },
      
      hora_inicio : {
        type: Sequelize.TIME,
        allowNull: false
      },
      
      hora_fin : {
        type: Sequelize.TIME,
        allowNull: false
      },
      
      estado: {
        type: Sequelize.ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA'),
        allowNull: false
      },
    });
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('reservas');
  }
};
