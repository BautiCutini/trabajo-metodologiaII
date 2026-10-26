const { Router } = require('express');
const { registro, login, perfil } = require('../controllers/auth.controller');
const autenticar = require('../middlewares/autenticar');

const router = Router();

router.post('/registro', registro);
router.post('/login', login);
router.get('/perfil', autenticar, perfil);

module.exports = router;