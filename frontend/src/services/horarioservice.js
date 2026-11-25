import { apiFetch, armarQuery } from './api';

export function listarHorarios(parametros = {}) {
    return apiFetch(`/horarios${armarQuery(parametros)}`);
}

export function darDeBajaHorario(id) {
    return apiFetch(`/horarios/${id}`, { method: 'DELETE' });
}
