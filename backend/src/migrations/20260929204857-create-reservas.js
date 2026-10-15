'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('reservas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      
      // Agregué el campo usuario_id como opcional para permitir reservas sin un usuario asociado, como pueden ser reservas realizadas por el encargado de un complejo mediante un cliente que le solicitó la reserva por teléfono o por whatsapp.
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      
      // agregue estos dos campos para poder guardar el nombre y telefono del contacto en caso de que la reserva no tenga un usuario asociado.
      nombre_contacto: {
        type: Sequelize.STRING,
        allowNull: true
      },
      
      telefono_contacto: {
        type: Sequelize.STRING,
        allowNull: true
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
