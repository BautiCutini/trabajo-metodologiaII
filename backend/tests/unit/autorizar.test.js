const autorizar = require('../../src/middlewares/autorizar');

// doble de prueba de la respuesta de Express (funcion falsa): registra a qué status
// y con qué JSON se respondió, sin levantar ningún servidor
function crearRespuestaFalsa() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe('autorizar', () => {
    test('deja pasar a un rol permitido', () => {
        // Arrange
        const middleware = autorizar('ADMIN_PLATAFORMA');
        const req = { usuario: { id: 1, rol: 'ADMIN_PLATAFORMA' } };
        const res = crearRespuestaFalsa();
        const next = jest.fn();

        // Act
        middleware(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    test('acepta cualquiera de varios roles permitidos', () => {
        const middleware = autorizar('ENCARGADO', 'ADMIN_COMPLEJO');
        const req = { usuario: { id: 2, rol: 'ADMIN_COMPLEJO' } };
        const res = crearRespuestaFalsa();
        const next = jest.fn();

        middleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    test('rechaza con 403 a un rol que no está permitido', () => {
        const middleware = autorizar('ADMIN_PLATAFORMA');
        const req = { usuario: { id: 3, rol: 'JUGADOR' } };
        const res = crearRespuestaFalsa();
        const next = jest.fn();

        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    test('rechaza con 401 si no hay un usuario autenticado', () => {
        const middleware = autorizar('ADMIN_PLATAFORMA');
        const req = {};
        const res = crearRespuestaFalsa();
        const next = jest.fn();

        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
});