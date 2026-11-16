const { Router } = require('express');
const { listar, obtener, crear, actualizar, eliminar } = require('../controllers/canchas.controller');
const autenticar = require('../middlewares/autenticar');
const autorizar = require('../middlewares/autorizar');
const verificarPertenencia = require('../middlewares/verificarPertenencia');
const { complejoDeLaCancha } = require('../utils/resolvedoresComplejo');

const router = Router();

const ADMINS = ['ADMIN_PLATAFORMA', 'ADMIN_COMPLEJO'];

router.get('/', listar);
router.get('/:id', obtener);
router.post('/', autenticar, autorizar(...ADMINS), crear);
router.patch('/:id', autenticar, autorizar(...ADMINS), verificarPertenencia(complejoDeLaCancha), actualizar);
router.delete('/:id', autenticar, autorizar(...ADMINS), verificarPertenencia(complejoDeLaCancha), eliminar);

module.exports = router;