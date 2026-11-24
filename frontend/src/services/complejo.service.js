import { apiFetch, armarQuery } from './api';

// Complejos activos, para el mapa y los selectores (endpoint público)
export async function listarComplejos() {
    // El back pagina de a 100 como máximo; alcanza
    const respuesta = await apiFetch('/complejos?limit=100');
    return respuesta.data;
}

// Todos los complejos, incluidos los dados de baja (solo administrador de la plataforma)
export function listarTodosLosComplejos(parametros = {}) {
    return apiFetch(`/complejos/todos${armarQuery(parametros)}`);
}

export function crearComplejo(datos) {
    return apiFetch('/complejos', { method: 'POST', body: datos });
}

export function actualizarComplejo(id, datos) {
    return apiFetch(`/complejos/${id}`, { method: 'PATCH', body: datos });
}

export function darDeBajaComplejo(id) {
    return apiFetch(`/complejos/${id}`, { method: 'DELETE' });
}