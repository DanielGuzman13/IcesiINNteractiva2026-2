# Feature: Módulo Analista de Requerimientos - Historia de Usuario y Criterio de Aceptación del Mundial de Salsa Cali

## Contexto General del Taller

Este módulo forma parte del taller interactivo "Ruta de Ingeniería de Software". En este módulo, el estudiante asume el rol de **Analista de Requerimientos / Product Owner**.

## Estructura de Progresión (2 Pasos por Flujo)

El sistema selecciona aleatoriamente **1 de 3 Flujos Temáticos** al iniciar. Cada flujo se completa en **2 pasos consecutivos sobre la misma historia**: primero la necesidad (Historia de Usuario) y después la verificación (Criterio de Aceptación en formato BDD).

| Paso | Qué construye el estudiante | Formato |
| --- | --- | --- |
| 1 | La necesidad del usuario, con palabras sencillas y sin detalle técnico. | Historia de Usuario: **Como** / **Quiero** / **Para** |
| 2 | El comportamiento verificable que la app debe cumplir para decir que la historia está resuelta. | Criterio de Aceptación BDD: **Dado que** / **Cuando** / **Entonces** |

Flujos temáticos:

- **Flujo 1: Votación del Público en Vivo** (Coliseo El Pueblo)
- **Flujo 2: Boletería Digital - Coliseo El Pueblo**
- **Flujo 3: Calificación Oficial de Jurados Internacionales**

Al validar correctamente el Paso 1, la interfaz habilita el botón **"Escribir el criterio de aceptación"** y carga de inmediato el Paso 2 del mismo flujo.

> Los dos formatos comparten el mismo banco de tarjetas: 3 correctas y 4 distractores que cuentan hechos del evento y **no** son parte del requerimiento, por lo que deben quedarse en el banco.

---

## Formatos Explicados en la Pantalla Inicial

Antes de empezar se presentan las dos tablas de referencia.

**1. Historia de usuario — la necesidad**

| Parte | Pregunta que responde | Ejemplo contextual |
| --- | --- | --- |
| COMO | ¿Quién es la persona que necesita la solución? | Como espectador del Mundial de Salsa |
| QUIERO | ¿Qué quiere hacer? | Quiero emitir mi voto desde la app oficial |
| PARA | ¿Para qué le sirve? | Para apoyar a mis artistas favoritos |

**2. Criterio de aceptación — cómo se comprueba (BDD)**

| Parte | Pregunta que responde | Ejemplo contextual |
| --- | --- | --- |
| DADO QUE | ¿En qué situación está el mundo? | Dado que el espectador tiene la app abierta |
| CUANDO | ¿Qué hace la persona? | Cuando presiona "Votar por esta Pareja" |
| ENTONCES | ¿Qué debe responder el sistema? | Entonces el sistema suma el voto y confirma |

---

## Banco de Requerimientos (6 Pasos en Total)

### FLUJO 1: VOTACIÓN DEL PÚBLICO

#### Historia de usuario 1.1 — Votación del público

- **Tarjetas Arrastrables (7 Opciones):**
  1. `Como espectador del Mundial de Salsa en el Coliseo El Pueblo` *(Correcto — COMO)*
  2. `Quiero emitir mi voto desde la app oficial por la pareja que está en la pista` *(Correcto — QUIERO)*
  3. `Para apoyar a mis artistas favoritos y reflejar el favoritismo del público` *(Correcto — PARA)*
  4. `La orquesta en vivo empieza a interpretar "Cali Pachanguero" frente al Coliseo` *(Distractor)*
  5. `El bailarín principal se resbala durante la ejecución del paso caleño "El Repique"` *(Distractor)*
  6. `El presentador del evento anuncia a los patrocinadores oficiales por el micrófono` *(Distractor)*
  7. `El servidor web reinicia la transmisión en vivo por saturación de usuarios` *(Distractor)*

