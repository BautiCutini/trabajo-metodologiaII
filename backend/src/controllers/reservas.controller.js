const {
    Reserva,
    Usuario,
    Cancha,
    Complejo,
    Horario
} = require('../models');

const {
    leerPaginacion,
    respuestaPaginada
} = require('../utils/paginacion');

const CAMPOS_ORDENABLES = [
    'id',
    'fecha_turno',
    'fecha_reserva',
    'hora_inicio',
    'estado'
];

const { Op } = require('sequelize');

async function listar(req, res) {
    try {
        const {
            page,
            limit,
            offset,
            order
        } = leerPaginacion(
            req.query,
            CAMPOS_ORDENABLES,
            'fecha_turno'
        );
        
        const where = {};
        
        const rol = req.usuario.rol;
        
        if (rol === 'JUGADOR') {
            where.usuario_id = req.usuario.id;
        }
        
        if (req.query.estado) {
            const estado = req.query.estado.toUpperCase();
            const estadosValidos = [
                'PENDIENTE',
                'CONFIRMADA',
                'CANCELADA'
            ];
            
            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({
                    error: 'Estado inválido'
                });
            }
            
            where.estado = estado;
        }
        
        if (req.query.usuario_id) {
            const usuarioId = Number(req.query.usuario_id);
            
            if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
                return res.status(400).json({
                    error: 'usuario_id debe ser un entero positivo'
                });
            }
            
            where.usuario_id = usuarioId;
        }
        
        if (req.query.cancha_id) {
            const canchaId = Number(req.query.cancha_id);
            
            if (!Number.isInteger(canchaId) || canchaId <= 0) {
                return res.status(400).json({
                    error: 'cancha_id debe ser un entero positivo'
                });
            }
            
            where.cancha_id = canchaId;
        }
        
        if (req.query.fecha) {
            where.fecha_turno = req.query.fecha;
        }
        
        const { rows, count } = await Reserva.findAndCountAll({
            where,
            include: [
                { model: Usuario },
                {
                    model: Cancha,
                    where: ['ENCARGADO', 'ADMIN_COMPLEJO'].includes(rol)
                        ? { complejo_id: req.usuario.complejo_id }
                        : undefined,
                    required: ['ENCARGADO', 'ADMIN_COMPLEJO'].includes(rol),
                    include: [{ model: Complejo }]
                },
                { model: Horario }
            ],
            order,
            limit,
            offset
        });
        
        return res.json(
            respuestaPaginada(rows, count, page, limit)
        );
    
    } catch (error) {
        console.error(error);
        
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
}

async function obtener(req, res) {
    try {
        const id = Number(req.params.id);
        
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: 'El id debe ser un entero positivo'
            });
        }
        
        const rol = req.usuario.rol;
        
        const reserva = await Reserva.findByPk(id, {
            include: [
                { model: Usuario },
                {
                    model: Cancha,
                    where: ['ENCARGADO', 'ADMIN_COMPLEJO'].includes(rol)
                        ? { complejo_id: req.usuario.complejo_id }
                        : undefined,
                    required: ['ENCARGADO', 'ADMIN_COMPLEJO'].includes(rol),
                    include: [{ model: Complejo }]
                },
                { model: Horario }
            ],
            where: rol === 'JUGADOR'
                ? { usuario_id: req.usuario.id }
                : undefined
        });
        
        if (!reserva) {
            return res.status(404).json({
                error: 'Reserva no encontrada'
            });
        }
        
        return res.json(reserva);
    
    } catch (error) {
        console.error(error);
        
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
}

