const { normalizarHora, aMinutos, aHora } = require('../../src/utils/horas');

describe('normalizarHora', () => {
    describe('casos normales', () => {
        test('completa los segundos de una hora HH:MM', () => {
            expect(normalizarHora('20:00')).toBe('20:00:00');
        });

        test('acepta el formato HH:MM:SS y descarta los segundos', () => {
            expect(normalizarHora('18:30:45')).toBe('18:30:00');
        });
    });

    describe('casos límite', () => {
        test('acepta 00:00 como inicio del día', () => {
            expect(normalizarHora('00:00')).toBe('00:00:00');
        });

        test('acepta 23:59 como último minuto común', () => {
            expect(normalizarHora('23:59')).toBe('23:59:00');
        });

        test('acepta 24:00 como medianoche de cierre de un turno', () => {
            expect(normalizarHora('24:00')).toBe('24:00:00');
        });

        test('rechaza 24:01: después de 24:00 no hay horas válidas', () => {
            expect(normalizarHora('24:01')).toBeNull();
        });
    });

    describe('errores', () => {
        test.each([
            ['25:00', 'hora fuera de rango'],
            ['12:60', 'minutos fuera de rango'],
            ['7:30', 'hora sin cero adelante'],
            ['abc', 'texto que no es una hora'],
            ['', 'texto vacío'],
        ])('rechaza "%s" (%s)', (valor) => {
            expect(normalizarHora(valor)).toBeNull();
        });

        test.each([null, undefined, 2000])('rechaza valores que no son texto: %p', (valor) => {
            expect(normalizarHora(valor)).toBeNull();
        });
    });
});

describe('aMinutos y aHora', () => {
    test('convierten en los dos sentidos sin perder información', () => {
        expect(aMinutos('18:30:00')).toBe(1110);
        expect(aHora(1110)).toBe('18:30:00');
    });

    test('1440 minutos se representan como 24:00:00', () => {
        expect(aHora(1440)).toBe('24:00:00');
    });
});