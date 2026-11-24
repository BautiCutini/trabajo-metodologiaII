const { Router } = require('express');

const {
    listar,
    obtener,
    crear,
    cancelar,
    confirmar,
    disponibilidad
} = require('../controllers/reservas.controller');

const autenticar = require('../middlewares/autenticar');
const autorizar = require('../middlewares/autorizar');

const router = Router();

const ROLES_CANCELAR = [
    'JUGADOR',
    'ENCARGADO',
    'ADMIN_COMPLEJO',
    'ADMIN_PLATAFORMA'
];

const ROLES_CONSULTA = [
    'JUGADOR',
    'ENCARGADO',
    'ADMIN_COMPLEJO',
    'ADMIN_PLATAFORMA'
];


router.get(
    '/',
    autenticar,
    autorizar(...ROLES_CONSULTA),
    listar
);


router.get(
    '/disponibilidad',
    autenticar,
    autorizar(...ROLES_CONSULTA),
    disponibilidad
);


router.post(
    '/',
    autenticar,
    autorizar('JUGADOR', 'ENCARGADO'),
    crear
);


router.patch(
    '/:id/cancelar',
    autenticar,
    autorizar(...ROLES_CANCELAR),
    cancelar
);


router.patch(
    '/:id/confirmar',
    autenticar,
    autorizar('ENCARGADO', 'ADMIN_COMPLEJO', 'ADMIN_PLATAFORMA'),
    confirmar
);


router.get(
    '/:id',
    autenticar,
    autorizar(...ROLES_CONSULTA),
    obtener
);

module.exports = router;