# Picado · Reserva de canchas

Aplicación web para reservar canchas deportivas en Bahía Blanca. Los jugadores consultan la disponibilidad y reservan turnos; los complejos gestionan sus canchas, horarios y reservas, incluidas las que reciben por teléfono, WhatsApp o mostrador.

Proyecto integrador de Metodología de Sistemas II · Tecnicatura Universitaria en Programación · UTN Bahía Blanca.

## Integrantes

- Francesco Di Carli
- Bautista Cutini
- Bautista Bartolini

## Estado actual

| Funcionalidad | Estado |
|---|---|
| Registro, login y sesión con roles | ✅ |
| Usuarios, complejos, canchas y horarios (API) | ✅ |
| Generación automática de la grilla semanal de horarios | ✅ |
| Mapa de complejos | ✅ |
| Reservas | 🚧 en desarrollo |
| Paneles del encargado y del administrador | 🚧 en desarrollo |

## Requisitos

- **Docker Desktop**, instalado y en ejecución.
- **Git**.

No hace falta instalar Node.js ni PostgreSQL: corren dentro de los contenedores (Node 22 y PostgreSQL 16).

## Puesta en marcha

### 1. Clonar el repositorio

```
git clone https://github.com/BautiCutini/trabajo-metodologiaII.git
cd trabajo-metodologiaII
```

### 2. Configurar las variables de entorno

```
cp .env.example .env        # Linux / macOS
copy .env.example .env      # Windows
```

