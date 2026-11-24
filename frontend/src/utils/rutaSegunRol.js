// A dónde va cada rol después de iniciar sesión.
// Importante: cada ruta tiene que permitir a ese rol en AppRoutes; si no, se arma un bucle de redirecciones.
// El encargado y el administrador de complejo pasan a su panel cuando existan sus pantallas.
const RUTA_INICIAL = {
    JUGADOR: '/',
    ENCARGADO: '/',
    ADMIN_COMPLEJO: '/',
    ADMIN_PLATAFORMA: '/plataforma/usuarios',
};

export function rutaSegunRol(rol) {
    return RUTA_INICIAL[rol] ?? '/';
}