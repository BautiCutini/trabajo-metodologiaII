const { DataTypes } = require('sequelize');

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
        // Permito reservas sin un usuario registrado.
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        // Datos de contacto para reservas sin usuario asociado.
        nombre_contacto: {
            type: DataTypes.STRING,
            allowNull: true
        },
        telefono_contacto: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cancha_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Referencia al horario seleccionado para la reserva.
        horario_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'reservas',
        timestamps: false,
        underscored: true,
        validate: {
            rangoHorasValido() {
                if (this.hora_inicio >= this.hora_fin) {
                    throw new Error(
                        'La hora de inicio debe ser anterior a la hora de fin'
                    );
                }
            }
        }
    });
};

module.exports = Reserva;
