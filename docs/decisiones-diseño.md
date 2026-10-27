# Decisiones de diseño

**Metodología de Sistemas II · TUP 2026 — Proyecto integrador**
Sistema de gestión de turnos de canchas · Repositorio: `BautiCutini/trabajo-metodologiaII`

Integrantes: Bautista Cutini · Bautista Bartolini · Francesco Di Carli

Este documento registra tres análisis de diseño sobre el código del proyecto. Dos derivaron en cambios ya aplicados; el tercero en la decisión de conservar la estructura actual. Al final se listan los hallazgos abiertos, con el criterio de mejora de cada uno.

---

## Caso 1 — Horarios de cancha: de campo JSONB a entidad propia

### 1. Código analizado

| Archivo | Rol en el análisis |
|---|---|
| `backend/src/models/cancha.js` | Declaraba el campo `horarios` como `DataTypes.JSONB` |
| `backend/src/models/horario.js` | Modelo nuevo, resultado de la decisión |
| `backend/src/migrations/20261014002336-create-horarios.js` | Crea la tabla `horarios` con su FK y su constraint |
| `backend/src/migrations/20261014053035-remove-horarios-jsonb-from-canchas.js` | Elimina la columna JSONB |
| `backend/src/models/index.js`, líneas 21–22 y 28–29 | Asocia `Horario` con `Cancha` y con `Reserva` |

La estructura original guardaba toda la grilla horaria de una cancha dentro de una sola celda:

```js
horarios: {
    type: DataTypes.JSONB,
    allowNull: false
}
```

### 2. Diagnóstico

El campo concentraba información que el sistema necesita **consultar y restringir**, no solo leer.

La consulta central de la aplicación —qué canchas tienen un turno libre determinado día a determinada hora— tenía que resolverse recorriendo documentos JSON en memoria. PostgreSQL puede indexar un JSONB con un índice GIN, pero ese índice responde preguntas de contención ("qué canchas tienen la clave jueves"), no comparaciones sobre el contenido ("qué horario incluye las 21:00"). Para eso el motor debía leer todas las canchas y abrir cada documento.

El problema de fondo es más grave que el rendimiento: **una restricción de integridad solo puede expresarse entre filas**. PostgreSQL verifica unicidad, exclusión o solapamiento comparando un valor nuevo contra valores indexados de otras filas. Con la grilla encerrada en una celda, no existe nada que comparar, y la garantía de que dos turnos no se superpongan quedaba necesariamente en el código de la aplicación.

Esa validación en código abre una ventana entre consultar y escribir. Dos reservas simultáneas pueden leer el mismo estado "libre" y guardarse las dos, porque consulta y escritura son operaciones separadas. No es un defecto que se corrija escribiendo mejor el condicional.

**Conceptos aplicados.** Es un caso de **acoplamiento fuerte** entre una decisión de almacenamiento y las capacidades del motor: la forma elegida para guardar el dato le impedía a la base cumplir una responsabilidad que le corresponde. También aplica el criterio de **única fuente de verdad** de Clean Code: con la regla de no solapamiento viviendo solo en el código, cualquier vía de escritura que no pase por ese código la evade.

### 3. Alternativas consideradas

**A. Conservar el JSONB y validar en la aplicación.**
Es la opción más barata en el corto plazo y no requiere migración. Se descartó porque deja la integridad fuera del motor y no resuelve la condición de carrera.

**B. Conservar el JSONB y agregar bloqueo explícito o aislamiento serializable.**
Resuelve la concurrencia, pero exige recordar el bloqueo en cada endpoint que escriba reservas, degrada el rendimiento al serializar accesos y sigue sin permitir indexar la consulta de disponibilidad. Traslada el problema a disciplina del equipo.

**C. Extraer los horarios a una tabla propia.** *(elegida)*
Cada franja pasa a ser una fila con `cancha_id`, `dia_semana`, `hora_inicio`, `hora_fin` y `estado`. Habilita índices sobre las columnas que la consulta filtra y deja el camino abierto a expresar restricciones a nivel base.

### 4. Decisión

Se adoptó la alternativa C. La columna `horarios` se eliminó de `canchas` y se creó la tabla `horarios` con su clave foránea hacia `canchas`.

El criterio fue ubicar la integridad en el motor y no en el controlador. Una regla que la base garantiza es imposible de evadir, venga de donde venga la escritura: otro endpoint, un seed, una consulta manual. Una regla que vive en el código depende de que todos los caminos de escritura la respeten.

