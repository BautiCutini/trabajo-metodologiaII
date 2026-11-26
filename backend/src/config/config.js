require("dotenv").config({
    path: require("path").resolve(__dirname, "../../../.env"),
});

const base = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
};

module.exports = {
    development: {
        ...base,
        database: process.env.DB_NAME,
    },
    // Base separada para los tests de integración: se vacía en cada test
    test: {
        ...base,
        database: process.env.DB_NAME_TEST || "canchas_test",
    },
};