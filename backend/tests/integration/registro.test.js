const request = require('supertest');
const app = require('../../src/app');
const { sequelize, Usuario } = require('../../src/models');

const DATOS_VALIDOS = {
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@test.com',
    telefono: '2914000000',
    password: 'clave1234',
};

function registrar(datos) {
    return request(app).post('/api/v1/auth/registro').send(datos);
}

beforeAll(async () => {
    // Red de seguridad: nunca vaciar una base que no sea la de prueba
    if (!sequelize.config.database.endsWith('_test')) {
        throw new Error(`Los tests de integración solo corren contra una base *_test, no contra "${sequelize.config.database}"`);
    }
    await sequelize.authenticate();
});

beforeEach(async () => {
    // Cada test arranca con la tabla vacía: ninguno depende de otro
    await sequelize.query('TRUNCATE usuarios RESTART IDENTITY CASCADE');
});

afterAll(async () => {
    await sequelize.close();
});

describe('POST /api/v1/auth/registro', () => {
    describe('casos normales', () => {
        test('crea un jugador y no devuelve la contraseña', async () => {
            const respuesta = await registrar(DATOS_VALIDOS);

            expect(respuesta.status).toBe(201);
            expect(respuesta.body).toMatchObject({
                nombre: 'Juan',
                email: 'juan@test.com',
                rol: 'JUGADOR',
                complejo_id: null,
                estado: 'ACTIVO',
            });
            expect(respuesta.body).not.toHaveProperty('password');
        });

        test('guarda la contraseña hasheada, nunca en texto plano', async () => {
            await registrar(DATOS_VALIDOS);

            const guardado = await Usuario.scope('conPassword').findOne({
                where: { email: 'juan@test.com' },
            });

            expect(guardado.password).not.toBe('clave1234');
            expect(guardado.password).toMatch(/^\$2[aby]\$/);
            expect(await guardado.validarPassword('clave1234')).toBe(true);
        });

        test('el usuario recién registrado puede iniciar sesión', async () => {
            await registrar(DATOS_VALIDOS);

            const login = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'juan@test.com', password: 'clave1234' });

            expect(login.status).toBe(200);
            expect(login.body.token).toEqual(expect.any(String));
            expect(login.body.usuario.rol).toBe('JUGADOR');
        });
    });

    describe('regla de seguridad', () => {
        test('aunque pida ser ADMIN_PLATAFORMA, se crea como JUGADOR sin complejo', async () => {
            const respuesta = await registrar({
                ...DATOS_VALIDOS,
                rol: 'ADMIN_PLATAFORMA',
                complejo_id: 1,
            });

            expect(respuesta.status).toBe(201);
            expect(respuesta.body.rol).toBe('JUGADOR');

            // Se comprueba en la base, no solo en la respuesta
            const guardado = await Usuario.findOne({ where: { email: 'juan@test.com' } });
            expect(guardado.rol).toBe('JUGADOR');
            expect(guardado.complejo_id).toBeNull();
        });
    });

    describe('casos límite', () => {
        test('acepta una contraseña de exactamente 8 caracteres', async () => {
            const respuesta = await registrar({ ...DATOS_VALIDOS, password: '12345678' });

            expect(respuesta.status).toBe(201);
        });

        test('rechaza una contraseña de 7 caracteres', async () => {
            const respuesta = await registrar({ ...DATOS_VALIDOS, password: '1234567' });

            expect(respuesta.status).toBe(400);
            expect(await Usuario.count()).toBe(0);
        });

        test('el mismo email con mayúsculas cuenta como repetido', async () => {
            await registrar(DATOS_VALIDOS);

            const respuesta = await registrar({ ...DATOS_VALIDOS, email: 'JUAN@Test.com' });

            expect(respuesta.status).toBe(409);
            expect(await Usuario.count()).toBe(1);
        });
    });

    describe('errores', () => {
        test('rechaza un email ya registrado con 409', async () => {
            await registrar(DATOS_VALIDOS);

            const respuesta = await registrar(DATOS_VALIDOS);

            expect(respuesta.status).toBe(409);
            expect(respuesta.body).toEqual({ error: 'Ya existe una cuenta con ese email' });
        });

        test.each(['nombre', 'apellido', 'email', 'telefono', 'password'])(
            'rechaza el registro sin %s con 400',
            async (campo) => {
                const datos = { ...DATOS_VALIDOS };
                delete datos[campo];

                const respuesta = await registrar(datos);

                expect(respuesta.status).toBe(400);
                expect(await Usuario.count()).toBe(0);
            }
        );
    });
});