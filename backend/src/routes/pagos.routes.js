const { Router } = require('express');
const { listar, obtener, crear, actualizar } = require('../controllers/pagos.controllers');
const autenticar = require('../middlewares/autenticar');

const router = Router();

router.get('/', autenticar, listar);
router.get('/:id', autenticar, obtener);
router.post('/', autenticar, crear);
router.put('/:id', autenticar, actualizar);

module.exports = router;