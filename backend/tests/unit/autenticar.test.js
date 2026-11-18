const jwt = require('jsonwebtoken');
const autenticar = require('../../src/middlewares/autenticar');

const SECRETO = 'secreto-solo-para-tests';

function crearRespuestaFalsa() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

function pedidoConToken(token) {
    return { headers: { authorization: `Bearer ${token}` } };
}

describe('autenticar', () => {
    let secretoOriginal;

    beforeAll(() => {
        secretoOriginal = process.env.JWT_SECRET;
        process.env.JWT_SECRET = SECRETO;
    });

    afterAll(() => {
        process.env.JWT_SECRET = secretoOriginal;
    });

    test('con un token válido carga el usuario en req y deja pasar', () => {
        const token = jwt.sign({ id: 7, rol: 'JUGADOR', complejo_id: null }, SECRETO);
        const req = pedidoConToken(token);
        const res = crearRespuestaFalsa();
        const next = jest.fn();

        autenticar(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.usuario).toEqual({ id: 7, rol: 'JUGADOR', complejo_id: null });
    });

    test('sin header Authorization responde 401', () => {
        const req = { headers: {} };
        const res = crearRespuestaFalsa();
        const next = jest.fn();

        autenticar(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token no provisto' });
        expect(next).not.toHaveBeenCalled();
    });

    test('con un header sin el prefijo Bearer responde 401', () => {
        const req = { headers: { authorization: 'abc123' } };
        const res = crearRespuestaFalsa();
        const next = jest.fn();

        autenticar(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test('con un token vencido responde 401 "Token expirado"', () => {
        // Firmado con fecha de vencimiento en el pasado
        const vencido = jwt.sign(
            { id: 7, rol: 'JUGADOR', exp: Math.floor(Date.now() / 1000) - 60 },
            SECRETO
        );
        const res = crearRespuestaFalsa();
        const next = jest.fn();

        autenticar(pedidoConToken(vencido), res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token expirado' });
        expect(next).not.toHaveBeenCalled();
    });

    test('con un token firmado con otro secreto responde 401 "Token inválido"', () => {
        // Alguien que no conoce JWT_SECRET intenta fabricarse un token de admin
        const falsificado = jwt.sign({ id: 1, rol: 'ADMIN_PLATAFORMA' }, 'otro-secreto');
        const res = crearRespuestaFalsa();
        const next = jest.fn();

        autenticar(pedidoConToken(falsificado), res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' });
        expect(next).not.toHaveBeenCalled();
    });
});