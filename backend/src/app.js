const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const complejosRoutes = require('./routes/complejos.routes');
const canchasRoutes = require('./routes/canchas.routes');
const horariosRoutes = require('./routes/horarios.routes');
const pagosRoutes = require('./routes/pagos.routes');

// arma la aplicacion Express sin ponerla a escuchar
// asi los tests pueden usarla con Supertest sin abrir un puerto
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/complejos', complejosRoutes);
app.use('/api/v1/canchas', canchasRoutes);
app.use('/api/v1/horarios', horariosRoutes);
app.use('/api/v1/pagos', pagosRoutes);

module.exports = app;