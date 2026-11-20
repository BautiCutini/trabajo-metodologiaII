'use strict';

require('dotenv').config({
path: require('path').resolve(__dirname, '../../../.env')
});

const bcrypt = require('bcryptjs');

module.exports = {
async up(queryInterface, Sequelize) {
    const password = process.env.DEMO_PASSWORD;

    if (!password) {
        throw new Error('Falta definir DEMO_PASSWORD en backend/.env');
    }

    // Busca un registro por sus campos únicos y devuelve su ID.
    async function buscarId(tabla, condiciones) {
        const columnas = Object.keys(condiciones);

        const where = columnas
        .map((columna) => `"${columna}" = :${columna}`)
        .join(' AND ');

        const sql = `
        SELECT id
        FROM "${tabla}"
        WHERE ${where}
        LIMIT 1
        `;

        const [resultados] = await queryInterface.sequelize.query(sql, {
        replacements: condiciones
        });

        return resultados[0]?.id ?? null;
    }

    async function crearSiNoExiste(tabla, condiciones, datos) {
        let id = await buscarId(tabla, condiciones);

        if (id) {
        return id;
        }

        await queryInterface.bulkInsert(tabla, [datos]);

        id = await buscarId(tabla, condiciones);

        if (!id) {
        throw new Error(`No se pudo recuperar el ID de ${tabla}`);
        }

        return id;
    }

    const fecha = new Date();
    const diasHastaLunes = ((8 - fecha.getDay()) % 7) || 7;

    fecha.setDate(fecha.getDate() + diasHastaLunes);

    const fechaTurno = [
        fecha.getFullYear(),
        String(fecha.getMonth() + 1).padStart(2, '0'),
        String(fecha.getDate()).padStart(2, '0')
    ].join('-');

    const complejoId = await crearSiNoExiste(
        'complejos',
        { nombre: 'COMPLEJO DEMO - RESERVAS MSII' },
        {
        nombre: 'COMPLEJO DEMO - RESERVAS MSII',
        direccion: 'Av. Demo 100',
        telefono: '2914000099',
        descripcion: 'Complejo utilizado para demostraciones de reservas',
        imagen_url: null,
        latitud: -38.7183,
        longitud: -62.2662,
        estado: 'ACTIVO'
        }
    );

    const passwordHash = await bcrypt.hash(password, 10);

    const jugador1Id = await crearSiNoExiste(
        'usuarios',
        { email: 'jugador1.demo@example.com' },
        {
        nombre: 'Jugador',
        apellido: 'Demo Uno',
        email: 'jugador1.demo@example.com',
        password: passwordHash,
        telefono: '2914000101',
        rol: 'JUGADOR',
        complejo_id: null,
        imagen_url: null,
        estado: 'ACTIVO'
        }
    );

    const jugador2Id = await crearSiNoExiste(
        'usuarios',
        { email: 'jugador2.demo@example.com' },
        {
        nombre: 'Jugador',
        apellido: 'Demo Dos',
        email: 'jugador2.demo@example.com',
        password: passwordHash,
        telefono: '2914000102',
        rol: 'JUGADOR',
        complejo_id: null,
        imagen_url: null,
        estado: 'ACTIVO'
        }
    );

    const encargadoId = await crearSiNoExiste(
        'usuarios',
        { email: 'encargado.demo@example.com' },
        {
        nombre: 'Encargado',
        apellido: 'Demo',
        email: 'encargado.demo@example.com',
        password: passwordHash,
        telefono: '2914000103',
        rol: 'ENCARGADO',
        complejo_id: complejoId,
        imagen_url: null,
        estado: 'ACTIVO'
        }
    );

    const canchaId = await crearSiNoExiste(
        'canchas',
        {
        nombre: 'Cancha Demo Fútbol 5',
        complejo_id: complejoId
        },
        {
        nombre: 'Cancha Demo Fútbol 5',
        tipo: 'descubierta',
        capacidad: 10,
        precio: 25000,
        complejo_id: complejoId,
        imagen_url: 'https://placehold.co/600x400?text=Cancha+Demo',
        estado: 'ACTIVO'
        }
    );

    const horarios = [
        ['09:00:00', '10:00:00'],
        ['10:00:00', '11:00:00'],
        ['11:00:00', '12:00:00']
    ];

    const horariosIds = [];

    for (const [horaInicio, horaFin] of horarios) {
        const horarioId = await crearSiNoExiste(
        'horarios',
        {
            cancha_id: canchaId,
            dia_semana: 1,
            hora_inicio: horaInicio,
            hora_fin: horaFin
        },
        {
            cancha_id: canchaId,
            dia_semana: 1,
            hora_inicio: horaInicio,
            hora_fin: horaFin,
            estado: true
        }
        );

        horariosIds.push(horarioId);
    }

    const reservaExistenteId = await buscarId('reservas', {
        usuario_id: jugador1Id,
        cancha_id: canchaId,
        horario_id: horariosIds[0],
        fecha_turno: fechaTurno
    });

    if (!reservaExistenteId) {
        await queryInterface.bulkInsert('reservas', [
        {
            usuario_id: jugador1Id,
            nombre_contacto: null,
            telefono_contacto: null,
            cancha_id: canchaId,
            horario_id: horariosIds[0],
            fecha_turno: fechaTurno,
            fecha_reserva: new Date(),
            hora_inicio: '09:00:00',
            hora_fin: '10:00:00',
            estado: 'CONFIRMADA'
        }
    ]);
    }
    
    console.log('======================================');
    console.log('DATOS DE DEMOSTRACIÓN CARGADOS');
    console.log('Fecha de reservas:', fechaTurno);
    console.log('Complejo ID:', complejoId);
    console.log('Cancha ID:', canchaId);
    console.log('Jugador 1 ID:', jugador1Id);
    console.log('Jugador 2 ID:', jugador2Id);
    console.log('Encargado ID:', encargadoId);
    console.log('Horarios:', horariosIds);
    console.log('======================================');
    },
    async down() {
    }
};