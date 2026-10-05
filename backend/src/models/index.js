/** Define las relaciones entre los modelos para que Sequelize pueda realizar las consultas correctamente.**/

const sequelize = require('../config/database');
const Reserva = require('./reserva')(sequelize);
const Cancha = require('./cancha')(sequelize);
const Complejo = require('./complejo')(sequelize);
const Pago = require('./pago')(sequelize);
const Usuario = require('./usuario')(sequelize);

Complejo.hasMany(Usuario);
Usuario.belongsTo(Complejo);

Complejo.hasMany(Cancha);
Cancha.belongsTo(Complejo);

Cancha.hasMany(Reserva);
Reserva.belongsTo(Cancha);

Reserva.hasMany(Pago);
Pago.belongsTo(Reserva);

Usuario.hasMany(Reserva);
Reserva.belongsTo(Usuario);

module.exports = {
    sequelize,
    Reserva,
    Cancha,
    Complejo,
    Pago,
    Usuario
};