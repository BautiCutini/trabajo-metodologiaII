import { apiFetch } from './api';

export function login(email, password) {
    return apiFetch('/auth/login', { method: 'POST', body: { email, password } });
}

export function registrar(datos) {
    return apiFetch('/auth/registro', { method: 'POST', body: datos });
}

export function obtenerPerfil() {
    return apiFetch('/auth/perfil');
}