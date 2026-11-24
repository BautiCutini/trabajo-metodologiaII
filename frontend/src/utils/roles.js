// Nombres legibles de cada rol, para mostrarlos en la interfaz
export const NOMBRE_ROL = {
    JUGADOR: 'Jugador',
    ENCARGADO: 'Encargado',
    ADMIN_COMPLEJO: 'Administrador de complejo',
    ADMIN_PLATAFORMA: 'Administrador de la plataforma',
};

export const ROLES = Object.keys(NOMBRE_ROL);

// Estos roles trabajan para un complejo y necesitan tenerlo asignado
export const ROLES_CON_COMPLEJO = ['ENCARGADO', 'ADMIN_COMPLEJO'];