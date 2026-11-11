const { Router } = require('express');
const { listar, obtener } = require('../controllers/pagos.controller');
const autenticar = require('../middlewares/autenticar');

const router = Router();


router.get('/', autenticar, listar);
router.get('/:id', autenticar, obtener);

module.exports = router;