La decisión se tomó **antes de implementar los controladores**, de modo que no hubo comportamiento observable que preservar. No fue un refactoring sino una decisión de modelado previa a construir encima, tomada precisamente para no contraer la deuda en lugar de pagarla después.

Se agregó además una restricción `CHECK` sobre `dia_semana` directamente en SQL, en la misma migración:

```sql
ALTER TABLE horarios
ADD CONSTRAINT check_horarios_dia_semana
CHECK (dia_semana BETWEEN 0 AND 6);
```

El modelo ya declara el mismo rango con `validate: { min: 0, max: 6 }`. La duplicación es deliberada: la validación de Sequelize da mensajes de error útiles a la aplicación, y la restricción de la base garantiza el invariante aunque la escritura no pase por el ORM.

### 5. Evidencia y trade-offs

**Evidencia**

- `backend/src/migrations/20261014002336-create-horarios.js` — creación de la tabla, FK con `onDelete: RESTRICT` y constraint `check_horarios_dia_semana`
- `backend/src/migrations/20261014053035-remove-horarios-jsonb-from-canchas.js` — eliminación de la columna, con `down` que la restituye
- `backend/src/models/horario.js` — modelo nuevo
- `backend/src/models/index.js:21` — `Cancha.hasMany(Horario, { foreignKey: 'cancha_id' })`

**Beneficios**

- La consulta de disponibilidad puede usar índices sobre `dia_semana`, `hora_inicio` y `hora_fin`.
- Habilita expresar la restricción de no solapamiento de reservas a nivel base de datos.
- `estado` como booleano permite deshabilitar una franja sin borrarla, conservando el histórico de reservas que la referencian.
- Evita un comportamiento de Sequelize que genera defectos silenciosos: modificar un JSONB en el lugar no marca el campo como cambiado y el `UPDATE` nunca se emite.

**Costos**

- Una tabla y un modelo más que mantener; cargar la grilla de una cancha pasa de leer un campo a insertar varias filas.
- Las consultas que necesiten cancha y horarios juntos requieren `include`, con el costo de join correspondiente.
- La migración es reversible en estructura pero no en datos: el `down` restituye la columna vacía.

**Lo que esta decisión habilitó y ya se implementó.** Con los horarios como filas, se incorporó una restricción de exclusión a nivel de PostgreSQL que impide registrar reservas superpuestas para una misma cancha.

La migración `202610151214343-prevent-overlapping-reservas.js` habilita la extensión `btree_gist` y agrega la restricción `reservas_no_superpuestas`, que compara `cancha_id` por igualdad y el intervalo temporal de la reserva por solapamiento. Las reservas canceladas quedan excluidas de esta restricción, por lo que no bloquean la disponibilidad.

Además, se incorporaron restricciones para garantizar que la hora de inicio sea anterior a la hora de fin y que el horario seleccionado pertenezca a la misma cancha indicada en la reserva.

**Verificación.** En la base aislada `reservas_test` se comprobó que una reserva válida se acepta, que una segunda reserva superpuesta es rechazada y que dos reservas consecutivas —por ejemplo, de 18:00 a 19:00 y de 19:00 a 20:00— pueden coexistir.

De esta manera, la decisión de modelado no solo habilitó la restricción: la garantía de no solapamiento ya está implementada y fue verificada directamente en PostgreSQL.

---

## Caso 2 — Claves foráneas implícitas en las asociaciones

### 1. Código analizado

`backend/src/models/index.js`, líneas 14 a 36. Centraliza las relaciones entre los seis modelos del sistema.

La versión anterior declaraba las asociaciones sin especificar la columna:

```js
Complejo.hasMany(Usuario);
Usuario.belongsTo(Complejo);
```

### 2. Diagnóstico

Cuando se omite el parámetro `foreignKey`, Sequelize **infiere** el nombre de la columna aplicando su convención por defecto: el nombre del modelo en PascalCase más `Id`. Para `Complejo.hasMany(Usuario)` genera `ComplejoId`.

Las columnas reales, creadas por las migraciones, se llaman `complejo_id`, `cancha_id`, `usuario_id` y `reserva_id`. No coinciden.

Consecuencias: Sequelize agregaba a cada modelo un atributo sin correlato en la base, y cualquier consulta con `include` —necesaria para listar reservas con los datos de su cancha— habría generado SQL contra una columna inexistente. El defecto no se manifestaba porque todavía no existen endpoints que hagan joins: estaba latente.

