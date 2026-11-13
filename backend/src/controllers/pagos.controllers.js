const { Pago, Reserva, Cancha, sequelize } = require('../models');
const { leerPaginacion, respuestaPaginada } = require('../utils/paginacion');

const CAMPOS_ORDENABLES = ['id', 'fecha', 'monto', 'estado'];
const METODOS = ['MERCADOPAGO', 'TRANSFERENCIA'];
const ESTADOS = ['PENDIENTE', 'CONFIRMADO', 'RECHAZADO'];
const MONTO_MAXIMO = 99999999.99; 

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

function esPersonal(usuario) {
    return usuario.rol !== 'JUGADOR';
}

function errorMonto(monto) {
    const numero = Number(monto);
    if (monto === '' || monto === null || Number.isNaN(numero) || numero <= 0 || numero > MONTO_MAXIMO) {
        return 'El monto debe ser un número mayor a cero';
    }
    return null;
}

function errorComprobante(url) {
    if (url !== null && (typeof url !== 'string' || url.trim() === '' || url.length > 255)) {
        return 'comprobante_url debe ser un texto de hasta 255 caracteres';
    }
    return null;
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

async function crear (req, res) {
    try {
        const reserva_id = parseInt(req.body.reserva_id);
        const { monto, comprobante_url } = req.body;
        const metodo_pago = req.body.metodo_pago !== undefined ? String(req.body.metodo_pago).toUpperCase() : undefined;

        if (Number.isNaN(reserva_id) || monto === undefined || !metodo_pago) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: reserva_id, monto y metodo_pago' });
        }
        if (errorMonto(monto)) {
            return res.status(400).json({ error: errorMonto(monto) });
        }
        if (!METODOS.includes(metodo_pago)) {
            return res.status(400).json({ error: `Método de pago inválido. Valores posibles: ${METODOS.join(', ')}` });
        }
        if (comprobante_url !== undefined && errorComprobante(comprobante_url)) {
            return res.status(400).json({ error: errorComprobante(comprobante_url) });
        }

        const reserva = await Reserva.findByPk(reserva_id, {
            include: [{ model: Cancha, attributes: ['id', 'complejo_id'] }]
        });
        if (!reserva) {
            return res.status(400).json({ error: 'La reserva indicada no existe' });
        }
        if (!puedeAccederAReserva(req.usuario, reserva)) {
            return res.status(403).json({ error: 'No tenés permiso sobre esta reserva' });
        }
        if (reserva.estado === 'CANCELADA') {
            return res.status(409).json({ error: 'No se puede registrar un pago para una reserva cancelada' });
        }

        
        const vigentes = await Pago.count({
            where: { reserva_id, estado: ['PENDIENTE', 'CONFIRMADO'] }
        });
        if (vigentes > 0) {
            return res.status(409).json({ error: 'La reserva ya tiene un pago pendiente o confirmado' });
        }

        const pago = await Pago.create({
            reserva_id,
            monto: Number(monto),
            fecha: new Date(),
            metodo_pago,
            estado: 'PENDIENTE',
            comprobante_url: comprobante_url ?? null
        });

        return res.status(201).json(pago);
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
            return res.status(400).json({ error: 'El id tiene que  ser numérico' });
        }

        const pago = await Pago.findByPk(id, { include: [INCLUDE_RESERVA] });
        if (!pago) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }
        if (!puedeAccederAReserva(req.usuario, pago.Reserva)) {
            return res.status(403).json({ error: 'No tenés permiso sobre este pago' });
        }

        const { estado, comprobante_url } = req.body;
        if (estado === undefined && comprobante_url === undefined) {
            return res.status(400).json({ error: 'No se enviaron campos para actualizar (estado, comprobante_url)' });
        }

        const cambios = {};

        if (estado !== undefined) {
            const nuevoEstado = String(estado).toUpperCase();
            if (!ESTADOS.includes(nuevoEstado)) {
                return res.status(400).json({ error: `Estado inválido. Valores posibles: ${ESTADOS.join(', ')}` });
            }
            if (!esPersonal(req.usuario)) {
                return res.status(403).json({ error: 'Solo el personal del complejo puede confirmar o rechazar pagos' });
            }
            if (nuevoEstado !== pago.estado) {
                if (pago.estado !== 'PENDIENTE' || nuevoEstado === 'PENDIENTE') {
                    return res.status(409).json({ error: 'Solo un pago pendiente puede pasar a confirmado o rechazado' });
                }
                cambios.estado = nuevoEstado;
            }
        }

        if (comprobante_url !== undefined) {
            if (errorComprobante(comprobante_url)) {
                return res.status(400).json({ error: errorComprobante(comprobante_url) });
            }
            if (pago.estado !== 'PENDIENTE') {
                return res.status(409).json({ error: 'El comprobante solo se puede modificar mientras el pago está pendiente' });
            }
            cambios.comprobante_url = comprobante_url;
        }


        await sequelize.transaction(async (transaction) => {
            pago.set(cambios);
            await pago.save({ transaction });

            if (cambios.estado === 'CONFIRMADO' && pago.Reserva.estado === 'PENDIENTE') {
                await pago.Reserva.update({ estado: 'CONFIRMADA' }, { transaction });
            }
        });

        return res.json(pago);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = { listar, obtener, crear, actualizar };