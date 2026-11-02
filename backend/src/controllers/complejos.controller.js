const { Op } = require('sequelize');
const { Complejo, Cancha } = require('../models');
const { leerPaginacion, respuestaPaginada } = require('../utils/paginacion');

const CAMPOS_ORDENABLES = ['id', 'nombre'];

async function listar(req, res) {
    try {
        const { page, limit, offset, order } = leerPaginacion(req.query, CAMPOS_ORDENABLES, 'nombre');

        // El listado público muestra solo complejos activos.
        const where = { estado: 'ACTIVO' };
        if (req.query.nombre) {
            where.nombre = { [Op.iLike]: `%${req.query.nombre}%` };
        }

        const { rows, count } = await Complejo.findAndCountAll({ where, order, limit, offset });

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

        // Trae el complejo junto con sus canchas activas.
        const complejo = await Complejo.findOne({
            where: { id, estado: 'ACTIVO' },
            include: [{
                model: Cancha,
                where: { estado: 'ACTIVO' },
                required: false
            }]
        });

        if (!complejo) {
            return res.status(404).json({ error: 'Complejo no encontrado' });
        }

        return res.json(complejo);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function crear(req, res) {
    try {
        const { nombre, direccion, telefono, descripcion, imagen_url } = req.body;

        if (!nombre || !direccion || !telefono || !descripcion) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, direccion, telefono y descripcion' });
        }

        const complejo = await Complejo.create({
            nombre,
            direccion,
            telefono,
            descripcion,
            imagen_url: imagen_url ?? null
        });

        return res.status(201).json(complejo);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = { listar, obtener, crear };