**Conceptos aplicados.** **Acoplamiento a una convención implícita del framework.** El código dependía de un comportamiento por defecto que no está escrito en ninguna parte y que contradice la convención que el propio equipo adoptó en las migraciones y en los modelos. Contra el criterio de Clean Code de hacer explícitas las dependencias: nadie podía saber, leyendo el archivo, sobre qué columna se apoyaba cada relación.

Se suma una **inconsistencia de convenciones**: el proyecto usa `snake_case` en base de datos y en los atributos, pero las asociaciones quedaban sujetas al `camelCase` de Sequelize, y el punto de quiebre no era visible.

### 3. Alternativas consideradas

**A. Conservar el código como estaba.** Descartada: no es una cuestión de estilo, el código producía un fallo en ejecución.

**B. Declarar `foreignKey` explícito en cada asociación.** *(elegida)* Cambio acotado a un archivo. Hace explícito el contrato entre el modelo y el esquema.

**C. Activar `underscored: true` en todos los modelos.** Sequelize genera automáticamente los nombres en `snake_case`, resolviendo el problema de raíz y de manera uniforme para cualquier asociación futura. Conceptualmente más limpia: alinea la convención del ORM con la del esquema en lugar de corregir caso por caso. El costo es mayor: hay que modificar seis modelos, verificar que los atributos ya declarados a mano no entren en conflicto con los que el ORM generaría, y el alcance es más difícil de acotar.

**D. Renombrar las columnas a `camelCase`.** Descartada: PostgreSQL pasa a minúsculas todo identificador sin comillas, lo que obligaría a citar nombres en cada consulta SQL manual y en Adminer.

### 4. Decisión

Se adoptó la alternativa B. Las diez declaraciones de `models/index.js` llevan `foreignKey` explícito.

El criterio fue priorizar la corrección con el menor alcance posible, dado que el defecto bloqueaba el trabajo de los tres integrantes. La alternativa C se registra como mejora futura: es preferible conceptualmente, pero conviene aplicarla con el esquema estabilizado, no mientras las migraciones se están escribiendo.

La decisión fija además una regla de trabajo: **no delegar en convenciones implícitas del framework aquello que define el contrato con la base de datos.**

Técnicamente no fue un refactoring. Un refactoring preserva el comportamiento observable, y acá el comportamiento cambia porque antes fallaba. Fue la corrección de un defecto detectado por análisis de diseño.

### 5. Evidencia y trade-offs

**Evidencia**

- `backend/src/models/index.js:14-36` — las diez asociaciones con `foreignKey` explícito
- `backend/src/migrations/20260929220942-add-relaciones.js` — las FK reales en PostgreSQL, en `snake_case`
- `backend/src/models/usuario.js:39` — la columna declarada es `complejo_id`

**Beneficios**

- Elimina un fallo en ejecución antes de que llegara a producirse.
- El archivo se vuelve autoexplicativo: relación y columna se leen juntas.
- Reduce el impacto de una futura actualización de versión del ORM.

**Costos**

- El nombre de la columna queda escrito dos veces por relación, en `hasMany` y en `belongsTo`. Es inherente a la API de Sequelize.
- No resuelve la causa raíz: una entidad nueva cuyo autor olvide el parámetro reintroduce el problema. La alternativa C sí lo resolvería estructuralmente. Se acepta conscientemente.

---

## Caso 3 — Separación de los middlewares de autenticación (decisión de conservar)

### 1. Código analizado

`backend/src/middlewares/autenticar.js` y `backend/src/middlewares/autorizar.js`.

### 2. Diagnóstico

Se evaluó unificarlos en un único middleware que resolviera identidad y permisos en una sola pasada, reduciendo el número de archivos y evitando la dependencia de orden entre ambos.

El análisis concluyó que la unificación empeoraría el diseño. Los dos responden preguntas distintas y **tienen razones de cambio distintas**, que es la formulación precisa del **Principio de Responsabilidad Única**: `autenticar` cambiaría si se migrara de JWT a sesiones o se rotara el esquema de firma; `autorizar` cambiaría si se modificara el modelo de roles. Unificarlos haría que cualquiera de los dos motivos obligara a tocar el mismo código.

La separación habilita además reutilización real: hay endpoints que requieren identificar al usuario sin restringir por rol —consultar las reservas propias, por ejemplo— y con middlewares separados se aplica solo el primero.

