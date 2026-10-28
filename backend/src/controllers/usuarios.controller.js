const { Op } = require('sequelize');
const { Usuario, Complejo } = require('../models');
const usuarioPublico = require('../utils/usuarioPublico');

const ROLES = ['JUGADOR', 'ENCARGADO', 'ADMIN_COMPLEJO', 'ADMIN_PLATAFORMA'];
const ESTADOS = ['ACTIVO', 'INACTIVO'];
const CAMPOS_ORDENABLES = ['id', 'nombre', 'apellido', 'email', 'rol', 'estado'];
const ROLES_CON_COMPLEJO = ['ENCARGADO', 'ADMIN_COMPLEJO'];
const CAMPOS_EDITABLES = ['nombre', 'apellido', 'email', 'password', 'telefono', 'rol', 'complejo_id', 'imagen_url', 'estado'];

// manejo de errores
async function errorRolComplejo(rol, complejoId) {
    if (ROLES_CON_COMPLEJO.includes(rol)) {
        if (!complejoId) {
            return `El rol ${rol} requiere un complejo_id`;
        }
        const complejo = await Complejo.findByPk(complejoId);
        if (!complejo) {
            return 'El complejo indicado no existe';
        }
    } else if (complejoId) {
        return `El rol ${rol} no puede tener un complejo asignado`;
    }
    return null;
}

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

        // "nombre" busca tanto en el nombre como en el apellido
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

        // El personal de un complejo necesita complejo; jugadores y admins de plataforma no
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

async function actualizar(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'El id debe ser numérico' });
        }

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // solo se toman los campos permitidos que efectivamente llegaron en el body
        const cambios = {};
        for (const campo of CAMPOS_EDITABLES) {
            if (req.body[campo] !== undefined) {
                cambios[campo] = req.body[campo];
            }
        }
        if (Object.keys(cambios).length === 0) {
            return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
        }

        const esUnoMismo = req.usuario.id === usuario.id;

        if (cambios.password !== undefined && String(cambios.password).length < 8) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
        }

        if (cambios.rol !== undefined) {
            cambios.rol = String(cambios.rol).toUpperCase();
            if (!ROLES.includes(cambios.rol)) {
                return res.status(400).json({ error: `Rol inválido. Valores posibles: ${ROLES.join(', ')}` });
            }
            if (esUnoMismo && cambios.rol !== usuario.rol) {
                return res.status(400).json({ error: 'No podés cambiar tu propio rol' });
            }
        }

        if (cambios.estado !== undefined) {
            cambios.estado = String(cambios.estado).toUpperCase();
            if (!ESTADOS.includes(cambios.estado)) {
                return res.status(400).json({ error: `Estado inválido. Valores posibles: ${ESTADOS.join(', ')}` });
            }
            if (esUnoMismo && cambios.estado === 'INACTIVO') {
                return res.status(400).json({ error: 'No podés desactivar tu propia cuenta' });
            }
        }

        
        const rolFinal = cambios.rol ?? usuario.rol;
        if (!ROLES_CON_COMPLEJO.includes(rolFinal) && cambios.complejo_id === undefined) {
            
            cambios.complejo_id = null;
        }
        const complejoFinal = cambios.complejo_id !== undefined ? cambios.complejo_id : usuario.complejo_id;
        const errorComplejo = await errorRolComplejo(rolFinal, complejoFinal);
        if (errorComplejo) {
            return res.status(400).json({ error: errorComplejo });
        }

        if (cambios.email !== undefined) {
            cambios.email = String(cambios.email).trim().toLowerCase();
            const otro = await Usuario.findOne({
                where: { email: cambios.email, id: { [Op.ne]: usuario.id } }
            });
            if (otro) {
                return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
            }
        }

        
        usuario.set(cambios);
        await usuario.save();

        return res.json(usuarioPublico(usuario));
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

async function eliminar(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'El id debe ser numérico' });
        }

        if (req.usuario.id === id) {
            return res.status(400).json({ error: 'No podés darte de baja a vos mismo' });
        }

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        
        if (usuario.estado !== 'INACTIVO') {
            usuario.estado = 'INACTIVO';
            await usuario.save();
        }

        return res.json({ mensaje: 'Usuario dado de baja', usuario: usuarioPublico(usuario) });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };