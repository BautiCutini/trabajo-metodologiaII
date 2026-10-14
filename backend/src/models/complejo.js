const {DataTypes} = require('sequelize');
const Complejo = (Sequelize) => {
    return Sequelize.define('Complejo', {
        id: {
            type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
        nombre: {
                type: DataTypes.STRING,
                allowNull: false
            },
        direccion: {
                type: DataTypes.STRING,
                allowNull: false
            },
        telefono: {
                type: DataTypes.STRING,
                allowNull: false
        },
        descripcion: {
                type: DataTypes.STRING,
                allowNull: false
            },
        //Agregué la URL de la imagen del complejo como un campo opcional.
        imagen_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // Establecí ACTIVO como estado inicial para los complejos nuevos.
        estado: {
            type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
            allowNull: false,
            defaultValue: 'ACTIVO'
            }
        }, 
        {
            tableName: 'complejos',
            timestamps: false
        });
    };
    
module.exports = Complejo;
