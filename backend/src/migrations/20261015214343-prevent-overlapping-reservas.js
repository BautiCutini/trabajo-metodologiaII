
'use strict';

module.exports = {
  async up(queryInterface) {
    // Habilito el soporte necesario para comparar
    // canchas e intervalos de tiempo.
    await queryInterface.sequelize.query(`
      CREATE EXTENSION IF NOT EXISTS btree_gist;
    `);

    // Evito reservas superpuestas para una misma cancha.
    // Las reservas canceladas no bloquean el horario.
    // [) permite que un turno termine cuando empieza el siguiente.
    await queryInterface.sequelize.query(`
      ALTER TABLE reservas
      ADD CONSTRAINT reservas_no_superpuestas
      EXCLUDE USING gist (
        cancha_id WITH =,
        tsrange(
          (fecha_turno + hora_inicio),
          (fecha_turno + hora_fin),
          '[)'
        ) WITH &&
      )
      WHERE (estado <> 'CANCELADA');
    `);
  },

  async down(queryInterface) {
    // Elimino la restricción de superposición.
    await queryInterface.sequelize.query(`
      ALTER TABLE reservas
      DROP CONSTRAINT IF EXISTS reservas_no_superpuestas;
    `);
  },
};
