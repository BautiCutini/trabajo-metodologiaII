// fabrica de middleware: recibe una función que, a partir de la peticion,
// devuelve el id del complejo al que pertenece el recurso

// El administrador de plataforma pasa siempre; el resto, solo si es su complejo
function verificarPertenencia(resolverComplejoId) {
    return async function (req, res, next) {
        try {
            if (req.usuario.rol === 'ADMIN_PLATAFORMA') {
                return next();
            }

            const complejoId = await resolverComplejoId(req);
            if (complejoId === null || complejoId === undefined) {
                return res.status(404).json({ error: 'Recurso no encontrado' });
            }

            if (req.usuario.complejo_id !== complejoId) {
                return res.status(403).json({ error: 'No tenés permiso sobre este complejo' });
            }

            return next();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    };
}

module.exports = verificarPertenencia;