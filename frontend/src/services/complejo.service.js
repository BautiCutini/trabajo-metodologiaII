import { apiFetch } from './api';

export async function listarComplejos() {
    // El back pagina de a 100 como máximo; para el mapa alcanza
    const respuesta = await apiFetch('/complejos?limit=100');
    return respuesta.data;
}