const { Pago, Reserva, Cancha } = require('../models');
const { leerPaginacion, respuestaPaginada } = require('../utils/paginacion');

const CAMPOS_ORDENABLES = ['id', 'fecha', 'monto', 'estado'];
const METODOS = ['MERCADOPAGO', 'TRANSFERENCIA'];
const ESTADOS = ['PENDIENTE', 'CONFIRMADO', 'RECHAZADO'];


const INCLUDE_RESERVA = {
    model: Reserva,
    attributes: ['id', 'usuario_id', 'cancha_id', 'fecha_turno', 'hora_inicio', 'hora_fin', 'estado'],
    include: [{ model: Cancha, attributes: ['id', 'nombre', 'complejo_id'] }]
};


function puedeAccederAReserva(usuario, reserva) {
    if (usuario.rol === 'ADMIN_PLATAFORMA') {
        return true;
    }
    if (usuario.rol === 'JUGADOR') {
        return reserva.usuario_id === usuario.id;
    }
    return reserva.Cancha.complejo_id === usuario.complejo_id;
}

async function listar(req, res) {
    try {
        const { page, limit, offset, order } = leerPaginacion(req.query, CAMPOS_ORDENABLES, 'fecha');

        const where = {};

        if (req.query.reserva_id) {
            const reservaId = parseInt(req.query.reserva_id);
            if (Number.isNaN(reservaId)) {
                return res.status(400).json({ error: 'reserva_id debe ser numérico' });
            }
            where.reserva_id = reservaId;
        }
        if (req.query.estado) {
            const estado = String(req.query.estado).toUpperCase();
            if (!ESTADOS.includes(estado)) {
                return res.status(400).json({ error: `Estado inválido. Valores posibles: ${ESTADOS.join(', ')}` });
            }
            where.estado = estado;
        }
        if (req.query.metodo_pago) {
            const metodo = String(req.query.metodo_pago).toUpperCase();
            if (!METODOS.includes(metodo)) {
                return res.status(400).json({ error: `Método de pago inválido. Valores posibles: ${METODOS.join(', ')}` });
            }
            where.metodo_pago = metodo;
        }

        const whereReserva = {};
        const whereCancha = {};
        if (req.usuario.rol === 'JUGADOR') {
            whereReserva.usuario_id = req.usuario.id;
        } else if (req.usuario.rol !== 'ADMIN_PLATAFORMA') {
            whereCancha.complejo_id = req.usuario.complejo_id;
        }

        const { rows, count } = await Pago.findAndCountAll({
            where,
            order: [...order, ['id', 'ASC']],
            limit,
            offset,
            include: [{
                ...INCLUDE_RESERVA,
                where: whereReserva,
                include: [{ model: Cancha, where: whereCancha, attributes: ['id', 'nombre', 'complejo_id'] }]
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

        const pago = await Pago.findByPk(id, { include: [INCLUDE_RESERVA] });
        if (!pago) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }
        if (!puedeAccederAReserva(req.usuario, pago.Reserva)) {
            return res.status(403).json({ error: 'No tenés permiso para ver este pago' });
        }

        return res.json(pago);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = { listar, obtener };