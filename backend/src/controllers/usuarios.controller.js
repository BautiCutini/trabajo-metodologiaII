const { Op } = require('sequelize');
const { Usuario } = require('../models');

const ROLES = ['JUGADOR', 'ENCARGADO', 'ADMIN_COMPLEJO', 'ADMIN_PLATAFORMA'];
const ESTADOS = ['ACTIVO', 'INACTIVO'];
const CAMPOS_ORDENABLES = ['id', 'nombre', 'apellido', 'email', 'rol', 'estado'];

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

module.exports = { listar };