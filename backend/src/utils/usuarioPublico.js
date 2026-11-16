// Versión del usuario que se puede devolver al cliente: sin contraseña.
function usuarioPublico(usuario) {
    return {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol,
        complejo_id: usuario.complejo_id,
        imagen_url: usuario.imagen_url,
        estado: usuario.estado
    };
}

module.exports = usuarioPublico;