**Patrón identificado: Factory.** `autorizar(...rolesPermitidos)` no es un middleware sino una **fábrica** que produce uno. Express exige la firma `(req, res, next)`, pero los roles permitidos varían por ruta; la fábrica se evalúa una vez al registrar la ruta y devuelve un middleware ya parametrizado. Como en el uso canónico del patrón, no elimina la decisión sino que la ubica en un lugar explícito: sin ella habría que escribir un middleware por cada combinación de roles, con la lógica de comparación duplicada en cada uno.

Esto habilita **Open/Closed**: incorporar un rol nuevo no requiere modificar `autorizar.js`, solo pasar otro argumento donde se declara la ruta. El punto de extensión está en el parámetro, no en el cuerpo de la función.

### 3. Alternativas consideradas

**A. Un único middleware que resuelva identidad y permisos.** Menos archivos y sin dependencia de orden, pero concentra dos motivos de cambio e impide aplicar solo la autenticación.

**B. Mantener los dos separados.** *(elegida)*

**C. Un middleware por combinación de roles.** Elimina la fábrica a cambio de duplicar la lógica de comparación tantas veces como combinaciones existan.

### 4. Decisión

Se conserva la estructura actual, con los dos middlewares separados y `autorizar` como fábrica parametrizada.

### 5. Evidencia y trade-offs

**Evidencia:** `backend/src/middlewares/autenticar.js`, `backend/src/middlewares/autorizar.js`.

**Beneficio:** cada archivo tiene un único motivo de cambio y `autenticar` es reutilizable por separado.

**Costo aceptado:** dos middlewares obligan a recordar el orden correcto en cada ruta, porque `autorizar` depende de que `autenticar` haya poblado `req.usuario`. Es una dependencia implícita entre eslabones. Se mitigó con una guarda en `autorizar.js` que verifica la existencia de `req.usuario` y devuelve un error claro en lugar de fallar con una excepción de propiedad indefinida.

**Verificación del comportamiento.** El proyecto declara `jest` y `supertest` como dependencias de desarrollo, pero todavía no hay pruebas escritas. La verificación fue manual y reproducible: se ejecutó un conjunto fijo de peticiones contra los endpoints afectados —token ausente, token mal formado, token válido con rol permitido, token válido con rol no permitido— comparando código de estado y cuerpo de la respuesta.

Se reconoce la limitación: la verificación manual no es repetible sin intervención humana ni protege contra regresiones futuras. Es deuda consciente, registrada y no invisible. Estos dos middlewares son el primer candidato a tener pruebas automatizadas, porque dependen únicamente de `req.headers` y de una variable de entorno, sin requerir base de datos.

---

## Estado de los hallazgos de diseño

Los hallazgos identificados durante el análisis se clasifican según su estado actual. Los puntos corregidos se mantienen documentados como evidencia de las decisiones tomadas; los pendientes conservan su criterio de mejora.

### Restricciones de integridad de horarios y reservas — Corregido

Se incorporaron restricciones a nivel de PostgreSQL para evitar inconsistencias en horarios y reservas.

- `check_horarios_dia_semana`: limita los días de la semana al rango de 0 a 6.
- `check_horarios_rango_horas`: exige que la hora de inicio sea anterior a la hora de fin.
- `check_reservas_rango_horas`: aplica la misma regla a las reservas.
- `unique_horarios_id_cancha` y `fk_reservas_horario_cancha`: garantizan que la cancha asociada a una reserva coincida con la cancha propietaria del horario seleccionado.
- `reservas_no_superpuestas`: impide intervalos superpuestos en una misma cancha, excluyendo las reservas canceladas.

La restricción de exclusión utiliza la extensión PostgreSQL `btree_gist` y un rango temporal semiabierto `[)`. Por ello, dos reservas consecutivas pueden compartir el límite entre el final de una y el comienzo de la siguiente.

**Evidencia:**
- `backend/src/migrations/20261014002336-create-horarios.js`
- `backend/src/migrations/20260929204857-create-reservas.js`
- `backend/src/migrations/202610151214343-prevent-overlapping-reservas.js`

**Verificación:** las migraciones se ejecutaron en la base aislada `reservas_test`. Se comprobó que una reserva válida se acepta, una reserva superpuesta se rechaza y dos turnos consecutivos se aceptan. Los datos auxiliares se revirtieron después de las pruebas.

### Divergencia entre migración y modelo en `complejo_id` — Corregido

La migración `backend/src/migrations/20260929220942-add-relaciones.js` permite que `usuarios.complejo_id` sea nulo. El modelo `backend/src/models/usuario.js` se ajustó para declarar también `allowNull: true`.

