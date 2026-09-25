# Feature: Módulo Analista de Requerimientos - Mundial de Salsa Cali

## Contexto General del Taller

Este módulo forma parte del taller interactivo "Ruta de Ingeniería de Software", donde los estudiantes asumen distintos roles del ciclo de vida del desarrollo de software a través de escenarios y eventos clave. En este módulo, el estudiante asume el rol de **Analista de Requerimientos / Product Owner**.

## Escenario

- **Evento:** Sistema de Calificación y Votación en Vivo del Mundial de Salsa (Cali, Colombia).
- **Rol:** Requirements Analyst / Business Analyst.
- **Flujo de Pantalla:**
  1. **Pantalla 1 (Explicación Contextual):** Muestra un ejemplo claro y visual de cómo se estructura una historia de usuario usando la sintaxis BDD (Gherkin: Given, When, Then) antes de iniciar la prueba.
  2. **Pantalla 2 (Desafío Drag and Drop):** El estudiante debe seleccionar los 3 bloques correctos entre un banco amplio de opciones (sin pistas de etiqueta en las tarjetas) y soltarlos en sus zonas correspondientes.

---

## Modificaciones de Reglas y Complejidad

1. **Ocultamiento de Etiquetas (Sin Pistas):** Las tarjetas arrastrables NO contienen los prefijos "GIVEN", "WHEN" o "THEN" ni títulos que delaten su posición. Cada tarjeta muestra únicamente el texto descriptivo del comportamiento.
2. **Banco de Opciones Ampliado (7 Tarjetas por Reto):** Para aumentar la dificultad, el estudiante debe elegir entre **7 tarjetas en total**:
   - **1** opción correcta para `GIVEN` (Contexto/Condición inicial).
   - **1** opción correcta para `WHEN` (Acción o evento del usuario).
   - **1** opción correcta para `THEN` (Resultado o reacción esperada del sistema).
   - **4** distractores verosímiles que pertenecen a otros contextos, roles o pasos incorrectos.

---

## Banco de Historias de Usuario

El sistema selecciona **1 de 3 Retos** aleatoriamente al hacer clic en "Comenzar Reto".

### Reto 1: Votación del Público en Vivo para Parejas de Salsa

- **Feature:** Votación del Público
- **Scenario:** Registrar el voto del público durante una presentación
- **Tarjetas Arrastrables (Desordenadas sin etiquetas):**
  1. `El espectador tiene la app oficial abierta y la pareja de baile está ejecutando su rutina en la pista` *(Correcto - GIVEN)*
  2. `El espectador presiona el botón "Votar por esta Pareja" y selecciona un puntaje de 10` *(Correcto - WHEN)*
  3. `El sistema suma el voto al promedio en tiempo real y muestra la confirmación "¡Voto registrado!"` *(Correcto - THEN)*
  4. `El jurado internacional califica el vestuario y la coordinación de la escuela de baile` *(Distractor)*
  5. `El servidor web reinicia la transmisión en vivo por saturación de usuarios` *(Distractor)*
  6. `El bailarín principal se resbala durante la ejecución del paso caleño "El Repique"` *(Distractor)*
  7. `La app envía un correo promocional con descuento para la tienda oficial de salsa` *(Distractor)*

### Reto 2: Compra de Boletas VIP para la Gran Final en el Coliseo El Pueblo

- **Feature:** Boletería Digital
- **Scenario:** Compra exitosa de entradas en categoría Ensambles
- **Tarjetas Arrastrables (Desordenadas sin etiquetas):**
  1. `El usuario está autenticado en la plataforma y existen entradas disponibles en Zona VIP` *(Correcto - GIVEN)*
  2. `Selecciona 2 boletas y completa la transacción ingresando los datos de pago` *(Correcto - WHEN)*
  3. `El sistema reserva los asientos, descuenta las entradas del inventario y genera el código QR` *(Correcto - THEN)*
  4. `La orquesta en vivo comienza a interpretar el tema "Cali Pachanguero"` *(Distractor)*
  5. `El usuario descarga la lista de reproducción oficial del evento en Spotify` *(Distractor)*
  6. `El organizador del evento habilita el ingreso de comida y bebidas al coliseo` *(Distractor)*
  7. `El banco rechaza la tarjeta por saldo insuficiente y bloquea la cuenta del usuario` *(Distractor)*

