const { Router } = require('express');
const { listar, obtener, crear, actualizar, eliminar } = require('../controllers/canchas.controller');
const { Cancha } = require('../models');
const autenticar = require('../middlewares/autenticar');
const autorizar = require('../middlewares/autorizar');
const verificarPertenencia = require('../middlewares/verificarPertenencia');

const router = Router();

// en estas rutas el id es de la cancha: hay que buscarla para saber de que complejo es
const complejoDeLaCancha = async (req) => {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
        return null;
    }
    const cancha = await Cancha.findByPk(id, { attributes: ['complejo_id'] });
    return cancha ? cancha.complejo_id : null;
};

const ADMINS = ['ADMIN_PLATAFORMA', 'ADMIN_COMPLEJO'];

router.get('/', listar);
router.get('/:id', obtener);
router.post('/', autenticar, autorizar(...ADMINS), crear);
router.patch('/:id', autenticar, autorizar(...ADMINS), verificarPertenencia(complejoDeLaCancha), actualizar);
router.delete('/:id', autenticar, autorizar(...ADMINS), verificarPertenencia(complejoDeLaCancha), eliminar);

module.exports = router;