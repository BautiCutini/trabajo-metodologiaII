const { Router } = require('express');
const { listar, obtener, crear } = require('../controllers/complejos.controller');
const autenticar = require('../middlewares/autenticar');
const autorizar = require('../middlewares/autorizar');

const router = Router();

router.get('/', listar);
router.get('/:id', obtener);
router.post('/', autenticar, autorizar('ADMIN_PLATAFORMA'), crear);

module.exports = router;