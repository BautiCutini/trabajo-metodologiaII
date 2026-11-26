const { Router } = require('express');
const { listar, crear, actualizar, darDeBaja } = require('../controllers/empleados.controller');
const autenticar = require('../middlewares/autenticar');
const autorizar = require('../middlewares/autorizar');

const router = Router();

// Los encargados no pueden administrar personal. Estas operaciones son exclusivas del dueño.
router.use(autenticar, autorizar('ADMIN_COMPLEJO'));

router.get('/', listar);
router.post('/', crear);
router.patch('/:id', actualizar);
router.delete('/:id', darDeBaja);

module.exports = router;
