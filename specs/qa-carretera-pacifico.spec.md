# Feature: Módulo QA / Testeo de Software - Trazabilidad de Reglas - Carrera del Pacífico

## Contexto General del Taller

Este módulo forma parte del taller interactivo "Ruta de Ingeniería de Software", donde los estudiantes asumen distintos roles del ciclo de vida del desarrollo de software a través de escenarios y eventos clave. En este módulo, el estudiante asume el rol de **Ingeniero de QA (Quality Assurance)**.

## Escenario

- **Evento:** Registro e inscripción de la Carrera del Pacífico (Cali, Colombia).
- **Rol:** QA Engineer.
- **Situación:** El formulario de inscripción salió a producción con sus reglas de negocio escritas en un documento aparte. Ningún campo dice cuál es su nombre, y todos se ven iguales en pantalla.
- **Objetivo del Estudiante:** Realizar la **trazabilidad** entre las reglas de negocio y los campos del formulario: descubrir qué campo implementa cada regla y colocar su tarjeta en el cuadro correcto. Saber qué restricts cada campo es el primer paso de un caso de prueba, y es lo que permite distinguir un dato válido de una falla.

---

## Estructura de la Pantalla

La actividad se reparte en tres zonas:

1. **Arriba, a todo el ancho:** las 5 reglas de juego del formulario.
2. **Abajo a la izquierda, en una columna de 5 filas apiladas:** los 5 campos reales del formulario, **sin etiqueta y del mismo tamaño**, que aplican su restricción mientras el estudiante escribe.
3. **Abajo a la derecha, en una columna de 5 filas apiladas:** 5 cuadros vacíos, **sin nombre ni número**, cada uno a la misma altura que el campo de su misma fila. Abajo de ellos está el banco con las 5 tarjetas arrastrables, que son **lo único en toda la pantalla que lleva el nombre de un campo**.

Como los cuadros vacíos no llevan nombre, **no se puede resolver leyendo nombres**: la única forma de saber qué tarjeta va en cada cuadro es probar el campo de esa fila y deducir qué regla está implementando. Los cuadros se emparejan **por fila (misma altura)**, nunca por texto.

### Alineación vertical de las filas

Cada panel apila sus 5 elementos **verticalmente**, y la fila *i* del panel izquierdo queda a la misma altura que la fila *i* del panel derecho. Esto es un requisito verificable del diseño:

- Ambas pilas usan el mismo número de filas (5), el mismo alto por fila (`h-14`), el mismo relleno de fila (`py-2`) y el mismo separador (`gap-3`).
- Ambos paneles comparten el mismo relleno de sección, la misma altura mínima de cabecera (`min-h-[104px]`) y la misma separación respecto a la cabecera, de modo que las dos pilas arrancan en la misma coordenada vertical.
- Para reforzar la correspondencia **sin introducir información semántica**, las filas 1, 3 y 5 de **ambos paneles** comparten un mismo sombreado alterno muy tenue. El sombreado es puramente decorativo y no nombra ni numera ningún campo.

---

## Reglas de Juego (mostradas arriba, ancho completo)

Cada regla corresponde a **exactamente un** campo del formulario.

| # | Regla |
| --- | --- |
| 1 | El número de documento no puede tener más de 10 dígitos. |
| 2 | El nombre completo solo usa letras y espacios: no admite números ni caracteres especiales. |
| 3 | La edad solo admite números mayores a 18 y hasta 120 años. |
| 4 | El número de celular no puede tener más de 13 caracteres. |
| 5 | La fecha de nacimiento no puede ser una fecha futura. |

---

## Controles de Prueba (fila de la izquierda)

Los 5 controles se barajan al cargar la página. **Todos se renderizan con idéntico tamaño (`h-14`, ancho completo de su columna) y ninguno muestra su nombre**, para que el estudiante no pueda deducir el campo de un vistazo. Cada uno tiene un `aria-label` neutro ("Campo de prueba N") que tampoco revela la respuesta.

| Control | Restricción aplicada en vivo | Cómo se delata al probarlo |
| --- | --- | --- |
| Texto | Filtra a letras y espacios: borra dígitos y símbolos. | Si tecleas `Jhon3`, en la casilla queda `Jhon`. |
| Texto | Filtra a dígitos y corta en 10 caracteres. | La cifra número 11 nunca llega a entrar. |
| Texto | Solo dígitos, y acepta únicamente lo que puede acabar en un rango de 18 a 120. | Acepta `25` y `120`, rechaza `200`, y ante un `-5` solo queda el `5`. |
| Texto | Filtra a dígitos y corta en 13 caracteres. | Es el único campo que aguanta 13: los demás se cortan en el décimo o antes. |
| Fecha | Despliega un calendario y no permite elegir un día futuro. | Hoy es el último día seleccionable. |

Cuando una pulsación viola la restricción, el control **se sacude brevemente** y el valor no cambia, para que el estudiante perciba el rechazo.

---

## Tarjetas y Cuadros (fila de la derecha)

### Tarjetas arrastrables (lo único con nombre)

