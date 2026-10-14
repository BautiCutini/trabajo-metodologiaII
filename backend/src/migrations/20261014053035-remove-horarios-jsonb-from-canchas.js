
'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Eliminé la columna JSONB porque ahora los horarios se administran en su propia tabla.
        await queryInterface.removeColumn('canchas', 'horarios');
    },
    
    async down(queryInterface, Sequelize) {
        // Restablezco la columna anterior si necesito revertir esta migración.
        await queryInterface.addColumn('canchas', 'horarios', {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: []
        });
    }
};
