
'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        
        try {
            
            await queryInterface.sequelize.query(`
                UPDATE reservas AS r
                SET horario_id = h.id
                FROM horarios AS h
                WHERE h.cancha_id = r.cancha_id
                  AND h.dia_semana =
                      EXTRACT(DOW FROM r.fecha_turno)::INTEGER
                  AND h.hora_inicio = r.hora_inicio
                  AND h.hora_fin = r.hora_fin;
            `, { transaction });
            
            const [resultado] = await queryInterface.sequelize.query(`
                SELECT COUNT(*) AS pendientes
                FROM reservas
                WHERE horario_id IS NULL;
            `, { transaction });
            
            if (Number(resultado[0].pendientes) > 0) {
                throw new Error(
                    'Hay reservas sin horario asociado. ' +
                    'No se puede completar la migración.'
                );
            }
            
            await queryInterface.changeColumn(
                'reservas',
                'horario_id',
                {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                { transaction }
            );
            
            await queryInterface.sequelize.query(`
                ALTER TABLE reservas
                DROP CONSTRAINT IF EXISTS reservas_horario_id_fkey;
            `, { transaction });
            
            await queryInterface.sequelize.query(`
                ALTER TABLE reservas
                ADD CONSTRAINT fk_reservas_horario_cancha
                FOREIGN KEY (horario_id, cancha_id)
                REFERENCES horarios (id, cancha_id)
                ON UPDATE CASCADE
                ON DELETE RESTRICT;
            `, { transaction });
            
            await transaction.commit();
        
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
    
    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        
        try {
            
            await queryInterface.sequelize.query(`
                ALTER TABLE reservas
                DROP CONSTRAINT IF EXISTS fk_reservas_horario_cancha;
            `, { transaction });
            
            await queryInterface.sequelize.query(`
                ALTER TABLE reservas
                ADD CONSTRAINT reservas_horario_id_fkey
                FOREIGN KEY (horario_id)
                REFERENCES horarios (id)
                ON UPDATE CASCADE
                ON DELETE RESTRICT;
            `, { transaction });
            
            await transaction.commit();
        
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
};
