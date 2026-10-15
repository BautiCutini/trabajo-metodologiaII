const {DataTypes} = require('sequelize');
const Usuario = (Sequelize) => {
    return Sequelize.define('Usuario', {
        id:{
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
        // Agregué el campo complejo_id como opcional para los usuarios que no estén asociados a un complejo. como puededen ser los jugadores o los administradores de plataforma.
        complejo_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        // Agregué la URL de la imagen de perfil como un campo opcional.
        imagen_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // Establecí ACTIVO como estado inicial para los usuarios nuevos.
        estado: {
            type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
            allowNull: false,
            defaultValue: 'ACTIVO'
        }
    },
        {
            tableName: 'usuarios',
            timestamps: false
        });
};

module.exports = Usuario;