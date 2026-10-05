const {DataTypes} = require('sequelize');
const Reserva = (Sequelize) => {
    return Sequelize.define('Reserva', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
            },
            fecha_turno: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            fecha_reserva: {
                type: DataTypes.DATE,
                allowNull: false
            },
            hora_inicio: {
                type: DataTypes.TIME,
                allowNull: false
            },
            hora_fin: {
                type: DataTypes.TIME,
                allowNull: false
            },
            estado: {
                type: DataTypes.ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA'),
                allowNull: false
            },
            usuario_id: { 
                type: DataTypes.INTEGER,
                allowNull: false
            },
            cancha_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: 'reservas',
            timestamps: false
        });
    };
    
    module.exports = Reserva;
