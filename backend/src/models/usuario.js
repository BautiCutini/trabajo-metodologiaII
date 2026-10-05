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
        complejo_id: {
            type: DataTypes.INTEGER,
            allowNull: false
            }
        },
        {
            tableName: 'usuarios',
            timestamps: false
        });
};

module.exports = Usuario;