// A dónde va cada rol después de iniciar sesión.
// Importante: cada ruta tiene que permitir a ese rol en AppRoutes; si no, se arma un bucle de redirecciones.
const RUTA_INICIAL = {
    JUGADOR: '/',
    ENCARGADO: '/admin',
    ADMIN_COMPLEJO: '/admin',
    ADMIN_PLATAFORMA: '/plataforma/usuarios',
};

export function rutaSegunRol(rol) {
    return RUTA_INICIAL[rol] ?? '/';
}