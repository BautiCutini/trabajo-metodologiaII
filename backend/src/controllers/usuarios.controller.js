const { Op } = require('sequelize');
const { Usuario, Complejo } = require('../models');
const usuarioPublico = require('../utils/usuarioPublico');

const ROLES = ['JUGADOR', 'ENCARGADO', 'ADMIN_COMPLEJO', 'ADMIN_PLATAFORMA'];
const ESTADOS = ['ACTIVO', 'INACTIVO'];
const CAMPOS_ORDENABLES = ['id', 'nombre', 'apellido', 'email', 'rol', 'estado'];
const ROLES_CON_COMPLEJO = ['ENCARGADO', 'ADMIN_COMPLEJO'];

async function listar(req, res) {
    try {
        //  Paginado 
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
        const offset = (page - 1) * limit;

        //  Orden 
        const sortBy = CAMPOS_ORDENABLES.includes(req.query.sortBy) ? req.query.sortBy : 'id';
        const order = String(req.query.order).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        //  Filtros 
        const { nombre, email, telefono, rol, estado, complejo_id } = req.query;
        const where = {};

        // "nombre" busca tanto en el nombre como en el apellido.
        if (nombre) {
            where[Op.or] = [
                { nombre: { [Op.iLike]: `%${nombre}%` } },
                { apellido: { [Op.iLike]: `%${nombre}%` } }
            ];
        }
        if (email) {
            where.email = { [Op.iLike]: `%${email}%` };
        }
        if (telefono) {
            where.telefono = { [Op.iLike]: `%${telefono}%` };
        }
        if (rol) {
            const rolNormalizado = rol.toUpperCase();
            if (!ROLES.includes(rolNormalizado)) {
                return res.status(400).json({ error: `Rol inválido. Valores posibles: ${ROLES.join(', ')}` });
            }
            where.rol = rolNormalizado;
        }
        if (estado) {
            const estadoNormalizado = estado.toUpperCase();
            if (!ESTADOS.includes(estadoNormalizado)) {
                return res.status(400).json({ error: `Estado inválido. Valores posibles: ${ESTADOS.join(', ')}` });
            }
            where.estado = estadoNormalizado;
        }
        if (complejo_id) {
            const id = parseInt(complejo_id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: 'complejo_id debe ser numérico' });
            }
            where.complejo_id = id;
        }

        const { rows, count } = await Usuario.findAndCountAll({
            where,
            order: [[sortBy, order]],
            limit,
            offset
        });

        return res.json({
            data: rows,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        });
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

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.json(usuario);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function crear(req, res) {
    try {
        const { nombre, apellido, email, password, telefono } = req.body;
        const rol = req.body.rol?.toUpperCase();
        const complejo_id = req.body.complejo_id ?? null;

        if (!nombre || !apellido || !email || !password || !telefono || !rol) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
        }
        if (!ROLES.includes(rol)) {
            return res.status(400).json({ error: `Rol inválido. Valores posibles: ${ROLES.join(', ')}` });
        }

        // El personal de un complejo necesita complejo; jugadores y admins de plataforma no.
        if (ROLES_CON_COMPLEJO.includes(rol)) {
            if (!complejo_id) {
                return res.status(400).json({ error: `El rol ${rol} requiere un complejo_id` });
            }
            const complejo = await Complejo.findByPk(complejo_id);
            if (!complejo) {
                return res.status(400).json({ error: 'El complejo indicado no existe' });
            }
        } else if (complejo_id) {
            return res.status(400).json({ error: `El rol ${rol} no puede tener un complejo asignado` });
        }

        const emailNormalizado = email.trim().toLowerCase();
        const existente = await Usuario.findOne({ where: { email: emailNormalizado } });
        if (existente) {
            return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
        }

        const usuario = await Usuario.create({
            nombre,
            apellido,
            email: emailNormalizado,
            password,
            telefono,
            rol,
            complejo_id
        });

        return res.status(201).json(usuarioPublico(usuario));
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
        }
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = { listar, obtener, crear };