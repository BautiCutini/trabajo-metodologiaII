
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('complejos', [
      {
        nombre: 'Complejo Deportivo Norte',
        direccion: 'Av. Alem 1200',
        telefono: '2914000001',
        descripcion: 'Complejo deportivo con canchas para alquiler',
        imagen_url: null,
        estado: 'ACTIVO'
      },
      {
        nombre: 'Complejo Deportivo Sur',
        direccion: 'Av. Independencia 850',
        telefono: '2914000002',
        descripcion: 'Complejo deportivo para fútbol recreativo',
        imagen_url: null,
        estado: 'ACTIVO'
      },
      {
        nombre: 'Complejo Deportivo Central',
        direccion: 'Calle San Martín 890',
        telefono: '2914000003',
        descripcion: 'Complejo con instalaciones para actividades deportivas',
        imagen_url: null,
        estado: 'ACTIVO'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('complejos', {
      nombre: [
        'Complejo Deportivo Norte',
        'Complejo Deportivo Sur',
        'Complejo Deportivo Central'
      ]
    }, {});
  }
};
