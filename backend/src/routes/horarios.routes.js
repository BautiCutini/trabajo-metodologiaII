const { Router } = require('express');
const { listar, obtener, crear, generar, actualizar, eliminar } = require('../controllers/horarios.controller');
const autenticar = require('../middlewares/autenticar');
const autorizar = require('../middlewares/autorizar');
const verificarPertenencia = require('../middlewares/verificarPertenencia');
const { complejoDeLaCanchaDelBody, complejoDelHorario } = require('../utils/resolvedoresComplejo');

const router = Router();

const ADMINISTRADORES = ['ADMIN_PLATAFORMA', 'ADMIN_COMPLEJO'];
const PERSONAL_COMPLEJO = ['ADMIN_PLATAFORMA', 'ADMIN_COMPLEJO', 'ENCARGADO'];

// La consulta de horarios activos es pública para el flujo de reservas.
router.get('/', listar);
router.get('/:id', obtener);

// Solo el administrador del complejo o de la plataforma puede crear horarios.
router.post('/generar', autenticar, autorizar(...ADMINISTRADORES), verificarPertenencia(complejoDeLaCanchaDelBody), generar);
router.post('/', autenticar, autorizar(...ADMINISTRADORES), verificarPertenencia(complejoDeLaCanchaDelBody), crear);

// Tanto el dueño como el gerente pueden modificar o dar de baja horarios de su complejo.
router.patch('/:id', autenticar, autorizar(...PERSONAL_COMPLEJO), verificarPertenencia(complejoDelHorario), actualizar);
router.delete('/:id', autenticar, autorizar(...PERSONAL_COMPLEJO), verificarPertenencia(complejoDelHorario), eliminar);

module.exports = router;
