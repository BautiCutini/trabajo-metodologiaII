const { Op } = require('sequelize');
const { Horario, Cancha } = require('../models');
const { leerPaginacion, respuestaPaginada } = require('../utils/paginacion');
const { normalizarHora, aMinutos, aHora } = require('../utils/horas');

const CAMPOS_ORDENABLES = ['dia_semana', 'hora_inicio', 'id'];
const CAMPOS_EDITABLES = ['dia_semana', 'hora_inicio', 'hora_fin', 'estado'];
const FORMATO_HORA = 'Las horas deben tener formato HH:MM (por ejemplo, 18:00; para medianoche, 24:00)';

function esDiaValido(valor) {
    const dia = Number(valor);
    return Number.isInteger(dia) && dia >= 0 && dia <= 6;
}

// ¿Hay algún horario activo de esa cancha, ese día, que se pise con el rango?
async function haySuperposicion(canchaId, diaSemana, inicio, fin, excluirId = null) {
    const where = {
        cancha_id: canchaId,
        dia_semana: diaSemana,
        estado: true,
        hora_inicio: { [Op.lt]: fin },
        hora_fin: { [Op.gt]: inicio }
    };
    if (excluirId !== null) {
        where.id = { [Op.ne]: excluirId };
    }
    const cantidad = await Horario.count({ where });
    return cantidad > 0;
}

