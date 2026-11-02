
'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('pagos', [
        {
        reserva_id: 1,
        monto: 25000,
        fecha: new Date(),
        metodo_pago: 'TRANSFERENCIA',
        estado: 'CONFIRMADO',
        comprobante_url: null
        },
        {
        reserva_id: 2,
        monto: 35000,
        fecha: new Date(),
        metodo_pago: 'MERCADOPAGO',
        estado: 'PENDIENTE',
        comprobante_url: null
        },
        {
        reserva_id: 3,
        monto: 28000,
        fecha: new Date(),
        metodo_pago: 'TRANSFERENCIA',
        estado: 'RECHAZADO',
        comprobante_url: null
        }
    ], {});
    },

    async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pagos', {
        [Sequelize.Op.or]: [
        {
            reserva_id: 1,
            monto: 25000,
            metodo_pago: 'TRANSFERENCIA',
            estado: 'CONFIRMADO'
        },
        {
            reserva_id: 2,
            monto: 35000,
            metodo_pago: 'MERCADOPAGO',
            estado: 'PENDIENTE'
        },
        {
            reserva_id: 3,
            monto: 28000,
            metodo_pago: 'TRANSFERENCIA',
            estado: 'RECHAZADO'
        }
        ]
    }, {});
    }
};
