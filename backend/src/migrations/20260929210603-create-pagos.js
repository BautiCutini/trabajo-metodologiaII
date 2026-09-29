'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('pagos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      
      reserva_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      
      monto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      
      fecha: {
        type: Sequelize.DATE,
        allowNull: false
      },
      
      metodo_pago: {
        type: Sequelize.ENUM('MERCADOPAGO','TRANSFERENCIA'),
        allowNull: false
      },
      
      estado: {
        type: Sequelize.ENUM('PENDIENTE', 'CONFIRMADO', 'RECHAZADO'),
        allowNull: false
      }
    });
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('pagos');
  }
};
