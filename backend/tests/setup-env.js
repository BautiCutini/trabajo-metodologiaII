// Se ejecuta antes de cada archivo de tests, antes de cargar cualquier módulo.
// Apunta la app a la base de prueba para no tocar nunca los datos de desarrollo,
// y fija un secreto propio para que los tests no dependan del .env de nadie.
process.env.NODE_ENV = 'test';
process.env.DB_NAME = process.env.DB_NAME_TEST || 'canchas_test';
process.env.JWT_SECRET = 'secreto-solo-para-tests';