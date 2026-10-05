const {DataTypes} = Require('sequelize');
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
            
        horarios: {
                type: DataTypes.JSONB,
                allowNull: false
        },
        precio: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
        },
        complejo_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: 'canchas',
            timestamps: false
        });
    };
    
    module.exports = Cancha;