Esto permite representar usuarios que no pertenecen a un complejo, como los jugadores registrados en el sistema.

La regla de que ciertos roles, como `ENCARGADO` o `ADMIN_COMPLEJO`, deban tener un complejo asociado requiere una validación adicional de negocio. La nulabilidad de la columna no expresa esa condición por sí sola.

**Criterio pendiente:** incorporar la validación de pertenencia según el rol cuando se implemente o revise el registro de usuarios.

### Reservas sin usuario registrado — Parcialmente corregido

Se modificó el modelo `backend/src/models/reserva.js` y la migración `backend/src/migrations/20260929204857-create-reservas.js` para permitir `usuario_id` nulo.

También se agregaron los campos opcionales `nombre_contacto` y `telefono_contacto`, que permiten guardar información de contacto para reservas tomadas por teléfono, WhatsApp o mostrador.

Esto resuelve la incompatibilidad estructural que impedía registrar reservas sin una cuenta de usuario.

**Criterio pendiente:** incorporar una validación de negocio que exija un usuario registrado o, cuando no exista, los datos de contacto necesarios. La nulabilidad de `usuario_id` y de los campos de contacto no garantiza por sí sola que se informe alguno de ellos.

### Dependencia concreta de la conexión (DIP) — Pendiente

`backend/src/models/index.js` importa directamente la instancia de `backend/src/config/database.js`. Los modelos dependen de una conexión concreta y no de una abstracción inyectada, lo que dificulta probarlos contra otra base o contra un doble de prueba.

El Singleton está justificado porque el pool de conexiones debe compartirse, pero su costo característico es la dependencia global difícil de reemplazar.

**Criterio de mejora:** revisar la inyección de dependencias junto con la incorporación de pruebas automatizadas, para que la abstracción responda a una necesidad real de testing.

### Hasheo de contraseñas — Pendiente

`bcryptjs` figura en las dependencias, pero el hasheo de contraseñas todavía debe implementarse.

**Criterio de mejora:** centralizar el hasheo en un hook `beforeSave` de `backend/src/models/usuario.js`, con la guarda `if (usuario.changed('password'))`. Acompañarlo de un `defaultScope` que excluya `password` de las consultas habituales, de modo que el acceso al hash deba solicitarse explícitamente.

### Reimplementación de timestamps — Pendiente

Los modelos declaran `timestamps: false`, y `backend/src/models/reserva.js` incorpora `fecha_reserva` para registrar manualmente el momento de creación. Esto no registra automáticamente las modificaciones de un registro.

**Criterio de mejora:** evaluar la incorporación de fechas de creación y actualización cuando se implemente el módulo de reportes y se definan los requisitos de auditoría para cancelaciones y reprogramaciones.

### Pruebas automatizadas de los middlewares — Pendiente

El proyecto declara `jest` y `supertest` como dependencias de desarrollo, pero todavía no se dispone de una suite de pruebas automatizadas para los middlewares de autenticación y autorización.

**Criterio de mejora:** automatizar los casos de token ausente, token mal formado, token válido con rol permitido y token válido con rol no permitido. Estos componentes son candidatos adecuados para comenzar porque no necesitan una base de datos para verificar su comportamiento.

### Criterios de diseño aplicados a la integridad de horarios y reservas
Las restricciones incorporadas en horarios y reservas se fundamentan en el principio de mantener los invariantes del sistema en la capa que puede garantizarlos de manera consistente.

La validación en los modelos de Sequelize permite detectar errores y ofrecer respuestas útiles a la aplicación. Las restricciones CHECK, las claves foráneas y la restricción de exclusión de PostgreSQL complementan esa validación al impedir que se persistan datos inconsistentes, incluso cuando la escritura no pasa por los controladores de la aplicación.

La restricción reservas_no_superpuestas resuelve específicamente el problema de concurrencia: la base de datos verifica el solapamiento al insertar o modificar una reserva, evitando que dos operaciones simultáneas registren turnos incompatibles para una misma cancha. El uso de intervalos semiabiertos permite, además, que dos turnos consecutivos coexistan.

Estas decisiones no corresponden a patrones GoF específicos, sino a criterios de diseño, integridad referencial y responsabilidad de la capa de persistencia. Su justificación sigue el enfoque de la materia: identificar una tensión de diseño, evaluar alternativas, tomar una decisión y explicitar sus beneficios y costos.