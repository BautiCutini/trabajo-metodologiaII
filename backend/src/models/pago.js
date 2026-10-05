const {DataTypes} = Require('sequelize');
const Pago = (Sequelize) => {
    return Sequelize.define('Pago', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
            },
        monto: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
            },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false
            },
        metodo_pago: {
            type: DataTypes.ENUM('MERCADOPAGO','TRANSFERENCIA'),
            allowNull: false
            },
        estado: {
            type: DataTypes.ENUM('PENDIENTE', 'CONFIRMADO', 'RECHAZADO'),
            allowNull: false
            },
        reserva_id: {
            type: DataTypes.INTEGER,
            allowNull: false
            }
        }, 
        {
            tableName: 'pagos',
            timestamps: false
        });
    };
    
    module.exports = Pago;