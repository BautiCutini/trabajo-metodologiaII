const { Op, fn, col, where } = require('sequelize');

// Condición "la columna contiene el texto", sin importar mayúsculas ni acentos.
// Usa la extensión unaccent de Postgres (la habilita la migración habilitar-unaccent).
function contieneSinAcentos(columna, texto) {
    return where(fn('unaccent', col(columna)), { [Op.iLike]: fn('unaccent', `%${texto}%`) });
}

module.exports = { contieneSinAcentos };