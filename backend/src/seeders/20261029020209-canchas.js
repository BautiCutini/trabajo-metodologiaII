
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('canchas', [
      {
        nombre: 'Cancha de Fútbol 5',
        tipo: 'descubierta',
        capacidad: 10,
        precio: 25000,
        complejo_id: 1,
        imagen_url: 'https://example.com/cancha-futbol-5.jpg',
        estado: 'ACTIVO'
      },
      {
        nombre: 'Cancha de Fútbol 7',
        tipo: 'descubierta',
        capacidad: 14,
        precio: 35000,
        complejo_id: 1,
        imagen_url: 'https://example.com/cancha-futbol-7.jpg',
        estado: 'ACTIVO'
      },
      {
        nombre: 'Cancha de Fútbol 5 Cubierta',
        tipo: 'techada',
        capacidad: 10,
        precio: 28000,
        complejo_id: 2,
        imagen_url: 'https://example.com/cancha-cubierta.jpg',
        estado: 'ACTIVO'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('canchas', {
      nombre: [
        'Cancha de Fútbol 5',
        'Cancha de Fútbol 7',
        'Cancha de Fútbol 5 Cubierta'
      ]
    }, {});
  }
};
