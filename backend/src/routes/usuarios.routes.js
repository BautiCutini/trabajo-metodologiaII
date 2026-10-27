const { Router } = require('express');
const { listar, obtener, crear } = require('../controllers/usuarios.controller');
const autenticar = require('../middlewares/autenticar');
const autorizar = require('../middlewares/autorizar');

const router = Router();

router.get('/', autenticar, autorizar('ADMIN_PLATAFORMA'), listar);
router.get('/:id', autenticar, autorizar('ADMIN_PLATAFORMA'), obtener);
router.post('/', autenticar, autorizar('ADMIN_PLATAFORMA'), crear);

module.exports = router;