
'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
    const fechaTurno = '2026-11-02';

    await queryInterface.bulkInsert('reservas', [
        {
        usuario_id: 2,
        cancha_id: 1,
        horario_id: 1,
        fecha_turno: fechaTurno,
        fecha_reserva: new Date(),
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        estado: 'CONFIRMADA'
        },
        {
        usuario_id: 2,
        cancha_id: 2,
        horario_id: 3,
        fecha_turno: fechaTurno,
        fecha_reserva: new Date(),
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        estado: 'PENDIENTE'
        },
        {
        usuario_id: 2,
        cancha_id: 3,
        horario_id: 5,
        fecha_turno: fechaTurno,
        fecha_reserva: new Date(),
        hora_inicio: '18:00:00',
        hora_fin: '19:00:00',
        estado: 'CANCELADA'
        }
    ], {});
    },

    async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('reservas', {
        [Sequelize.Op.or]: [
        {
            usuario_id: 2,
            cancha_id: 1,
            horario_id: 1,
            fecha_turno: '2026-11-02',
            hora_inicio: '09:00:00',
            hora_fin: '10:00:00',
            estado: 'CONFIRMADA'
        },
        {
            usuario_id: 2,
            cancha_id: 2,
            horario_id: 3,
            fecha_turno: '2026-11-02',
            hora_inicio: '09:00:00',
            hora_fin: '10:00:00',
            estado: 'PENDIENTE'
        },
        {
            usuario_id: 2,
            cancha_id: 3,
            horario_id: 5,
            fecha_turno: '2026-11-02',
            hora_inicio: '18:00:00',
            hora_fin: '19:00:00',
            estado: 'CANCELADA'
        }
        ]
    }, {});
    }
};
