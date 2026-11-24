require('dotenv').config();

const app = require('./app');

const {sequelize} = require ('./models');



async function iniciarServidor() {
    try {
        // Esperamos a que la base de datos esté disponible.
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida');

        // Solo iniciamos Express cuando la conexión fue exitosa.
        app.listen(3001, '0.0.0.0', () => {
            console.log('API en 3001');
        });
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
        process.exit(1);
    }
}

iniciarServidor();