### Reto 3: Calificación Oficial de los Jurados Internacionales

- **Feature:** Calificación de Jurados
- **Scenario:** Registro del puntaje en el criterio de Ritmo y Cadencia
- **Bloques Arrastrables (Desordenados sin etiquetas):**
  1. `El jurado oficial tiene la sesión activa en la tablet de juzgamiento del evento` *(Correcto - GIVEN)*
  2. `Ingresa una calificación de "9.8" en la casilla de Ritmo y presiona "Guardar Puntaje"` *(Correcto - WHEN)*
  3. `El sistema calcula el promedio de la pareja, bloquea la celda y actualiza la tabla de posiciones` *(Correcto - THEN)*
  4. `El público asistente en el coliseo empieza a ovacionar a la delegación internacional` *(Distractor)*
  5. `La parejarealiza un cambio de vestuario de emergencia antes de salir a la pista` *(Distractor)*
  6. `El presentador del evento anuncia a los patrocinadores oficiales por el micrófono` *(Distractor)*
  7. `El sistema imprime un certificado en papel firmado por el alcalde de Cali` *(Distractor)*

---

## Criterios de Aceptación (Gherkin)

### Scenario: Pantalla de Introducción y Explicación Gherkin

  Given que el estudiante navega a la ruta "http://localhost:3000/retos/analista"
  Then la interfaz debe presentar una tarjeta educativa interactiva explicando la sintaxis BDD:
    | Palabra Clave | Significado | Ejemplo Contextual |
    | GIVEN (Dado que...) | Contexto o condición inicial necesaria | Dado que el usuario está registrado |
    | WHEN (Cuando...) | Acción o evento realizado por el usuario | Cuando presiona el botón de comprar |
    | THEN (Entonces...) | Resultado esperado del sistema | Entonces se genera su comprobante |
  And mostrar un botón destacado con la etiqueta "Comenzar Reto de Análisis".

---

### Scenario: Carga e Interfaz del Desafío Drag and Drop

  Given que el estudiante hace clic en "Comenzar Reto de Análisis"
  Then la interfaz debe cargar el escenario asignado aleatoriamente
  And mostrar tres zonas de soltar vacías etiquetadas como:
    - Zona GIVEN: "1. Condición Inicial (GIVEN)"
    - Zona WHEN: "2. Acción del Usuario (WHEN)"
    - Zona THEN: "3. Resultado del Sistema (THEN)"
  And mostrar un contenedor con 7 tarjetas arrastrables desordenadas sin etiquetas que delaten su posición
  And un botón con la etiqueta "Validar Requerimiento".

---

### Scenario: Validación Exitosa de la Estructura BDD

  Given que el estudiante arrastra la tarjeta correcta a la zona GIVEN, la tarjeta de acción a WHEN y el resultado a THEN
  When hace clic en el botón "Validar Requerimiento"
  Then la interfaz debe mostrar una animación de éxito con confeti y sonido/estilo festivo caleño
  And mostrar el mensaje: "¡Excelente trabajo de Análisis! Has filtrado los distractores y estructurado el requerimiento correctamente."
  And habilitar el botón "Avanzar a la Siguiente Actividad".

---

### Scenario: Validación Errónea o Incompleta

  Given que el estudiante coloca tarjetas en orden incorrecto, ubica un distractor o deja zonas vacías
  When hace clic en el botón "Validar Requerimiento"
  Then el sistema debe resaltar en color rojo las zonas que tienen errores o están vacías
  And mostrar un mensaje de ayuda: "⚠️ Requerimiento no válido. Asegúrate de identificar el contexto inicial, la acción y el resultado del sistema entre las opciones."
  And aplicar una animación de sacudida (shake) a las casillas erróneas.
