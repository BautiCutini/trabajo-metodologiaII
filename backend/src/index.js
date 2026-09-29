require("dotenv").config();

const express = require("express");
const sequelize = require ("./config/database");
const app = express();

app.get('/api/health', (req, res) => res.json({ ok: true }));

sequelize. authenticate()
    .then(() => console.log('Conexión a la base de datos establecida'))
    .catch((error) => console.error('No se pudo conectar a la base de datos:', error));
    

    app.listen(3001, '0.0.0.0', () => console.log('API en 3001'));
