const { Op } = require('sequelize');
const { Complejo, Cancha } = require('../models');
const { leerPaginacion, respuestaPaginada } = require('../utils/paginacion');

const CAMPOS_ORDENABLES = ['id', 'nombre'];
const CAMPOS_EDITABLES = ['nombre', 'direccion', 'telefono', 'descripcion', 'imagen_url', 'estado'];
const CAMPOS_OBLIGATORIOS = ['nombre', 'direccion', 'telefono', 'descripcion'];
const ESTADOS = ['ACTIVO', 'INACTIVO'];

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

async function actualizar(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'El id debe ser numérico' });
        }

        // Sin filtrar por estado: un complejo inactivo tiene que poder reactivarse.
        const complejo = await Complejo.findByPk(id);
        if (!complejo) {
            return res.status(404).json({ error: 'Complejo no encontrado' });
        }

        // Solo se toman los campos permitidos que efectivamente llegaron.
        const cambios = {};
        for (const campo of CAMPOS_EDITABLES) {
            if (req.body[campo] !== undefined) {
                cambios[campo] = req.body[campo];
            }
        }
        if (Object.keys(cambios).length === 0) {
            return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
        }

        // Activar o desactivar un complejo es decisión de la plataforma, no del complejo.
        if (cambios.estado !== undefined) {
            if (req.usuario.rol !== 'ADMIN_PLATAFORMA') {
                return res.status(403).json({ error: 'Solo el administrador de la plataforma puede cambiar el estado de un complejo' });
            }
            cambios.estado = String(cambios.estado).toUpperCase();
            if (!ESTADOS.includes(cambios.estado)) {
                return res.status(400).json({ error: `Estado inválido. Valores posibles: ${ESTADOS.join(', ')}` });
            }
        }

        // Los campos obligatorios se pueden cambiar, pero no dejar vacíos.
        for (const campo of CAMPOS_OBLIGATORIOS) {
            if (cambios[campo] !== undefined && !String(cambios[campo]).trim()) {
                return res.status(400).json({ error: `El campo ${campo} no puede quedar vacío` });
            }
        }

        complejo.set(cambios);
        await complejo.save();

        return res.json(complejo);
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

        const complejo = await Complejo.findByPk(id);
        if (!complejo) {
            return res.status(404).json({ error: 'Complejo no encontrado' });
        }

        // Baja lógica: el complejo deja de mostrarse pero conserva su historial.
        if (complejo.estado !== 'INACTIVO') {
            complejo.estado = 'INACTIVO';
            await complejo.save();
        }

        return res.json({ mensaje: 'Complejo dado de baja', complejo });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };