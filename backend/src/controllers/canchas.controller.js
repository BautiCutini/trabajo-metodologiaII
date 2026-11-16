const { Op } = require('sequelize');
const { Cancha, Complejo } = require('../models');
const { leerPaginacion, respuestaPaginada } = require('../utils/paginacion');

const CAMPOS_ORDENABLES = ['id', 'nombre', 'precio', 'capacidad'];
const CAMPOS_EDITABLES = ['nombre', 'tipo', 'capacidad', 'precio', 'imagen_url', 'estado'];
const CAMPOS_OBLIGATORIOS = ['nombre', 'imagen_url'];
const TIPOS = ['techada', 'descubierta'];
const ESTADOS = ['ACTIVO', 'INACTIVO'];

// valida tipo, capacidad y precio solo si vienen,devuelve un mensaje de error o null
function errorDatosCancha({ tipo, capacidad, precio }) {
    if (tipo !== undefined && !TIPOS.includes(tipo)) {
        return `Tipo inválido. Valores posibles: ${TIPOS.join(', ')}`;
    }
    if (capacidad !== undefined && (!Number.isInteger(Number(capacidad)) || Number(capacidad) <= 0)) {
        return 'La capacidad debe ser un número entero mayor a cero';
    }
    if (precio !== undefined && (Number.isNaN(Number(precio)) || Number(precio) <= 0)) {
        return 'El precio debe ser un número mayor a cero';
    }
    return null;
}

async function listar(req, res) {
    try {
        const { page, limit, offset, order } = leerPaginacion(req.query, CAMPOS_ORDENABLES, 'nombre');

        const where = { estado: 'ACTIVO' };

        if (req.query.complejo_id) {
            const complejoId = parseInt(req.query.complejo_id);
            if (Number.isNaN(complejoId)) {
                return res.status(400).json({ error: 'complejo_id debe ser numérico' });
            }
            where.complejo_id = complejoId;
        }
        if (req.query.tipo) {
            const tipo = req.query.tipo.toLowerCase();
            if (!TIPOS.includes(tipo)) {
                return res.status(400).json({ error: `Tipo inválido. Valores posibles: ${TIPOS.join(', ')}` });
            }
            where.tipo = tipo;
        }
        if (req.query.nombre) {
            where.nombre = { [Op.iLike]: `%${req.query.nombre}%` };
        }

        // solo canchas activas de complejos activos
        const { rows, count } = await Cancha.findAndCountAll({
            where,
            order,
            limit,
            offset,
            include: [{
                model: Complejo,
                where: { estado: 'ACTIVO' },
                attributes: ['id', 'nombre', 'direccion']
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

        const cancha = await Cancha.findOne({
            where: { id, estado: 'ACTIVO' },
            include: [{
                model: Complejo,
                where: { estado: 'ACTIVO' },
                attributes: ['id', 'nombre', 'direccion', 'telefono']
            }]
        });

        if (!cancha) {
            return res.status(404).json({ error: 'Cancha no encontrada' });
        }

        return res.json(cancha);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function crear(req, res) {
    try {
        const { nombre, capacidad, precio, imagen_url } = req.body;
        const tipo = req.body.tipo !== undefined ? String(req.body.tipo).toLowerCase() : undefined;

        // el admin de un complejo solo crea canchas en el suyo, venga lo que venga en el body
        const complejo_id = req.usuario.rol === 'ADMIN_COMPLEJO'
            ? req.usuario.complejo_id
            : parseInt(req.body.complejo_id);

        if (!nombre || !tipo || capacidad === undefined || precio === undefined || !imagen_url || !complejo_id) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, tipo, capacidad, precio, imagen_url y complejo_id' });
        }

        const errorDatos = errorDatosCancha({ tipo, capacidad, precio });
        if (errorDatos) {
            return res.status(400).json({ error: errorDatos });
        }

        const complejo = await Complejo.findOne({ where: { id: complejo_id, estado: 'ACTIVO' } });
        if (!complejo) {
            return res.status(400).json({ error: 'El complejo indicado no existe o está inactivo' });
        }

        const cancha = await Cancha.create({
            nombre,
            tipo,
            capacidad: Number(capacidad),
            precio: Number(precio),
            imagen_url,
            complejo_id
        });

        return res.status(201).json(cancha);
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

        // sin filtrar por estado, para poder reactivar una cancha dada de baja
        const cancha = await Cancha.findByPk(id);
        if (!cancha) {
            return res.status(404).json({ error: 'Cancha no encontrada' });
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

        if (cambios.tipo !== undefined) {
            cambios.tipo = String(cambios.tipo).toLowerCase();
        }
        if (cambios.estado !== undefined) {
            cambios.estado = String(cambios.estado).toUpperCase();
            if (!ESTADOS.includes(cambios.estado)) {
                return res.status(400).json({ error: `Estado inválido. Valores posibles: ${ESTADOS.join(', ')}` });
            }
        }

        const errorDatos = errorDatosCancha(cambios);
        if (errorDatos) {
            return res.status(400).json({ error: errorDatos });
        }

        for (const campo of CAMPOS_OBLIGATORIOS) {
            if (cambios[campo] !== undefined && !String(cambios[campo]).trim()) {
                return res.status(400).json({ error: `El campo ${campo} no puede quedar vacío` });
            }
        }

        cancha.set(cambios);
        await cancha.save();

        return res.json(cancha);
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

        const cancha = await Cancha.findByPk(id);
        if (!cancha) {
            return res.status(404).json({ error: 'Cancha no encontrada' });
        }

        if (cancha.estado !== 'INACTIVO') {
            cancha.estado = 'INACTIVO';
            await cancha.save();
        }

        return res.json({ mensaje: 'Cancha dada de baja', cancha });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };