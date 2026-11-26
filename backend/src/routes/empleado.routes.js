const { Router } = require('express');
const { listar, crear, actualizar, darDeBaja } = require('../controllers/empleados.controller');
const autenticar = require('../middlewares/autenticar');
const autorizar = require('../middlewares/autorizar');

const router = Router();

const PERSONAL = ['ADMIN_COMPLEJO', 'ENCARGADO'];

router.get('/', autenticar, autorizar(...PERSONAL), listar);
router.post('/', autenticar, autorizar(...PERSONAL), crear);
router.patch('/:id', autenticar, autorizar(...PERSONAL), actualizar);
// La baja es solo del administrador del complejo
router.delete('/:id', autenticar, autorizar('ADMIN_COMPLEJO'), darDeBaja);

module.exports = router;