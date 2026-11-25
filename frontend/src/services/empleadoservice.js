import { apiFetch, armarQuery } from './api';

export function listarEmpleados(parametros = {}) {
    return apiFetch(`/empleados${armarQuery(parametros)}`);
}

export function crearEmpleado(datos) {
    return apiFetch('/empleados', { method: 'POST', body: datos });
}

export function darDeBajaEmpleado(id) {
    return apiFetch(`/empleados/${id}`, { method: 'DELETE' });
}
