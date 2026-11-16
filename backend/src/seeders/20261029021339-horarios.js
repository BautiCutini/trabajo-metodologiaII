
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('horarios', [
      // Cancha 1: Fútbol 5 descubierta
      {
        cancha_id: 1,
        dia_semana: 1,
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        estado: true
      },
      {
        cancha_id: 1,
        dia_semana: 1,
        hora_inicio: '10:00:00',
        hora_fin: '11:00:00',
        estado: true
      },

      // Cancha 2: Fútbol 7 descubierta
      {
        cancha_id: 2,
        dia_semana: 1,
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        estado: true
      },
      {
        cancha_id: 2,
        dia_semana: 1,
        hora_inicio: '10:00:00',
        hora_fin: '11:00:00',
        estado: true
      },

      // Cancha 3: Fútbol 5 techada
      {
        cancha_id: 3,
        dia_semana: 1,
        hora_inicio: '18:00:00',
        hora_fin: '19:00:00',
        estado: true
      },
      {
        cancha_id: 3,
        dia_semana: 1,
        hora_inicio: '19:00:00',
        hora_fin: '20:00:00',
        estado: true
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('horarios', {
      cancha_id: [1, 2, 3],
      dia_semana: 1
    }, {});
  }
};
