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
            // Agregué el campo usuario_id como opcional para permitir reservas sin un usuario asociado, como pueden ser reservas realizadas por el encargado de un complejo mediante un cliente que le solicitó la reserva por teléfono o por whatsapp.
            usuario_id: { 
                type: DataTypes.INTEGER,
                allowNull: true 
            },
            cancha_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        // Agregué la referencia al horario seleccionado para la reserva.
        horario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },{
            tableName: 'reservas',
            timestamps: false
        });
    };
    
    module.exports = Reserva;
