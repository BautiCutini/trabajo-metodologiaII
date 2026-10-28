const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const Usuario = (Sequelize) => {
    const modelo = Sequelize.define('Usuario', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rol: {
            type: DataTypes.ENUM(
                "JUGADOR",
                "ENCARGADO",
                "ADMIN_COMPLEJO",
                "ADMIN_PLATAFORMA"
            ),
            allowNull: false
        },
        complejo_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        imagen_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        estado: {
            type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
            allowNull: false,
            defaultValue: 'ACTIVO'
        }
    }, {
        tableName: 'usuarios',
        timestamps: false,
        underscored: true,

        // Ninguna consulta devuelve el hash, salvo que se pida explícitamente.
        defaultScope: {
            attributes: { exclude: ['password'] }
        },
        scopes: {
            // Solo para el login, que necesita comparar la contraseña.
            conPassword: {
                attributes: { include: ['password'] }
            }
        },

        hooks: {
            // Normalizo el email para que Bauti@Gmail.com y bauti@gmail.com sean la misma cuenta.
            beforeValidate: (usuario) => {
                if (usuario.email) {
                    usuario.email = usuario.email.trim().toLowerCase();
                }
            },
            // Hasheo la contraseña solo si cambió, para no hashear un hash.
            beforeSave: async (usuario) => {
                if (usuario.changed('password')) {
                    usuario.password = await bcrypt.hash(usuario.password, 10);
                }
            }
        }
    });

    modelo.prototype.validarPassword = function (passwordPlano) {
        return bcrypt.compare(passwordPlano, this.password);
    };

    return modelo;
};

module.exports = Usuario;