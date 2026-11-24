// Cada rol arranca en su propio panel.
const RUTA_INICIAL = {
    JUGADOR: '/',
    ENCARGADO: '/admin',
    ADMIN_COMPLEJO: '/admin',
    ADMIN_PLATAFORMA: '/',
};

export function rutaSegunRol(rol) {
    return RUTA_INICIAL[rol] ?? '/';
}