async function listar(req, res) {
    try {
        const { page, limit, offset, order } = leerPaginacion(req.query, CAMPOS_ORDENABLES, 'dia_semana');

        const where = { estado: true };

        if (req.query.cancha_id) {
            const canchaId = parseInt(req.query.cancha_id);
            if (Number.isNaN(canchaId)) {
                return res.status(400).json({ error: 'cancha_id debe ser numérico' });
            }
            where.cancha_id = canchaId;
        }
        if (req.query.dia_semana) {
            if (!esDiaValido(req.query.dia_semana)) {
                return res.status(400).json({ error: 'dia_semana debe ser un entero entre 0 (domingo) y 6 (sábado)' });
            }
            where.dia_semana = Number(req.query.dia_semana);
        }

        const { rows, count } = await Horario.findAndCountAll({
            where,
            order: [...order, ['hora_inicio', 'ASC']],
            limit,
            offset,
            include: [{
                model: Cancha,
                where: { estado: 'ACTIVO' },
                attributes: ['id', 'nombre', 'complejo_id']
            }]
        });

        return res.json(respuestaPaginada(rows, count, page, limit));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function obtener(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'El id debe ser numérico' });
        }

        const horario = await Horario.findOne({
            where: { id, estado: true },
            include: [{ model: Cancha, attributes: ['id', 'nombre', 'complejo_id'] }]
        });

        if (!horario) {
            return res.status(404).json({ error: 'Horario no encontrado' });
        }

        return res.json(horario);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function crear(req, res) {
    try {
        const cancha_id = parseInt(req.body.cancha_id);
        const { dia_semana, hora_inicio, hora_fin } = req.body;

        if (Number.isNaN(cancha_id) || dia_semana === undefined || !hora_inicio || !hora_fin) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: cancha_id, dia_semana, hora_inicio y hora_fin' });
        }
        if (!esDiaValido(dia_semana)) {
            return res.status(400).json({ error: 'dia_semana debe ser un entero entre 0 (domingo) y 6 (sábado)' });
        }

        const inicio = normalizarHora(hora_inicio);
        const fin = normalizarHora(hora_fin);
        if (!inicio || !fin) {
            return res.status(400).json({ error: FORMATO_HORA });
        }
        if (inicio >= fin) {
            return res.status(400).json({ error: 'La hora de inicio debe ser anterior a la de fin' });
        }

        const cancha = await Cancha.findOne({ where: { id: cancha_id, estado: 'ACTIVO' } });
        if (!cancha) {
            return res.status(400).json({ error: 'La cancha indicada no existe o está inactiva' });
        }

        if (await haySuperposicion(cancha_id, Number(dia_semana), inicio, fin)) {
            return res.status(409).json({ error: 'El horario se superpone con otro existente para esa cancha y ese día' });
        }

        const horario = await Horario.create({
            cancha_id,
            dia_semana: Number(dia_semana),
            hora_inicio: inicio,
            hora_fin: fin
        });

        return res.status(201).json(horario);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Genera todos los turnos de una cancha para varios días, entre "desde" y "hasta".
async function generar(req, res) {
    try {
        const cancha_id = parseInt(req.body.cancha_id);
        const { dias, desde, hasta, duracion_minutos } = req.body;

        if (Number.isNaN(cancha_id) || !Array.isArray(dias) || dias.length === 0 || !desde || !hasta || duracion_minutos === undefined) {
            return res.status(400).json({ error: 'Se requieren cancha_id, dias (lista), desde, hasta y duracion_minutos' });
        }
        if (!dias.every(esDiaValido)) {
            return res.status(400).json({ error: 'Cada día debe ser un entero entre 0 (domingo) y 6 (sábado)' });
        }

        const duracion = Number(duracion_minutos);
        if (!Number.isInteger(duracion) || duracion < 15 || duracion > 240) {
            return res.status(400).json({ error: 'duracion_minutos debe ser un entero entre 15 y 240' });
        }

        const inicioRango = normalizarHora(desde);
        const finRango = normalizarHora(hasta);
        if (!inicioRango || !finRango) {
            return res.status(400).json({ error: FORMATO_HORA });
        }
        if (inicioRango >= finRango) {
            return res.status(400).json({ error: 'La hora "desde" debe ser anterior a "hasta"' });
        }

        const cancha = await Cancha.findOne({ where: { id: cancha_id, estado: 'ACTIVO' } });
        if (!cancha) {
            return res.status(400).json({ error: 'La cancha indicada no existe o está inactiva' });
        }

        const diasUnicos = [...new Set(dias.map(Number))];

        // Una sola consulta con los horarios que ya existen, y se compara en memoria.
        const existentes = await Horario.findAll({
            where: { cancha_id, dia_semana: diasUnicos, estado: true },
            attributes: ['dia_semana', 'hora_inicio', 'hora_fin']
        });

        const nuevos = [];
        const omitidos = [];

        for (const dia of diasUnicos) {
            for (let inicio = aMinutos(inicioRango); inicio + duracion <= aMinutos(finRango); inicio += duracion) {
                const fin = inicio + duracion;
                const choca = existentes.some(h =>
                    h.dia_semana === dia &&
                    aMinutos(h.hora_inicio) < fin &&
                    aMinutos(h.hora_fin) > inicio
                );
                const turno = { cancha_id, dia_semana: dia, hora_inicio: aHora(inicio), hora_fin: aHora(fin) };
                if (choca) {
                    omitidos.push(turno);
                } else {
                    nuevos.push(turno);
                }
            }
        }

        if (nuevos.length === 0 && omitidos.length === 0) {
            return res.status(400).json({ error: 'El rango indicado no alcanza para ningún turno de esa duración' });
        }

        const creados = await Horario.bulkCreate(nuevos, { validate: true });

        return res.status(creados.length > 0 ? 201 : 200).json({
            creados: creados.length,
            omitidos,
            horarios: creados
        });
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'AggregateError') {
            return res.status(400).json({ error: 'Alguno de los turnos generados no es válido' });
        }
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function actualizar(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'El id debe ser numérico' });
        }

        // Sin filtrar por estado, para poder rehabilitar un horario.
        const horario = await Horario.findByPk(id);
        if (!horario) {
            return res.status(404).json({ error: 'Horario no encontrado' });
        }

        const cambios = {};
        for (const campo of CAMPOS_EDITABLES) {
            if (req.body[campo] !== undefined) {
                cambios[campo] = req.body[campo];
            }
        }
        if (Object.keys(cambios).length === 0) {
            return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
        }

        if (cambios.dia_semana !== undefined) {
            if (!esDiaValido(cambios.dia_semana)) {
                return res.status(400).json({ error: 'dia_semana debe ser un entero entre 0 (domingo) y 6 (sábado)' });
            }
            cambios.dia_semana = Number(cambios.dia_semana);
        }
        for (const campo of ['hora_inicio', 'hora_fin']) {
            if (cambios[campo] !== undefined) {
                const normalizada = normalizarHora(cambios[campo]);
                if (!normalizada) {
                    return res.status(400).json({ error: FORMATO_HORA });
                }
                cambios[campo] = normalizada;
            }
        }
        if (cambios.estado !== undefined && typeof cambios.estado !== 'boolean') {
            return res.status(400).json({ error: 'estado debe ser true o false' });
        }

        // Se valida cómo quedaría el horario después del cambio.
        const dia = cambios.dia_semana ?? horario.dia_semana;
        const inicio = cambios.hora_inicio ?? horario.hora_inicio;
        const fin = cambios.hora_fin ?? horario.hora_fin;
        const activo = cambios.estado ?? horario.estado;

        if (inicio >= fin) {
            return res.status(400).json({ error: 'La hora de inicio debe ser anterior a la de fin' });
        }
        if (activo && await haySuperposicion(horario.cancha_id, dia, inicio, fin, horario.id)) {
            return res.status(409).json({ error: 'El horario se superpone con otro existente para esa cancha y ese día' });
        }

        horario.set(cambios);
        await horario.save();

        return res.json(horario);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function eliminar(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'El id debe ser numérico' });
        }

        const horario = await Horario.findByPk(id);
        if (!horario) {
            return res.status(404).json({ error: 'Horario no encontrado' });
        }

        // Baja lógica: las reservas que apuntan a este horario siguen siendo válidas.
        if (horario.estado) {
            horario.estado = false;
            await horario.save();
        }

        return res.json({ mensaje: 'Horario deshabilitado', horario });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = { listar, obtener, crear, generar, actualizar, eliminar };