#### Criterio de aceptación 1.1 — Votación del público (BDD)

- **Tarjetas Arrastrables (7 Opciones):**
  1. `El espectador tiene la app oficial abierta y la pareja de baile está ejecutando su rutina en la pista` *(Correcto — DADO QUE)*
  2. `El espectador presiona el botón "Votar por esta Pareja" y selecciona un puntaje de 10` *(Correcto — CUANDO)*
  3. `El sistema suma el voto al promedio en tiempo real y muestra la confirmación "¡Voto registrado!"` *(Correcto — ENTONCES)*
  4. `El jurado internacional califica el vestuario y la coordinación de la escuela de baile` *(Distractor)*
  5. `El servidor web reinicia la transmisión en vivo por saturación de usuarios` *(Distractor)*
  6. `El bailarín principal se resbala durante la ejecución del paso caleño "El Repique"` *(Distractor)*
  7. `La app envía un correo promocional con descuento para la tienda oficial de salsa` *(Distractor)*

---

### FLUJO 2: BOLETERÍA DIGITAL

#### Historia de usuario 2.1 — Compra de entradas VIP

- **Tarjetas Arrastrables (7 Opciones):**
  1. `Como aficionado a la salsa que quiere ver el Mundial desde el Coliseo El Pueblo` *(Correcto — COMO)*
  2. `Quiero comprar entradas VIP de la categoría Ensambles sin hacer fila en la boletería` *(Correcto — QUIERO)*
  3. `Para asegurar mi lugar en primera fila y apoyar a las parejas del Mundial` *(Correcto — PARA)*
  4. `Las boleterías físicas del Coliseo El Pueblo abren a las 8 de la mañana y forman una fila larga` *(Distractor)*
  5. `La orquesta de salsa ensaya en el camerino del Coliseo antes de la apertura` *(Distractor)*
  6. `Cambian la señalización del Coliseo para indicar dónde está cada zona de boletería` *(Distractor)*
  7. `El proveedor de la pasarela de pagos actualiza sus tarifas antes del Mundial` *(Distractor)*

#### Criterio de aceptación 2.1 — Compra de entradas VIP (BDD)

- **Tarjetas Arrastrables (7 Opciones):**
  1. `El usuario está autenticado en la plataforma y existen entradas disponibles en Zona VIP` *(Correcto — DADO QUE)*
  2. `Selecciona 2 boletas y completa la transacción ingresando los datos de pago` *(Correcto — CUANDO)*
  3. `El sistema reserva los asientos, descuenta las entradas del inventario y genera el código QR` *(Correcto — ENTONCES)*
  4. `La orquesta en vivo comienza a interpretar el tema "Cali Pachanguero"` *(Distractor)*
  5. `El usuario descarga la lista de reproducción oficial del evento en Spotify` *(Distractor)*
  6. `El organizador del evento habilita el ingreso de comida y bebidas al coliseo` *(Distractor)*
  7. `El banco rechaza la tarjeta por saldo insuficiente y bloquea la cuenta del usuario` *(Distractor)*

---

### FLUJO 3: CALIFICACIÓN DE JURADOS

#### Historia de usuario 3.1 — Registro de calificaciones

- **Tarjetas Arrastrables (7 Opciones):**
  1. `Como jurado internacional del Mundial de Salsa` *(Correcto — COMO)*
  2. `Quiero registrar el puntaje de cada pareja en la tablet de juzgamiento` *(Correcto — QUIERO)*
  3. `Para que la competencia se evalúe con el mismo criterio y la decisión sea transparente` *(Correcto — PARA)*
  4. `Las parejas hacen su entrada a la pista saludando al público del Coliseo` *(Distractor)*
  5. `El público en las gradas canta la salsa de la delegación invitada` *(Distractor)*
  6. `La transmisión de televisión interrumpe la señal para emitir comerciales` *(Distractor)*
  7. `La organización reparte refrigerios y credenciales en la zona de jurados` *(Distractor)*

