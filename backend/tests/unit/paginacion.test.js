const { leerPaginacion, respuestaPaginada } = require('../../src/utils/paginacion');

const CAMPOS = ['id', 'nombre', 'email'];

describe('leerPaginacion', () => {
    describe('casos normales', () => {
        test('sin parámetros usa la página 1, 10 resultados y el orden por defecto', () => {
            const resultado = leerPaginacion({}, CAMPOS, 'nombre');

            expect(resultado).toEqual({
                page: 1,
                limit: 10,
                offset: 0,
                order: [['nombre', 'ASC']],
            });
        });

        test('calcula el offset según la página pedida', () => {
            const resultado = leerPaginacion({ page: '3', limit: '20' }, CAMPOS);

            expect(resultado.offset).toBe(40);
        });

        test('respeta un campo de orden permitido y la dirección DESC', () => {
            const resultado = leerPaginacion({ sortBy: 'email', order: 'desc' }, CAMPOS);

            expect(resultado.order).toEqual([['email', 'DESC']]);
        });
    });

    describe('casos límite', () => {
        test('acepta exactamente 100 resultados por página', () => {
            expect(leerPaginacion({ limit: '100' }, CAMPOS).limit).toBe(100);
        });

        test('recorta a 100 un pedido de 101 resultados', () => {
            expect(leerPaginacion({ limit: '101' }, CAMPOS).limit).toBe(100);
        });

        test('un límite negativo se lleva al mínimo de 1', () => {
            expect(leerPaginacion({ limit: '-5' }, CAMPOS).limit).toBe(1);
        });

        test('un límite de 0 se trata como no enviado y usa 10', () => {
            expect(leerPaginacion({ limit: '0' }, CAMPOS).limit).toBe(10);
        });

        test('lleva a la página 1 una página negativa', () => {
            expect(leerPaginacion({ page: '-5' }, CAMPOS).page).toBe(1);
        });
    });

    describe('errores', () => {
        test('ignora un campo de orden que no está en la lista blanca', () => {
            const resultado = leerPaginacion({ sortBy: 'password' }, CAMPOS, 'id');

            expect(resultado.order).toEqual([['id', 'ASC']]);
        });

        test('trata valores no numéricos como si no se hubieran enviado', () => {
            const resultado = leerPaginacion({ page: 'abc', limit: 'muchos' }, CAMPOS);

            expect(resultado.page).toBe(1);
            expect(resultado.limit).toBe(10);
        });

        test('cualquier dirección que no sea DESC ordena ascendente', () => {
            const resultado = leerPaginacion({ order: 'DROP TABLE' }, CAMPOS);

            expect(resultado.order[0][1]).toBe('ASC');
        });
    });
});

describe('respuestaPaginada', () => {
    test('calcula la cantidad de páginas redondeando hacia arriba', () => {
        const respuesta = respuestaPaginada(['a', 'b'], 21, 1, 10);

        expect(respuesta.totalPages).toBe(3);
    });
});