async function crear(req, res) {
    try {
        const {
            fecha_turno,
            cancha_id,
            horario_id
        } = req.body;
        
        const canchaId = Number(cancha_id);
        const horarioId = Number(horario_id);
        
        if (
            !Number.isInteger(canchaId) || canchaId <= 0 ||
            !Number.isInteger(horarioId) || horarioId <= 0
        ) {
            return res.status(400).json({
                error: 'cancha_id y horario_id deben ser enteros positivos'
            });
        }
        
        if (
            typeof fecha_turno !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(fecha_turno)
        ) {
            return res.status(400).json({
                error: 'La fecha debe tener el formato YYYY-MM-DD'
            });
        }
        
        const fecha = new Date(`${fecha_turno}T00:00:00.000Z`);
        
        if (
            Number.isNaN(fecha.getTime()) ||
            fecha.toISOString().slice(0, 10) !== fecha_turno
        ) {
            return res.status(400).json({
                error: 'La fecha ingresada no es válida'
            });
        }
        
        const hoy = new Date();
        hoy.setUTCHours(0, 0, 0, 0);
        
        if (fecha < hoy) {
            return res.status(400).json({
                error: 'No se pueden realizar reservas en fechas pasadas'
            });
        }
        
        const cancha = await Cancha.findByPk(canchaId);
        
        if (!cancha) {
            return res.status(404).json({
                error: 'Cancha no encontrada'
            });
        }
        
        if (cancha.estado !== 'ACTIVO') {
            return res.status(400).json({
                error: 'La cancha no está activa'
            });
        }
        
        const horario = await Horario.findByPk(horarioId);
        
        if (!horario) {
            return res.status(404).json({
                error: 'Horario no encontrado'
            });
        }
        
        if (!horario.estado) {
            return res.status(400).json({
                error: 'El horario no está habilitado'
            });
        }
        
        if (horario.cancha_id !== canchaId) {
            return res.status(400).json({
                error: 'El horario no pertenece a la cancha seleccionada'
            });
        }
        
        const diaSemana = fecha.getUTCDay();
        
        if (horario.dia_semana !== diaSemana) {
            return res.status(400).json({
                error: 'El horario no corresponde al día seleccionado'
            });
        }
        
        const reservaExistente = await Reserva.findOne({
            where: {
                cancha_id: canchaId,
                fecha_turno,
                estado: {
                    [Op.ne]: 'CANCELADA'
                },
                [Op.and]: [
                    {
                        hora_inicio: {
                            [Op.lt]: horario.hora_fin
                        }
                    },
                    {
                        hora_fin: {
                            [Op.gt]: horario.hora_inicio
                        }
                    }
                ]
            }
        });
        
        if (reservaExistente) {
            return res.status(409).json({
                error: 'La cancha ya tiene una reserva en ese horario'
            });
        }
        
        const nuevaReserva = await Reserva.create({
            fecha_turno,
            fecha_reserva: new Date(),
            hora_inicio: horario.hora_inicio,
            hora_fin: horario.hora_fin,
            estado: 'PENDIENTE',
            usuario_id: req.usuario.id,
            cancha_id: canchaId,
            horario_id: horarioId
        });
        
        return res.status(201).json({
            mensaje: 'Reserva creada correctamente',
            reserva: nuevaReserva
        });
        
    } catch (error) {
        console.error('Error al crear la reserva:', error);
        
        const codigoError = error.original?.code || error.parent?.code;
        
        if (codigoError === '23P01') {
            return res.status(409).json({
                error: 'La cancha ya tiene una reserva en ese horario'
            });
        }
        
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
}

async function cancelar(req, res) {
    try {
        const id = Number(req.params.id);
        
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: 'El id debe ser un entero positivo'
            });
        }
        
        const reserva = await Reserva.findByPk(id, {
            include: [{ model: Cancha }]
        });
        
        if (!reserva) {
            return res.status(404).json({
                error: 'Reserva no encontrada'
            });
        }
        
        const { id: usuarioId, rol, complejo_id } = req.usuario;
        
        if (rol === 'JUGADOR' && reserva.usuario_id !== usuarioId) {
            return res.status(403).json({
                error: 'No tenés permiso para cancelar esta reserva'
            });
        }
        
        if (
            ['ENCARGADO', 'ADMIN_COMPLEJO'].includes(rol) &&
            reserva.Cancha.complejo_id !== complejo_id
        ) {
            return res.status(403).json({
                error: 'No tenés permiso para cancelar reservas de otro complejo'
            });
        }
        
        if (reserva.estado === 'CANCELADA') {
            return res.status(400).json({
                error: 'La reserva ya está cancelada'
            });
        }
        
        await reserva.update({
            estado: 'CANCELADA'
        });
        
        return res.json({
            mensaje: 'Reserva cancelada correctamente',
            reserva
        });
    
    } catch (error) {
        console.error('Error al cancelar la reserva:', error);
        
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
}

async function disponibilidad(req, res) {
    try {
        const canchaId = Number(req.query.cancha_id);
        const fechaTurno = req.query.fecha;
        
        
        if (!Number.isInteger(canchaId) || canchaId <= 0) {
            return res.status(400).json({
                error: 'cancha_id debe ser un entero positivo'
            });
        }
        
        
        if (
            typeof fechaTurno !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(fechaTurno)
        ) {
            return res.status(400).json({
                error: 'La fecha debe tener el formato YYYY-MM-DD'
            });
        }
        
        const fecha = new Date(`${fechaTurno}T00:00:00.000Z`);
        
        if (
            Number.isNaN(fecha.getTime()) ||
            fecha.toISOString().slice(0, 10) !== fechaTurno
        ) {
            return res.status(400).json({
                error: 'La fecha ingresada no es válida'
            });
        }
        
        const cancha = await Cancha.findByPk(canchaId);
        
        if (!cancha) {
            return res.status(404).json({
                error: 'Cancha no encontrada'
            });
        }
        
        if (cancha.estado !== 'ACTIVO') {
            return res.status(400).json({
                error: 'La cancha no está activa'
            });
        }
        
        const diaSemana = fecha.getUTCDay();
        
        const horarios = await Horario.findAll({
            where: {
                cancha_id: canchaId,
                dia_semana: diaSemana,
                estado: true
            },
            order: [['hora_inicio', 'ASC']]
        });
        
        const reservas = await Reserva.findAll({
            where: {
                cancha_id: canchaId,
                fecha_turno: fechaTurno,
                estado: {
                    [Op.ne]: 'CANCELADA'
                }
            }
        });
        
        const aMinutos = (hora) => {
            const [horas, minutos] = hora.split(':').map(Number);
            return horas * 60 + minutos;
        };
        
        const disponibles = horarios.filter((horario) => {
            return !reservas.some((reserva) => {
                return (
                    aMinutos(horario.hora_inicio) <
                        aMinutos(reserva.hora_fin) &&
                    aMinutos(horario.hora_fin) >
                        aMinutos(reserva.hora_inicio)
                );
            });
        });
        
        return res.json({
            cancha_id: canchaId,
            fecha: fechaTurno,
            horarios_disponibles: disponibles
        });
    
    } catch (error) {
        console.error('Error al consultar disponibilidad:', error);
        
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
}

module.exports = { listar, obtener, crear, cancelar, disponibilidad };