| Variable | Obligatoria | Para qué sirve |
|---|---|---|
| `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Sí | Base de datos. Sin estas, Postgres no levanta. |
| `JWT_SECRET` | Sí | Firma de los tokens de sesión |
| `ADMIN_PASSWORD` | Para los seeders | Contraseña de los usuarios de prueba |
| `DB_PORT`, `BACKEND_PORT`, `FRONTEND_PORT`, `ADMINER_PORT` | No | Puertos; tienen valores por defecto |

El `.env` real nunca se sube al repositorio.

### 3. Levantar los contenedores

```
docker compose up -d --build
```

| Servicio | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:3001/api |
| Adminer (cliente web de la base) | http://localhost:8080 |

No hace falta ejecutar `npm run dev` en la computadora: el contenedor del frontend ya lo hace. Si se ejecuta además en local, los dos Vite compiten por el puerto 5173.

### 4. Crear las tablas y cargar datos de prueba

La primera vez, y cada vez que se agreguen migraciones nuevas:

```
docker compose exec backend npx sequelize-cli db:migrate
docker compose exec backend npx sequelize-cli db:seed:all
```

Usuarios que crean los seeders (todos con la contraseña de `ADMIN_PASSWORD`):

| Email | Rol |
|---|---|
| francescodicarl@gmail.com | ADMIN_PLATAFORMA |
| juan.jugador@example.com | JUGADOR |
| carlos.encargado@example.com | ENCARGADO (Complejo 1) |
| maria.admin@example.com | ADMIN_COMPLEJO (Complejo 1) |

Para recargar los datos, no usar `db:seed:undo:all`: los ids no vuelven a 1 y los seeders fallan. Vaciar las tablas desde Adminer con:

```
TRUNCATE complejos, usuarios, canchas, horarios, reservas, pagos RESTART IDENTITY CASCADE;
```

### Empezar con una base limpia

```
docker compose down -v
docker compose up -d --build
docker compose exec backend npx sequelize-cli db:migrate
docker compose exec backend npx sequelize-cli db:seed:all
```

El `--build` es necesario: `down -v` también borra las dependencias instaladas.

## Tests y calidad

Preparación, una sola vez: crear la base de prueba y aplicarle las migraciones.

```
docker compose exec db sh -c 'createdb -U "$POSTGRES_USER" canchas_test'
docker compose exec backend npm run db:migrate:test
```

| Comando | Qué hace |
|---|---|
| `docker compose exec backend npm test` | Todos los tests |
| `docker compose exec backend npm run test:unit` | Tests unitarios |
| `docker compose exec backend npm run test:integration` | Tests de integración (base `canchas_test`) |
| `docker compose exec backend npm run lint` | Análisis estático con ESLint |
| `docker compose exec backend npm run check` | Lint y, si pasa, todos los tests. **Ejecutarlo antes de abrir un PR.** |

Qué se prueba y por qué: [docs/pruebas.md](docs/pruebas.md).

## Estructura del repositorio

```
├── backend/
│   ├── src/
│   │   ├── app.js            Arma la aplicación Express (rutas y middlewares)
│   │   ├── index.js          Conecta a la base y levanta el servidor
│   │   ├── config/           Conexión a la base por entorno (desarrollo / test)
│   │   ├── models/           Modelos de Sequelize y sus relaciones
│   │   ├── migrations/       Cambios de esquema versionados
│   │   ├── seeders/          Datos de prueba
│   │   ├── routes/           Endpoints y qué middlewares protegen cada uno
│   │   ├── controllers/      Lógica de cada endpoint
│   │   ├── middlewares/      Autenticación, roles y pertenencia a un complejo
│   │   └── utils/            Funciones compartidas (horas, paginación…)
│   └── tests/
│       ├── unit/             Tests unitarios
│       └── integration/      Tests de integración
├── frontend/
│   ├── src/
│   │   ├── pages/            Una carpeta por tipo de usuario
│   │   ├── components/       ui/ (botones, inputs), layout/, mapa/…
│   │   ├── context/          Sesión del usuario (AuthContext)
│   │   ├── services/         Llamadas a la API
│   │   ├── routes/           Rutas y protección por sesión y rol
│   │   └── styles/           Variables de diseño y estilos globales
│   └── docs/                 Guía de identidad visual
├── docs/                     Decisiones de diseño y estrategia de pruebas
└── compose.yml               Servicios: db, backend, frontend, adminer
```

## Referencia rápida de la API

Base: `http://localhost:3001/api/v1`. Las rutas protegidas requieren el header `Authorization: Bearer <token>`, que se obtiene en el login.

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/auth/registro` | Público (siempre crea un JUGADOR) |
| POST | `/auth/login` | Público |
| GET | `/auth/perfil` | Cualquier usuario logueado |
| GET · POST · PATCH · DELETE | `/usuarios` | ADMIN_PLATAFORMA |
| GET | `/complejos`, `/complejos/:id` | Público |
| POST · DELETE | `/complejos` | ADMIN_PLATAFORMA |
| PATCH | `/complejos/:id` | Administradores de ese complejo o de la plataforma |
| GET | `/canchas`, `/canchas/:id` | Público |
| POST · PATCH · DELETE | `/canchas` | Administradores de ese complejo o de la plataforma |
| GET | `/horarios`, `/horarios/:id` | Público |
| POST | `/horarios`, `/horarios/generar` | Administradores de ese complejo o de la plataforma |
| PATCH · DELETE | `/horarios/:id` | Administradores de ese complejo o de la plataforma |
| GET · POST · PUT | `/pagos` | Cualquier usuario logueado |

Los listados aceptan `page`, `limit` (máximo 100), `sortBy` y `order`, y responden `{ data, total, page, limit, totalPages }`.

## Documentación

- [Decisiones de diseño](docs/decisiones-diseño.md): problemas encontrados, alternativas evaluadas y trade-offs.
- [Pruebas automatizadas](docs/pruebas.md): qué se prueba, en qué nivel y por qué.
- [Guía de identidad visual](frontend/docs/guia_identidad_visual.md): colores, tipografía y componentes del frontend.

## Flujo de trabajo

- Cada cambio se desarrolla en su propia rama, que sale de `dev`, y se integra con un Pull Request revisado por otro integrante.
- Los mensajes de commit siguen [Conventional Commits](https://www.conventionalcommits.org/): `feat`, `fix`, `test`, `refactor`, `docs`, `chore`.
- Antes de abrir un PR: `docker compose exec backend npm run check`.

## Tecnologías utilizadas

**Backend**
- **Express**: framework minimalista, sin estructura impuesta, lo que permite organizar el código como el equipo defina. Lo venimos utilizando en varias materias.
- **Sequelize (ORM)**: migraciones versionadas para reconstruir el esquema desde cero, y protección contra SQL injection por defecto.
- **Jest y Supertest**: tests unitarios y de integración de la API.
- **ESLint**: análisis estático del código.

**Base de datos**
- **PostgreSQL**: relacional, adecuado para el dominio (turnos, usuarios y canchas con relaciones claras entre sí). Soporta restricciones de exclusión, que usamos para impedir reservas superpuestas.
- **Adminer**: cliente web liviano para administrar la base durante el desarrollo, más rápido de levantar que alternativas como pgAdmin.

**Frontend**
- **React**: la librería más utilizada del mercado y la que tenemos más fresca.
- **Vite**: arranque y recarga en caliente más rápidos que alternativas como Create React App.
- **Leaflet y OpenStreetMap**: mapa de complejos, sin claves ni costos.

**Infraestructura**
- **Docker y Docker Compose**: entorno reproducible entre las máquinas del equipo, sin depender de lo que cada uno tenga instalado localmente.