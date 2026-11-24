import { apiFetch } from './api';

// Canchas activas de un complejo. El back pagina de a 100 como máximo.
export async function listarCanchasDelComplejo(complejoId) {
    const respuesta = await apiFetch(`/canchas?complejo_id=${complejoId}&limit=100`);
    return respuesta.data;
}