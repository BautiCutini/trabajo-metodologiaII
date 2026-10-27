const { Router } = require('express');
const { listar } = require('../controllers/usuarios.controller');
const autenticar = require('../middlewares/autenticar');
const autorizar = require('../middlewares/autorizar');

const router = Router();

router.get('/', autenticar, autorizar('ADMIN_PLATAFORMA'), listar);

module.exports = router;