| Tarjeta | Campo que representa | Regla que implementa |
| --- | --- | --- |
| Nombre Completo | Campo de texto que filtra a letras y espacios | #2 |
| Documento | Campo de texto que filtra a dígitos y corta en 10 | #1 |
| Edad | Campo numérico con rango de 18 a 120 | #3 |
| Teléfono | Campo de texto que solo admite dígitos y corta en 13 caracteres | #4 |
| Fecha de Nacimiento | Campo de fecha sin días futuros | #5 |

El orden del banco se baraja en cada carga de la página. Las respuestas correctas se mantienen iguales para todos los estudiantes.

### Cuadros vacíos

- Cinco cuadros **sin etiqueta**, en el mismo orden de filas que los controles de la izquierda.
- El cuadro de la fila *i* corresponde al control de la fila *i*.
- Se aceptan dos formas de interacción, para no depender del arrastre: soltar la tarjeta sobre el cuadro, o seleccionarla con un clic y luego hacer clic en el cuadro (también funciona con Enter y Espacio).
- Una tarjeta ya colocada desaparece del banco y puede arrastrarse a otro cuadro. El botón ✕ la devuelve al banco.

---

## Criterios de Aceptación (Gherkin)

### Scenario: Presentación de las reglas de juego

  Given que el estudiante abre el módulo QA
  Then la interfaz debe mostrar en la parte superior, a todo el ancho, el título "Reglas de juego del formulario"
  And listar 5 reglas numeradas del #1 al #5
  And aclarar que "Cada regla corresponde a un único campo: tu trabajo es descubrir cuál es cuál y colocarlo en su sitio."
  And en la parte inferior, dos paneles lado a lado.

---

### Scenario: Los campos de prueba no delatan su nombre

  Given que el estudiante está en el panel izquierdo "Eres el ingeniero de QA"
  Then debe ver 5 campos de formulario apilados verticalmente, uno por fila
  And los 5 campos deben tener exactamente el mismo tamaño y la misma forma de casilla
  And ningún campo puede mostrar su nombre, ni como texto, ni como placeholder, ni como título emergente
  And los cuatro campos de texto deben verse y comportarse igual en el navegador, sin diferencias de teclado ni de tipo de control; el único que se distingue por su naturaleza es el calendario
  And el orden de los 5 campos debe estar barajado en cada carga de la página
  And cada campo debe aplicar su restricción mientras el estudiante escribe, sin un botón de enviar.

---

### Scenario: Los cuadros vacíos no se pueden resolver leyendo

  Given que el estudiante está en el panel derecho "Coloca cada tarjeta"
  Then debe ver 5 cuadros vacíos, ninguno con nombre ni con número
  And los cuadros deben estar a la misma altura que el campo de su misma fila, no en la misma columna
  And las filas 1, 3 y 5 de los dos paneles deben compartir el mismo sombreado alterno
  And debe ver debajo un banco con 5 tarjetas, que son lo único en la pantalla que nombra a un campo
  And el orden de las tarjetas en el banco debe estar barajado en cada carga de la página.

---

### Scenario: Descubrimiento de un campo probándolo

  Given que el estudiante escribe en uno de los campos de prueba
  When escribe caracteres que violan la restricción del campo
  Then el valor no debe cambiar y el campo debe sacudirse brevemente
  When escribe un valor que sí cumple la restricción
  Then el campo debe aceptar el valor
  And en ningún momento el sistema debe revelar el nombre del campo.

---

### Scenario: Colocación de una tarjeta en el cuadro equivocado

  Given que el estudiante coloca una tarjeta en un cuadro y presiona "Validar Trazabilidad"
  Then ese cuadro debe quedar marcado en ámbar
  And el sistema debe mostrar una retroalimentación que describa el comportamiento del control de esa fila, sin decir el nombre del campo. Por ejemplo, para un campo de edad: "la tarjeta que pusiste ahí no corresponde: acepta el 25 y también el 120, pero se niega a tomar el 200, y ante un -5 solo queda el 5: aquí los negativos no existen."
  And un cuadro que quedó vacío debe reportarse como "ese cuadro quedó vacío y el campo no puede estarlo: …" seguido del comportamiento del control
  And el sistema NO debe habilitar el avance ni mostrar confeti mientras alguna colocación sea incorrecta
  And el estudiante debe poder mover la tarjeta a otro cuadro, quitarla con ✕ y volver a validar.

---

### Scenario: Trazabilidad completa

  Given que el estudiante descubrió los 5 campos y colocó la tarjeta correcta en cada cuadro
  When presiona "Validar Trazabilidad"
  Then los 5 cuadros deben quedar marcados en verde con un visto bueno
  And el sistema debe mostrar una animación de éxito con confeti
  And mostrar el mensaje: "¡Excelente trabajo de QA! Identificaste los 5 campos de la Carrera del Pacífico y cada uno responde a su regla."
  And listar las 5 correspondencias campo↔regla resueltas
  And habilitar el botón para continuar al siguiente rol del taller.

---

### Scenario: Anti-trampa por barajado

  Given que dos estudiantes de la misma sala abren el módulo
  When cada uno carga la página
  Then el orden de los campos de prueba puede ser distinto en cada pantalla
  And el orden de las tarjetas del banco puede ser distinto en cada pantalla
  And las respuestas correctas se mantienen iguales para todos.
