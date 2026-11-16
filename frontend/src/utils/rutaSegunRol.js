// Por ahora todos van al inicio. Cuando existan los paneles:
// ENCARGADO y ADMIN_COMPLEJO → '/admin', ADMIN_PLATAFORMA → '/plataforma'.
const RUTA_INICIAL = {
    JUGADOR: '/',
    ENCARGADO: '/',
    ADMIN_COMPLEJO: '/',
    ADMIN_PLATAFORMA: '/',
};

export function rutaSegunRol(rol) {
    return RUTA_INICIAL[rol] ?? '/';
}