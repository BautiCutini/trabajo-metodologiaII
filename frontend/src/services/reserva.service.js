import { apiFetch } from './api';

// Arma "?a=1&b=2" ignorando los valores vacíos
function aQuery(params = {}) {
    const query = new URLSearchParams();
    for (const [clave, valor] of Object.entries(params)) {
        if (valor !== undefined && valor !== null && valor !== '') {
            query.set(clave, valor);
        }
    }
    const texto = query.toString();
    return texto ? `?${texto}` : '';
}

// Devuelve { data, total, page, limit, totalPages }.
// El back ya filtra por complejo según quién pregunta.
export function listarReservas(filtros) {
    return apiFetch(`/reservas${aQuery(filtros)}`);
}

export function crearReserva(datos) {
    return apiFetch('/reservas', { method: 'POST', body: datos });
}

export function confirmarReserva(id) {
    return apiFetch(`/reservas/${id}/confirmar`, { method: 'PATCH' });
}

export function cancelarReserva(id) {
    return apiFetch(`/reservas/${id}/cancelar`, { method: 'PATCH' });
}

export function consultarDisponibilidad(canchaId, fecha) {
    return apiFetch(`/reservas/disponibilidad${aQuery({ cancha_id: canchaId, fecha })}`);
}