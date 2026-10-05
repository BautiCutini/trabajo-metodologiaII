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
            }
        }, 
        {
            tableName: 'complejos',
            timestamps: false
        });
    };
    
module.exports = Complejo;