#### Criterio de aceptación 3.1 — Registro de calificaciones (BDD)

- **Tarjetas Arrastrables (7 Opciones):**
  1. `El jurado oficial tiene la sesión activa en la tablet de juzgamiento del evento` *(Correcto — DADO QUE)*
  2. `Ingresa una calificación de "9.8" en la casilla de Ritmo y presiona "Guardar Puntaje"` *(Correcto — CUANDO)*
  3. `El sistema calcula el promedio de la pareja, bloquea la celda y actualiza la tabla de posiciones` *(Correcto — ENTONCES)*
  4. `El público asistente en el coliseo empieza a ovacionar a la delegación internacional` *(Distractor)*
  5. `La pareja realiza un cambio de vestuario de emergencia antes de salir a la pista` *(Distractor)*
  6. `El presentador del evento anuncia a los patrocinadores oficiales por el micrófono` *(Distractor)*
  7. `El sistema imprime un certificado en papel firmado por el alcalde de Cali` *(Distractor)*

---

## Criterios de Aceptación (Gherkin)

### Scenario: Pantalla inicial con los dos formatos

  Given que el estudiante abre el módulo del Analista de Requerimientos
  Then la interfaz debe mostrar el título "De la idea al requerimiento: Historia de Usuario y Criterio de Aceptación"
  And mostrar la tabla "1. Historia de usuario — la necesidad" con las partes COMO, QUIERO y PARA
  And mostrar la tabla "2. Criterio de aceptación — cómo se comprueba" con las partes DADO QUE, CUANDO y ENTONCES
  And un botón con la etiqueta "Comenzar Reto de Análisis".

---

### Scenario: Flujo de 2 Pasos y transición entre formatos

  Given que el sistema asignó aleatoriamente un flujo temático
  Then el Paso 1 debe mostrar el rótulo "Historia de usuario X.1" con las 3 zonas COMO, QUIERO y PARA
  When el estudiante completa correctamente el Paso 1
  Then la interfaz muestra la frase completa de la historia de usuario en el formato "Como…, Quiero…, Para…."
  And habilita el botón "Escribir el criterio de aceptación"
  When el estudiante hace clic en ese botón
  Then la interfaz carga el Paso 2 con el rótulo "Criterio de aceptación X.1" y las 3 zonas DADO QUE, CUANDO y ENTONCES, manteniendo el mismo flujo temático
  And al completar el Paso 2 habilita el botón "Completar Módulo de Análisis".

---

### Scenario: Retroalimentación por zona en ambos formatos

  Given que el estudiante coloca tarjetas en las 3 zonas del paso activo
  When hace clic en el botón "Validar Historia de Usuario" (Paso 1) o "Validar Criterio de Aceptación" (Paso 2)
  Then cada zona muestra una explicación: correcta (en verde, queda fija), vacía, con un distractor o con una tarjeta que va en otra zona (indicando a cuál)
  And el mensaje de acierto nombra la función de la parte esperada (ej. "¡Bien! Esta tarjeta dice quién es la persona que usa la app.")
  And un aviso resume cuántas zonas de 3 están correctas
  And al mover una tarjeta solo se borra la revisión de las zonas que cambiaron.

---

### Scenario: Pista y confirmación

  Given que el estudiante está resolviendo un paso
  When toca "Pedir pista"
  Then aparece una pista sin costo y acorde al formato del paso: en el Paso 1 pregunta quién es la persona, qué quiere hacer y para qué le sirve; en el Paso 2 pregunta por la situación inicial, la acción y la respuesta del sistema. En ambos casos aclara que las tarjetas que solo cuentan hechos del evento son distractores.
  When valida el requerimiento correcto
  Then se muestra el requerimiento completo como frase ("Como…, Quiero…, Para…" en el Paso 1; "Dado que…, cuando…, entonces…" en el Paso 2) y para qué le sirve al equipo.