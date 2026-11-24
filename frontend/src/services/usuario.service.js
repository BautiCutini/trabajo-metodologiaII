import { apiFetch, armarQuery } from './api';

export function listarUsuarios(parametros = {}) {
    return apiFetch(`/usuarios${armarQuery(parametros)}`);
}

export function obtenerUsuario(id) {
    return apiFetch(`/usuarios/${id}`);
}

export function crearUsuario(datos) {
    return apiFetch('/usuarios', { method: 'POST', body: datos });
}

export function actualizarUsuario(id, datos) {
    return apiFetch(`/usuarios/${id}`, { method: 'PATCH', body: datos });
}

export function darDeBajaUsuario(id) {
    return apiFetch(`/usuarios/${id}`, { method: 'DELETE' });
}