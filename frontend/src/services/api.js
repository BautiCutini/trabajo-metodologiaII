const BASE_URL = `${import.meta.env.VITE_API_URL}/v1`;
const CLAVE_TOKEN = 'picado_token';

export class ApiError extends Error {
    constructor(status, mensaje) {
        super(mensaje);
        this.name = 'ApiError';
        this.status = status;
    }
}

export function guardarToken(token) {
    localStorage.setItem(CLAVE_TOKEN, token);
}

export function leerToken() {
    return localStorage.getItem(CLAVE_TOKEN);
}

export function borrarToken() {
    localStorage.removeItem(CLAVE_TOKEN);
}

export async function apiFetch(ruta, { method = 'GET', body } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    const token = leerToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    let respuesta;
    try {
        respuesta = await fetch(`${BASE_URL}${ruta}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
    } catch {
        throw new ApiError(0, 'No se pudo conectar con el servidor');
    }

    const datos = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
        // Token vencido o inválido: se cierra la sesión.
        // En el login, un 401 significa credenciales incorrectas, así que no se redirige.
        if (respuesta.status === 401 && ruta !== '/auth/login') {
            borrarToken();
            window.location.assign('/login');
        }

        const error = datos?.error;
        const mensaje = Array.isArray(error) ? error.join('. ') : error || 'Error inesperado';
        throw new ApiError(respuesta.status, mensaje);
    }

    return datos;
}