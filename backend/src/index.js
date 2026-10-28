require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

sequelize.authenticate()
    .then(() => console.log('Conexión a la base de datos establecida'))
    .catch((error) => console.error('No se pudo conectar a la base de datos:', error));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);

app.listen(3001, '0.0.0.0', () => console.log('API en 3001'));
