'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('complejos', 'latitud', {
            type: Sequelize.DOUBLE,
            allowNull: true,
        });
        await queryInterface.addColumn('complejos', 'longitud', {
            type: Sequelize.DOUBLE,
            allowNull: true,
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('complejos', 'longitud');
        await queryInterface.removeColumn('complejos', 'latitud');
    },
};
