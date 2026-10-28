const {DataTypes} = require('sequelize');
const Cancha = (Sequelize) => {
    return Sequelize.define('Cancha', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
            },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
            },
        tipo: {
            type: DataTypes.ENUM(
                "techada",
                "descubierta"
            ),
            allowNull: false
            },
            
        capacidad: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

        precio: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
        },
        complejo_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        // Agregué la URL de la imagen de la cancha como un campo obligatorio.
        imagen_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Establecí ACTIVO como estado inicial para las canchas nuevas.
        estado: {
            type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
            allowNull: false,
            defaultValue: 'ACTIVO'
        }
    
        }, {
            tableName: 'canchas',
            timestamps: false,
            underscored: true
        });
    };
    
    module.exports = Cancha;