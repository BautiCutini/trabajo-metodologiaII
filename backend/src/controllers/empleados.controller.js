const { Op } = require('sequelize');
const { Usuario } = require('../models');
const usuarioPublico = require('../utils/usuarioPublico');
const { contieneSinAcentos } = require('../utils/busqueda');
const { leerPaginacion, respuestaPaginada } = require('../utils/paginacion');


const ROL_EMPLEADO = 'ENCARGADO';
const ESTADOS = ['ACTIVO', 'INACTIVO'];
const CAMPOS_ORDENABLES = ['id', 'nombre', 'apellido', 'email', 'estado'];
const CAMPOS_EDITABLES = ['nombre', 'apellido', 'email', 'password', 'telefono', 'estado'];
const CAMPOS_TEXTO = ['nombre', 'apellido', 'telefono'];

function esTextoValido(valor) {
    return typeof valor === 'string' && valor.trim().length > 0;
}

function esEmailValido(email) {
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}


function dondeEmpleado(req, extra = {}) {
    return { ...extra, rol: ROL_EMPLEADO, complejo_id: req.usuario.complejo_id };
}

async function listar(req, res) {
    try {
        const { page, limit, offset, order } = leerPaginacion(req.query, CAMPOS_ORDENABLES, 'apellido');

        const where = dondeEmpleado(req);

        if (req.query.estado) {
            const estado = String(req.query.estado).toUpperCase();
            if (!ESTADOS.includes(estado)) {
                return res.status(400).json({ error: `Estado inválido. Valores posibles: ${ESTADOS.join(', ')}` });
            }
            where.estado = estado;
        }

       
        if (req.query.nombre) {
            const texto = String(req.query.nombre).trim();
            if (texto) {
                where[Op.or] = [
                    contieneSinAcentos('nombre', texto),
                    contieneSinAcentos('apellido', texto)
                ];
            }
        }

        const { rows, count } = await Usuario.findAndCountAll({
            where,
            order: [...order, ['id', 'ASC']],
            limit,
            offset
        });

        return res.json(respuestaPaginada(rows.map(usuarioPublico), count, page, limit));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function crear(req, res) {
    try {
        const { nombre, apellido, email, password, telefono } = req.body;

        if (
            !esTextoValido(nombre) ||
            !esTextoValido(apellido) ||
            !esTextoValido(email) ||
            !esTextoValido(password) ||
            !esTextoValido(telefono)
        ) {
            return res.status(400).json({ error: 'Los campos obligatorios no pueden estar vacíos' });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
        }
        if (!esEmailValido(email)) {
            return res.status(400).json({ error: 'El email no tiene un formato válido' });
        }

        const emailNormalizado = email.trim().toLowerCase();
        const existente = await Usuario.findOne({ where: { email: emailNormalizado } });
        if (existente) {
            return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
        }

   
        const empleado = await Usuario.create({
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            email: emailNormalizado,
            password,
            telefono: telefono.trim(),
            rol: ROL_EMPLEADO,
            complejo_id: req.usuario.complejo_id
        });

        return res.status(201).json(usuarioPublico(empleado));
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

       
        const empleado = await Usuario.findOne({ where: dondeEmpleado(req, { id }) });
        if (!empleado) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
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

       
        if (cambios.estado !== undefined) {
            if (req.usuario.rol !== 'ADMIN_COMPLEJO') {
                return res.status(403).json({ error: 'No tenés permiso para dar de baja o reactivar empleados' });
            }
            cambios.estado = String(cambios.estado).toUpperCase();
            if (!ESTADOS.includes(cambios.estado)) {
                return res.status(400).json({ error: `Estado inválido. Valores posibles: ${ESTADOS.join(', ')}` });
            }
        }

        for (const campo of CAMPOS_TEXTO) {
            if (cambios[campo] !== undefined) {
                if (!esTextoValido(cambios[campo])) {
                    return res.status(400).json({ error: `El campo ${campo} no puede estar vacío` });
                }
                cambios[campo] = cambios[campo].trim();
            }
        }

        if (cambios.email !== undefined) {
            if (!esEmailValido(cambios.email)) {
                return res.status(400).json({ error: 'El email no tiene un formato válido' });
            }
            cambios.email = cambios.email.trim().toLowerCase();
            const repetido = await Usuario.findOne({
                where: { email: cambios.email, id: { [Op.ne]: empleado.id } }
            });
            if (repetido) {
                return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
            }
        }

        if (cambios.password !== undefined) {
            if (!esTextoValido(cambios.password) || cambios.password.length < 8) {
                return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
            }
        }

        empleado.set(cambios);
        await empleado.save();

        return res.json(usuarioPublico(empleado));
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


async function darDeBaja(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'El id debe ser numérico' });
        }

        const empleado = await Usuario.findOne({ where: dondeEmpleado(req, { id }) });
        if (!empleado) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }

        if (empleado.estado !== 'INACTIVO') {
            empleado.estado = 'INACTIVO';
            await empleado.save();
        }

        return res.json({ mensaje: 'Empleado dado de baja', empleado: usuarioPublico(empleado) });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = { listar, crear, actualizar, darDeBaja };