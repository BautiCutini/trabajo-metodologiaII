const { Cancha, Horario } = require('../models');

// funciones que, a partir de la peticion, devuelven el id del complejo al que
// pertenece el recurso. las usa el middleware verificarPertenencia.

function aEntero(valor) {
    const numero = parseInt(valor);
    return Number.isNaN(numero) ? null : numero;
}

async function complejoDeCancha(canchaId) {
    if (canchaId === null) {
        return null;
    }
    const cancha = await Cancha.findByPk(canchaId, { attributes: ['complejo_id'] });
    return cancha ? cancha.complejo_id : null;
}

// /complejos/:id → el complejo es el id de la URL.
function complejoDeLaRuta(req) {
    return aEntero(req.params.id);
}

// /canchas/:id → hay que buscar la cancha.
function complejoDeLaCancha(req) {
    return complejoDeCancha(aEntero(req.params.id));
}

// POST /horarios → la cancha viene en el body.
function complejoDeLaCanchaDelBody(req) {
    return complejoDeCancha(aEntero(req.body.cancha_id));
}

// /horarios/:id → horario, de ahí la cancha, de ahi el complejo.
async function complejoDelHorario(req) {
    const id = aEntero(req.params.id);
    if (id === null) {
        return null;
    }
    const horario = await Horario.findByPk(id, { attributes: ['id', 'cancha_id'] });
    return horario ? complejoDeCancha(horario.cancha_id) : null;
}

module.exports = {
    complejoDeLaRuta,
    complejoDeLaCancha,
    complejoDeLaCanchaDelBody,
    complejoDelHorario
};