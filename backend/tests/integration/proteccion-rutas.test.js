const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');

const SECRETO = 'secreto-solo-para-tests';

// Firma un token igual que lo hace el login real
function tokenDe(rol) {
    return jwt.sign({ id: 99, rol, complejo_id: null }, SECRETO, { expiresIn: '1h' });
}

describe('Protección de /api/v1/usuarios', () => {
    let secretoOriginal;

    beforeAll(() => {
        secretoOriginal = process.env.JWT_SECRET;
        process.env.JWT_SECRET = SECRETO;
    });

    afterAll(() => {
        process.env.JWT_SECRET = secretoOriginal;
    });

    test('la API responde en /api/health', async () => {
        const respuesta = await request(app).get('/api/health');

        expect(respuesta.status).toBe(200);
        expect(respuesta.body).toEqual({ ok: true });
    });

    test('sin token, listar usuarios responde 401', async () => {
        const respuesta = await request(app).get('/api/v1/usuarios');

        expect(respuesta.status).toBe(401);
        expect(respuesta.body).toEqual({ error: 'Token no provisto' });
    });

    test('con un token adulterado responde 401', async () => {
        const respuesta = await request(app)
            .get('/api/v1/usuarios')
            .set('Authorization', 'Bearer esto.no.es-un-token');

        expect(respuesta.status).toBe(401);
        expect(respuesta.body).toEqual({ error: 'Token inválido' });
    });

    test.each(['JUGADOR', 'ENCARGADO', 'ADMIN_COMPLEJO'])(
        'un %s no puede listar usuarios: 403',
        async (rol) => {
            const respuesta = await request(app)
                .get('/api/v1/usuarios')
                .set('Authorization', `Bearer ${tokenDe(rol)}`);

            expect(respuesta.status).toBe(403);
        }
    );

    test('un JUGADOR tampoco puede crear usuarios: 403', async () => {
        const respuesta = await request(app)
            .post('/api/v1/usuarios')
            .set('Authorization', `Bearer ${tokenDe('JUGADOR')}`)
            .send({ nombre: 'Intento', rol: 'ADMIN_PLATAFORMA' });

        expect(respuesta.status).toBe(403);
    });

    test('una ruta inexistente responde 404', async () => {
        const respuesta = await request(app).get('/api/v1/no-existe');

        expect(respuesta.status).toBe(404);
    });

    test('sin token, confirmar una reserva responde 401', async () => {
        const respuesta = await request(app).patch('/api/v1/reservas/1/confirmar');

        expect(respuesta.status).toBe(401);
    });

    test('un JUGADOR no puede confirmar reservas: 403', async () => {
        const respuesta = await request(app)
            .patch('/api/v1/reservas/1/confirmar')
            .set('Authorization', `Bearer ${tokenDe('JUGADOR')}`);

        expect(respuesta.status).toBe(403);
    });
});