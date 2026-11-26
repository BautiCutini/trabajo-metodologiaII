const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    // En los tests no se imprime cada consulta SQL, para poder leer los resultados
    logging: process.env.NODE_ENV === "test" ? false : console.log,
    }
);

module.exports = sequelize;