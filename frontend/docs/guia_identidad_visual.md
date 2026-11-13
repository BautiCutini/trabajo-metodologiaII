**Versión:** 1.0  
**Estado:** Definición visual aprobada; pendiente de implementación en el frontend.

Este documento reúne los criterios visuales acordados para la aplicación Picado. Su objetivo es que todas las pantallas y todos los integrantes del equipo mantengan una identidad coherente, tanto en móvil como en escritorio.

---

## 1. Identidad visual

Picado tendrá una identidad **futurista deportiva**: fondos oscuros, verde lima protagonista, iluminación tecnológica y componentes con profundidad. La interfaz debe transmitir deporte, modernidad y tecnología sin quedar recargada.

Principios generales:

- Mantener una identidad consistente en todas las secciones y roles de la aplicación.
- Utilizar el verde lima para acciones principales y elementos que deban destacar.
- Combinar fondos oscuros con transparencias, bordes iluminados y sombras verdes controladas.
- Priorizar la legibilidad y la facilidad de uso por encima de los efectos decorativos.
- Utilizar fotografías reales de canchas y complejos cuando el contenido lo requiera.
- Evitar incorporar colores, tipografías o estilos nuevos sin actualizar este documento y acordarlo con el equipo.

## 2. Paleta de colores

| Token conceptual | Valor | Uso previsto |
|---|---|---|
| Verde oscuro | `#142D25` | Fondo principal oscuro, paneles y texto sobre lima |
| Verde lima | `#B9E769` | Acciones principales, acentos, iconos y elementos destacados |
| Verde deportivo | `#26734D` | Bordes, detalles secundarios y superficies verdes |
| Blanco | `#FFFFFF` | Texto sobre fondos oscuros |
| Superficie clara | `#F5F7F3` | Superficies claras |
| Superficie clara alternativa | `#EDF1EA` | Fondos secundarios claros |
| Texto oscuro | `#26332B` | Texto sobre superficies claras |
| Texto secundario | `#68736B` | Información secundaria sobre superficies claras |
| Texto deshabilitado | `#A0A9A1` | Contenido deshabilitado |
| Borde neutro | `#DCE3DB` | Separadores y bordes sobre superficies claras |
| Hover claro | `#E8F0E2` | Estado hover sobre superficies claras |

Los colores de estado se definen por separado en la sección 6. No deben confundirse con los colores principales de marca.

## 3. Tipografía

La tipografía oficial es **Inter**.

| Uso | Familia | Peso |
|---|---|---:|
| Títulos principales | Inter | 700 (Bold) |
| Subtítulos | Inter | 600 (Semibold) |
| Textos generales y descripciones | Inter | 400 (Regular) |
| Botones y acciones | Inter | 700 (Bold) |

La carga de la fuente y sus pesos deberá centralizarse para evitar definiciones distintas entre pantallas.

## 4. Botones

Se adopta el estilo **futurista**.

### Botón primario

- Fondo: verde lima `#B9E769`.
- Texto: verde oscuro `#142D25`.
- Tipografía: Inter Bold 700.
- Bordes redondeados: `12px`.
- Puede incluir icono o flecha cuando ayude a comunicar la acción.
- Debe tener una microinteracción breve al pulsar y un brillo sutil al interactuar.

### Botón secundario

- Fondo transparente.
- Borde verde.
- Texto e iconos con contraste suficiente sobre el fondo.
- Mantener el mismo radio y lenguaje visual que el botón primario.

Los botones de peligro deben utilizar el color de estado correspondiente y no el verde lima como si fueran acciones principales.

## 5. Inputs y selectores

Se adopta el estilo **glassmorphism futurista**.

- Fondo semitransparente.
- Borde de `1px`, utilizando verde deportivo `#26734D` en el tema oscuro.
- Radio de input: `10px`.
- Etiquetas en verde lima.
- Texto de entrada blanco sobre fondos oscuros.
- Iconos en verde lima.
- Al enfocar o seleccionar, aplicar una iluminación sutil y visible.
- Los estados de error, deshabilitado y ayuda deben ser distinguibles y accesibles.

Los selectores de fecha y horario deben conservar el mismo lenguaje visual que los demás campos.

## 6. Estados visuales

Los estados utilizan color e iconografía; la información nunca debe comunicarse únicamente mediante el color.

| Estado | Color | Código | Ejemplos |
|---|---|---|---|
| Éxito | Verde | `#26734D` | Operación completada, reserva confirmada |
| Error | Rojo | `#DC4545` | Pago rechazado, error al reservar |
| Advertencia | Amarillo | `#E9B949` | Reserva pendiente, información importante |
| Disponible | Verde | `#26734D` | Existe al menos una cancha disponible para la fecha y hora consultadas |
| Sin disponibilidad | Rojo | `#DC4545` | No hay canchas disponibles para la fecha y hora consultadas |

En el mapa de complejos:

- Marcador verde: el complejo tiene al menos una cancha disponible para la fecha y hora seleccionadas.
- Marcador rojo: el complejo no tiene canchas disponibles para esa fecha y hora.

Acompañar los estados con iconos y textos claros. No depender exclusivamente de los marcadores de color.

## 7. Tarjetas

Se adopta el estilo **glassmorphism futurista**.

- Fondo translúcido verde oscuro.
- Bordes verdes con iluminación sutil.
- Radio de tarjeta: `18px`.
- Sombras verdes difuminadas para aportar profundidad.
- Fotografías destacadas cuando correspondan, especialmente en tarjetas de complejos y canchas.
- Acentos lima para datos relevantes, iconos y acciones.

Las tarjetas deben mantener buena legibilidad y contraste. El brillo no debe competir con el contenido.

