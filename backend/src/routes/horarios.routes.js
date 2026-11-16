const { Router } = require('express');
const { listar, obtener, crear, generar, actualizar, eliminar } = require('../controllers/horarios.controller');
const autenticar = require('../middlewares/autenticar');
const autorizar = require('../middlewares/autorizar');
const verificarPertenencia = require('../middlewares/verificarPertenencia');
const { complejoDeLaCanchaDelBody, complejoDelHorario } = require('../utils/resolvedoresComplejo');

const router = Router();

const ADMINS = ['ADMIN_PLATAFORMA', 'ADMIN_COMPLEJO'];

router.get('/', listar);
router.get('/:id', obtener);
router.post('/generar', autenticar, autorizar(...ADMINS), verificarPertenencia(complejoDeLaCanchaDelBody), generar);
router.post('/', autenticar, autorizar(...ADMINS), verificarPertenencia(complejoDeLaCanchaDelBody), crear);
router.patch('/:id', autenticar, autorizar(...ADMINS), verificarPertenencia(complejoDelHorario), actualizar);
router.delete('/:id', autenticar, autorizar(...ADMINS), verificarPertenencia(complejoDelHorario), eliminar);

module.exports = router;