/** Define las relaciones entre los modelos para que Sequelize pueda realizar las consultas correctamente.**/

const sequelize = require('../config/database');

const Reserva = require('./reserva')(sequelize);
const Cancha = require('./cancha')(sequelize);
const Complejo = require('./complejo')(sequelize);
const Pago = require('./pago')(sequelize);
const Usuario = require('./usuario')(sequelize);
// Incorpore el modelo Horario para administrar los horarios disponibles de cada cancha.
const Horario = require('./horario')(sequelize);

// Relaciones entre complejos, usuarios y canchas.
Complejo.hasMany(Usuario, { foreignKey: 'complejo_id' });
Usuario.belongsTo(Complejo, { foreignKey: 'complejo_id' });

Complejo.hasMany(Cancha, { foreignKey: 'complejo_id' });
Cancha.belongsTo(Complejo, { foreignKey: 'complejo_id' });

// Relaciones entre canchas, horarios y reservas.
Cancha.hasMany(Horario, { foreignKey: 'cancha_id' });
Horario.belongsTo(Cancha, { foreignKey: 'cancha_id' });

Cancha.hasMany(Reserva, { foreignKey: 'cancha_id' });
Reserva.belongsTo(Cancha, { foreignKey: 'cancha_id' });

// Vinculé las reservas con el horario seleccionado, manteniendo horario_id como opcional.
Horario.hasMany(Reserva, { foreignKey: 'horario_id' });
Reserva.belongsTo(Horario, { foreignKey: 'horario_id' });

// Relaciones entre reservas, pagos y usuarios.
Reserva.hasMany(Pago, { foreignKey: 'reserva_id' });
Pago.belongsTo(Reserva, { foreignKey: 'reserva_id' });

Usuario.hasMany(Reserva, { foreignKey: 'usuario_id' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = {
    sequelize,
    Reserva,
    Cancha,
    Complejo,
    Pago,
    Usuario,
    Horario
};
