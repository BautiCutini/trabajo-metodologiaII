// lee page, limit, sortBy y order de la query y los devuelve validados
function leerPaginacion(query, camposOrdenables, campoPorDefecto = 'id') {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit) || 10, 1), 100);
    const offset = (page - 1) * limit;

    const sortBy = camposOrdenables.includes(query.sortBy) ? query.sortBy : campoPorDefecto;
    const direccion = String(query.order).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    return { page, limit, offset, order: [[sortBy, direccion]] };
}

// arma la respuesta estandar de todos los listados
function respuestaPaginada(rows, total, page, limit) {
    return {
        data: rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
}

module.exports = { leerPaginacion, respuestaPaginada };