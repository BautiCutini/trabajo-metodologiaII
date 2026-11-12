const { Router } = require('express');
const { listar, obtener } = require('../controllers/pagos.controller');
const autenticar = require('../middlewares/autenticar');
const { listar, obtener, crear } = require('../controllers/pagos.controller');

const router = Router();


router.get('/', autenticar, listar);
router.get('/:id', autenticar, obtener);
router.post('/', autenticar, crear);

module.exports = router;