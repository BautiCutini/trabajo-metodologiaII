import { apiFetch } from './api';

// Arma "?nombre=juan&rol=JUGADOR" salteando los filtros vacíos
function aQuery(parametros) {
    const query = new URLSearchParams();
    Object.entries(parametros).forEach(([clave, valor]) => {
        if (valor !== '' && valor !== undefined && valor !== null) {
            query.set(clave, valor);
        }
    });
    const texto = query.toString();
    return texto ? `?${texto}` : '';
}

export function listarUsuarios(parametros = {}) {
    return apiFetch(`/usuarios${aQuery(parametros)}`);
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