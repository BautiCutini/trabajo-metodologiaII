'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('horarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cancha_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'canchas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      dia_semana: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 6
        }
      },
      hora_inicio: {
        type: Sequelize.TIME,
        allowNull: false
      },
      hora_fin: {
        type: Sequelize.TIME,
        allowNull: false
      },
      estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
    });
    await queryInterface.sequelize.query(`
      ALTER TABLE horarios
      ADD CONSTRAINT check_horarios_dia_semana
      CHECK (dia_semana BETWEEN 0 AND 6);
      `);
      
      //Agrego una restriccion que permite que postgreSQL pueda verificar esa combinacion cuando creemos la clave foreana compuesta.
    await queryInterface.sequelize.query(`
      ALTER TABLE horarios
      ADD CONSTRAINT unique_horarios_id_cancha
      UNIQUE (id, cancha_id);
      `);
      
      //Agrego una restriccion que permite que postgreSQL pueda verificar que la hora de inicio sea menor a la hora de fin.
    await queryInterface.sequelize.query(`
      ALTER TABLE horarios
      ADD CONSTRAINT check_horarios_rango_horas
      CHECK (hora_inicio < hora_fin);
      `);
      
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('horarios');
  }
};