## 8. Bordes, sombras y efectos

Se adopta un estilo de **brillo futurista controlado**.

- Bordes de inputs: `1px`.
- Botones: radio `12px`.
- Inputs: radio `10px`.
- Tarjetas: radio `18px`.
- Paneles grandes: radio `24px`.
- Utilizar sombras verdes difuminadas y transparencias para crear profundidad.
- Intensificar ligeramente la iluminación durante hover, foco o selección.
- Evitar brillos permanentes excesivos o efectos que dificulten la lectura.

## 9. Espaciado

Utilizar una escala consistente basada en múltiplos de 8:

| Token conceptual | Medida | Uso orientativo |
|---|---:|---|
| Pequeño | `8px` | Separación entre elementos relacionados |
| Medio | `16px` | Padding interno y separación habitual |
| Grande | `24px` | Separación entre grupos de contenido |
| Sección | `32px` | Separación entre secciones principales |

No introducir valores arbitrarios si uno de estos valores cubre la necesidad. Si aparece una necesidad recurrente, ampliar la escala de forma acordada.

## 10. Iconografía

Se adopta iconografía **sólida/rellena**.

- Priorizar iconos sólidos, claros y reconocibles.
- Utilizar verde lima sobre fondos oscuros cuando el icono sea un acento.
- Mantener el mismo estilo de iconos en toda la aplicación.
- Evitar mezclar iconos lineales y sólidos sin una razón funcional clara.
- Acompañar los iconos importantes con texto cuando su significado no sea evidente.

## 11. Diseño responsive

La estrategia será **Mobile First**: diseñar primero para móviles y adaptar después a escritorio.

### Móvil

- Distribución principal en una columna.
- Navegación inferior.
- Botones y controles táctiles cómodos.
- Tarjetas adaptadas al ancho disponible.
- Priorizar rendimiento y lectura en pantallas pequeñas.

### Escritorio

- Posibilidad de navegación lateral.
- Distribuciones de varias columnas cuando mejoren la experiencia.
- Aprovechar el espacio adicional sin cambiar la identidad visual.

La paleta, tipografía, componentes y lenguaje visual deben ser los mismos en ambos formatos. Cambia la distribución, no la identidad.

## 12. Animaciones, transiciones y sonido

Se adopta un estilo de animaciones **futuristas y dinámicas**, con moderación.

- Aparición progresiva de paneles y tarjetas.
- Iluminación del logotipo.
- Transiciones suaves entre pantallas.
- Microanimaciones en botones y controles.
- Parallax moderado cuando aporte valor.
- Evitar animaciones que perjudiquen el rendimiento, especialmente en móviles.
- Respetar la preferencia del sistema para reducir movimiento (`prefers-reduced-motion`).

### Sonido de entrada

Se desea incorporar un silbatazo corto al entrar por primera vez, no en cada cambio de pantalla, con una opción para silenciarlo. La reproducción deberá activarse respetando las restricciones de autoplay del navegador y, si es necesario, después de una interacción del usuario.

## 13. Componentes reutilizables de React

Los componentes visuales comunes se organizarán en `frontend/src/components/ui/`.

| Componente | Responsabilidad |
|---|---|
| `Button` | Botones primarios, secundarios y de peligro |
| `Input` | Campos de texto |
| `Select` | Listas desplegables |
| `DatePicker` | Selección de fechas |
| `TimePicker` | Selección de horarios |
| `Card` | Tarjetas glassmorphism |
| `StatusBadge` | Estados de reservas y disponibilidad |
| `Modal` | Ventanas emergentes |
| `Toast` | Mensajes de éxito, error y advertencia |
| `Loader` | Indicadores de carga |
| `IconButton` | Botones compuestos por iconos |

Componentes de navegación previstos:

- `BottomNavigation`: navegación inferior para móviles.
- `Sidebar`: navegación lateral para escritorio.
- `Header`: encabezado de las pantallas.

**Regla de reutilización:** si un componente común ya existe, las pantallas deben utilizarlo en lugar de crear una variante independiente con estilos duplicados. Las variantes deben resolverse mediante props y estilos compartidos.

La estructura propuesta es una guía; antes de crear componentes se debe comprobar qué existe ya en el proyecto para evitar duplicaciones.

## 14. Organización técnica y reglas del equipo

- Centralizar colores, tipografía, radios, espaciados y otros valores compartidos en variables/tokens globales.
- Centralizar estilos generales y carga tipográfica en los archivos globales correspondientes.
- No definir colores o medidas de marca directamente en cada pantalla si existe un token compartido.
- Reutilizar los componentes de `components/ui/`.
- Mantener consistencia entre las pantallas de jugador, encargado y administradores.
- Antes de incorporar una nueva variante visual, comprobar si puede resolverse con los componentes y tokens existentes.
- Actualizar este documento cuando el equipo acuerde un cambio en el sistema visual.
- Comprobar el diseño en móvil y escritorio y verificar que los estados sean legibles y accesibles.

## 15. Orden de implementación

La implementación se realizará después de aprobar este documento, siguiendo este orden:

1. Crear y revisar este documento en `frontend/docs/DESIGN_SYSTEM.md`.
2. Incorporar los tokens necesarios en `frontend/src/styles/variables.css`.
3. Actualizar `frontend/src/styles/global.css` para cargar Inter y aplicar las reglas globales.
4. Crear o adaptar los componentes reutilizables de `frontend/src/components/ui/`.
5. Aplicar los componentes y tokens a las pantallas existentes.
6. Verificar el build y probar la interfaz en móvil y escritorio.

---

**Nota:** este archivo documenta las decisiones visuales acordadas. No implica que los estilos o componentes ya estén implementados en el código.
