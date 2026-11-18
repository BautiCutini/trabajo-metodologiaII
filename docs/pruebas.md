# Pruebas automatizadas

Este documento describe qué comportamientos del backend están verificados con tests automatizados, por qué se eligieron y cómo ejecutarlos.

## Cómo ejecutarlas

Los comandos se ejecutan desde la raíz del repositorio, con los contenedores levantados.

**Preparación (una sola vez):** crear la base de prueba y aplicarle las migraciones.

```
docker compose exec db sh -c 'createdb -U "$POSTGRES_USER" canchas_test'
docker compose exec backend npm run db:migrate:test
```

Cada vez que se agregue una migración nueva, hay que volver a ejecutar `db:migrate:test`.

| Comando | Qué hace |
|---|---|
| `docker compose exec backend npm test` | Ejecuta todos los tests |
| `docker compose exec backend npm run test:unit` | Solo unitarios (no necesitan base de datos) |
| `docker compose exec backend npm run test:integration` | Solo integración (usan la base `canchas_test`) |
| `docker compose exec backend npm run lint` | Análisis estático con ESLint |
| `docker compose exec backend npm run check` | Lint y, si pasa, todos los tests |

Los tests de integración vacían tablas antes de cada caso. Por eso usan una base separada (`canchas_test`) y verifican el nombre de la base antes de ejecutarse: nunca tocan los datos de desarrollo.

## Estrategia

Elegimos los comportamientos según el **riesgo**: priorizamos la seguridad (quién puede hacer qué) y las reglas que usa el resto del sistema (formato de horas, paginación).

| Nivel | Qué verifica | Dependencias | Tests |
|---|---|---|---|
| Unitario | Una función aislada | Ninguna; `req`, `res` y `next` se reemplazan por dobles | 37 |
| Integración sin base | Que rutas y middlewares estén bien conectados | Express real + JWT real | 8 |
| Integración con base | Que la API, Sequelize y PostgreSQL colaboren | Sistema backend completo + base `canchas_test` | 13 |

### Por qué no hay tests E2E

Un test E2E del login (abrir el navegador, completar el formulario y ver el inicio) sería más lento y frágil, y el comportamiento que verificaría ya está cubierto: la API de registro y login por los tests de integración, y la protección de rutas por los de integración sin base. Lo dejamos planificado con Playwright para cuando el flujo de reserva esté completo, que es el recorrido crítico que justificaría su costo.

## Casos seleccionados

### `normalizarHora` — unitario · `tests/unit/horas.test.js`

Todos los horarios y reservas pasan por esta función. Un error acá permitiría guardar turnos con horas imposibles.

| Tipo | Entrada | Esperado | Por qué |
|---|---|---|---|
| Normal | `"20:00"` | `"20:00:00"` | Formato habitual |
| Normal | `"18:30:45"` | `"18:30:00"` | Se descartan los segundos |
| Límite | `"00:00"` | `"00:00:00"` | Inicio del día |
| Límite | `"24:00"` | `"24:00:00"` | Convención del proyecto para la medianoche de cierre |
| Límite | `"24:01"` | `null` | Justo después del máximo permitido |
| Error | `"25:00"`, `"12:60"`, `"7:30"`, `"abc"`, `""` | `null` | Formatos inválidos |
| Error | `null`, `undefined`, `2000` | `null` | Tipos que no son texto |

### `leerPaginacion` — unitario · `tests/unit/paginacion.test.js`

Protege a la base de pedidos enormes y evita que se ordene por campos no permitidos.

| Tipo | Entrada | Esperado | Por qué |
|---|---|---|---|
| Normal | sin parámetros | página 1, 10 resultados | Valores por defecto |
| Normal | `page=3, limit=20` | `offset = 40` | Cálculo de desplazamiento |
| Límite | `limit=100` | 100 | Máximo permitido |
| Límite | `limit=101` | 100 | Un pedido por encima del máximo se recorta |
| Límite | `limit=-5` | 1 | Mínimo permitido |
| Error | `sortBy=password` | orden por defecto | Lista blanca: no se puede ordenar por cualquier campo |
| Error | `order=DROP TABLE` | `ASC` | El texto del usuario nunca llega tal cual a la consulta |

