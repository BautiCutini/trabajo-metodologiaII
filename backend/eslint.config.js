const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    {
        ignores: ['node_modules/'],
    },

    // Reglas recomendadas de ESLint para todo el backend
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'commonjs',
            globals: { ...globals.node },
        },
    },

    // Migraciones y seeders: sequelize-cli exige la firma up(queryInterface, Sequelize)
    // aunque no se use el segundo parámetro, así que no se marcan parámetros sin uso
    {
        files: ['src/migrations/**/*.js', 'src/seeders/**/*.js'],
        rules: {
            'no-unused-vars': ['error', { args: 'none' }],
        },
    },

    // Los tests usan las funciones globales de Jest (describe, test, expect…)
    {
        files: ['tests/**/*.js'],
        languageOptions: {
            globals: { ...globals.jest },
        },
    },
];