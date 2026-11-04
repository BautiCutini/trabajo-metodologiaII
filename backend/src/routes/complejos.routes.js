const { Router } = require('express');
const { listar, obtener, crear, actualizar, eliminar } = require('../controllers/complejos.controller');
const autenticar = require('../middlewares/autenticar');
const autorizar = require('../middlewares/autorizar');
const verificarPertenencia = require('../middlewares/verificarPertenencia');
const { complejoDeLaRuta } = require('../utils/resolvedoresComplejo');

const router = Router();

router.get('/', listar);
router.get('/:id', obtener);
router.post('/', autenticar, autorizar('ADMIN_PLATAFORMA'), crear);
router.patch('/:id',
    autenticar,
    autorizar('ADMIN_PLATAFORMA', 'ADMIN_COMPLEJO'),
    verificarPertenencia(complejoDeLaRuta),
    actualizar
);
router.delete('/:id', autenticar, autorizar('ADMIN_PLATAFORMA'), eliminar);

module.exports = router;