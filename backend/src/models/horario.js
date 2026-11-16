const { DataTypes } = require('sequelize');

const Horario = (Sequelize) => {
    return Sequelize.define('Horario', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cancha_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        //* Establecí un rango de 0 a 6 para representar los días de la semana.
        dia_semana: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 6
            }
        },
        hora_inicio: {
            type: DataTypes.TIME,
            allowNull: false
        },
        hora_fin: {
            type: DataTypes.TIME,
            allowNull: false
        },
        //* Permito habilitar o deshabilitar un horario sin eliminarlo de la base de datos.
        estado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'horarios',
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

module.exports = Horario;
