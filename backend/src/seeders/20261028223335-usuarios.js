'use strict';
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      throw new Error(
        'Falta definir ADMIN_PASSWORD en las variables de entorno.'
      );
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const now = new Date();

    await queryInterface.bulkInsert('usuarios', [
      {
        nombre: 'Francesco',
        apellido: 'Administrador',
        email: 'francescodicarl@gmail.com',
        password: passwordHash,
        telefono: '2900000000',
        rol: 'ADMIN_PLATAFORMA',
        complejo_id: null,
        imagen_url: null,
        estado: 'ACTIVO'
      },
      {
        nombre: 'Juan',
        apellido: 'Jugador',
        email: 'juan.jugador@example.com',
        password: passwordHash,
        telefono: '2900000001',
        rol: 'JUGADOR',
        complejo_id: null,
        imagen_url: null,
        estado: 'ACTIVO'
      },
      {
        nombre: 'Carlos',
        apellido: 'Encargado',
        email: 'carlos.encargado@example.com',
        password: passwordHash,
        telefono: '2900000002',
        rol: 'ENCARGADO',
        complejo_id: null,
        imagen_url: null,
        estado: 'ACTIVO'
      },
      {
        nombre: 'María',
        apellido: 'Administradora',
        email: 'maria.admin@example.com',
        password: passwordHash,
        telefono: '2900000003',
        rol: 'ADMIN_COMPLEJO',
        complejo_id: null,
        imagen_url: null,
        estado: 'ACTIVO'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', {
      email: [
        'francescodicarl@gmail.com',
        'juan.jugador@example.com',
        'carlos.encargado@example.com',
        'maria.admin@example.com'
      ]
    }, {});
  }
};
