'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('usuarios', 'imagen_url', {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('usuarios', 'imagen_url', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },
};