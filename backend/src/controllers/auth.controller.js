const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// Arma la versión del usuario que se puede devolver al cliente: sin contraseña.
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

async function registro(req, res) {
    try {
        const { nombre, apellido, email, password, telefono } = req.body;

        if (!nombre || !apellido || !email || !password || !telefono) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
        }

        const emailNormalizado = email.trim().toLowerCase();
        const existente = await Usuario.findOne({ where: { email: emailNormalizado } });
        if (existente) {
            return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
        }

        // El registro público SIEMPRE crea jugadores, venga lo que venga en el body.
        const usuario = await Usuario.create({
            nombre,
            apellido,
            email: emailNormalizado,
            password,
            telefono,
            rol: 'JUGADOR',
            complejo_id: null
        });

        return res.status(201).json(usuarioPublico(usuario));
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
        }
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
        }

        const usuario = await Usuario.scope('conPassword').findOne({
            where: { email: email.trim().toLowerCase() }
        });

        // Mismo mensaje si el usuario no existe o si la contraseña está mal.
        if (!usuario || !(await usuario.validarPassword(password))) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        if (usuario.estado === 'INACTIVO') {
            return res.status(403).json({ error: 'La cuenta está deshabilitada' });
        }

        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol, complejo_id: usuario.complejo_id },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.json({ token, usuario: usuarioPublico(usuario) });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function perfil(req, res) {
    try {
        const usuario = await Usuario.findByPk(req.usuario.id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        return res.json(usuarioPublico(usuario));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = { registro, login, perfil };