const { Router } = require('express');
const { listar, obtener, crear, actualizar, eliminar } = require('../controllers/complejos.controller');
const autenticar = require('../middlewares/autenticar');
const autorizar = require('../middlewares/autorizar');
const verificarPertenencia = require('../middlewares/verificarPertenencia');

const router = Router();

// en estas rutas, el complejo es directamente el id de la URL
const complejoDeLaRuta = (req) => {
    const id = parseInt(req.params.id);
    return Number.isNaN(id) ? null : id;
};

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