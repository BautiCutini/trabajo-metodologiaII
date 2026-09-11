# TRABAJO-METODOLOGIA-2

## Integrantes:
- Francesco Di Carli
- Bautista Cutini
- Bautista Bartolini

## Breve descripcion de proyecto:
El proyecto consiste en desarrollar una aplicación de reservas de canchas deportivas. Los usuarios podrán registrarse, consultar la disponibilidad 
y los precios de las canchas, realizar reservas y evaluar su estado. Por otro lado, los propietarios podrán gestionar las reservas y consultar los 
horarios con mayor y menor demanda, facilitando la organización y administración de su negocio.
## Instrucciones para levantar el proyecto:

## Requisitos
    - Tener Docker Desktop instalado y en ejecución.
    - Tener Git instalado.
    
## Clonar el repositorio

```
git clone https://github.com/BautiCutini/trabajo-metodologiaII.git
cd trabajo-metodologiaII
```

## Configuración

Antes de levantar el proyecto, copiar el archivo de ejemplo y completar los valores:

```
cp .env.example .env
```

Variables obligatorias (sin esto Postgres no levanta):
- DB_NAME, DB_USER, DB_PASSWORD
- JWT_SECRET

El resto de las variables (puertos) tiene valores por defecto definidos en el `.env.example`.

## Levantar el proyecto

Desde la carpeta raíz del proyecto ejecutar:

```
docker compose up --build
```

## Tecnologías utilizadas

**Backend**
- **Express** — framework minimalista, sin estructura impuesta, lo que permite 
  organizar el código como el equipo defina, lo venimos utilizando en varias materias
- **Sequelize (ORM)** — migraciones versionadas para reconstruir el schema desde 
  cero, y protección contra SQL injection por defecto.

**Base de datos**
- **PostgreSQL** — relacional, adecuado para el dominio (turnos, usuarios, 
  canchas con relaciones claras entre sí). Soporta timestamps con zona horaria, 
  relevante para un sistema de reservas.
- **Adminer** — cliente web liviano para administrar la base durante el 
  desarrollo, más rápido de levantar que alternativas como pgAdmin.

**Frontend**
- **React** — librería más utilizada del mercado y la que mas fresca  y utilizada tenemos de momento.
- **Vite** — arranque y hot-reload más rápidos que alternativas como Create 
  React App.

**Infraestructura**
- **Docker / Docker Compose** — entorno reproducible entre las máquinas del 
  equipo, sin depender de lo que cada uno tenga instalado localmente.