### `autorizar` y `autenticar` — unitario · `tests/unit/autorizar.test.js`, `tests/unit/autenticar.test.js`

Son la seguridad de toda la API. Se prueban aislados reemplazando `req`, `res` y `next` por dobles de prueba (`jest.fn()`), que registran a qué status se respondió y si el pedido siguió al controlador.

| Tipo | Caso | Esperado |
|---|---|---|
| Normal | Token válido | Carga `req.usuario` y llama a `next()` |
| Normal | Rol incluido entre los permitidos | Llama a `next()` |
| Error | Sin header `Authorization` | 401 `Token no provisto` |
| Error | Header sin el prefijo `Bearer` | 401 |
| Error | Token vencido | 401 `Token expirado` |
| Error | Token firmado con otro secreto | 401 `Token inválido` |
| Error | Rol no permitido | 403 y **no** llama a `next()` |
| Error | Sin usuario autenticado | 401 |

### Protección de rutas — integración · `tests/integration/proteccion-rutas.test.js`

Los tests unitarios prueban cada middleware por separado; este verifica que estén **conectados** en la ruta real. Si alguien quitara `autorizar` de `/usuarios`, los unitarios seguirían pasando y este fallaría.

| Caso | Esperado |
|---|---|
| `GET /api/health` | 200 |
| `GET /usuarios` sin token | 401 |
| `GET /usuarios` con token adulterado | 401 |
| `GET /usuarios` como JUGADOR, ENCARGADO o ADMIN_COMPLEJO | 403 |
| `POST /usuarios` como JUGADOR, pidiendo rol de admin | 403 |
| Ruta inexistente | 404 |

### Registro de usuarios — integración con base · `tests/integration/registro.test.js`

Es la regla de seguridad más importante del alta: **nadie puede registrarse a sí mismo como administrador**. Se verifica contra PostgreSQL porque lo que importa es qué queda guardado, no solo qué responde la API.

| Tipo | Caso | Esperado |
|---|---|---|
| Normal | Datos válidos | 201, rol JUGADOR, sin contraseña en la respuesta |
| Normal | Datos válidos | La contraseña se guarda hasheada con bcrypt |
| Normal | Registrarse y luego iniciar sesión | El login devuelve un token |
| Seguridad | Pedir `rol: ADMIN_PLATAFORMA` y `complejo_id: 1` | Se guarda como JUGADOR y sin complejo |
| Límite | Contraseña de 8 caracteres | 201 |
| Límite | Contraseña de 7 caracteres | 400 y no se guarda nada |
| Límite | Mismo email con mayúsculas | 409: el email se normaliza |
| Error | Email ya registrado | 409 |
| Error | Falta cualquiera de los 5 campos obligatorios | 400 y no se guarda nada |

## Hallazgos durante la escritura de los tests

- **`limit=0` devuelve 10, no 1.** `parseInt('0')` es `0`, y `0 || 10` toma el valor por defecto. El test documenta el comportamiento actual. Queda abierta la pregunta de si es lo que el equipo quiere: el código está **verificado**, pero falta **validar** la regla.
- **ESLint detectó una variable sin uso** (`now`) en el seeder de usuarios, que se eliminó. Los otros 20 avisos eran el parámetro `Sequelize` de las migraciones, una firma que exige `sequelize-cli`; se ajustó la regla para esos archivos en lugar de modificarlos.

## Pendientes

- Tests de integración de reservas: la restricción `reservas_no_superpuestas` (dos reservas superpuestas en la misma cancha se rechazan; dos turnos consecutivos se aceptan).
- Un test E2E del flujo de reserva con Playwright.
- Tests del frontend.