const { Router } = require('express');
const { registro, login, perfil, actualizarPerfil } = require('../controllers/auth.controller');
const autenticar = require('../middlewares/autenticar');

const router = Router();

router.post('/registro', registro);
router.post('/login', login);
router.get('/perfil', autenticar, perfil);
router.patch('/perfil', autenticar, actualizarPerfil);

module.exports = router;
