
# Feature: Módulo Analista de Requerimientos - Flujos Multi-Nivel del Mundial de Salsa Cali

## Contexto General del Taller

Este módulo forma parte del taller interactivo "Ruta de Ingeniería de Software". En este módulo, el estudiante asume el rol de **Analista de Requerimientos / Product Owner**.

## Estructura de Progresión (2 Ejercicios por Flujo)

El sistema selecciona aleatoriamente **1 de 3 Flujos Temáticos** al iniciar. Cada flujo consta de **2 ejercicios consecutivos** del mismo contexto pero con mayor profundidad en el Nivel 2:

- **Flujo 1: Votación del Público en Vivo**
  - Ejercicio 1.1: Registrar el voto del público durante una presentación.
  - Ejercicio 1.2: Validación de límite de votos y prevención de duplicados por IP/Usuario.
- **Flujo 2: Boletería Digital - Coliseo El Pueblo**
  - Ejercicio 2.1: Compra exitosa de entradas VIP categoría Ensambles.
  - Ejercicio 2.2: Aplicación de código de descuento promocional en el checkout.
- **Flujo 3: Calificación Oficial de Jurados Internacionales**
  - Ejercicio 3.1: Registro de puntaje en el criterio de Ritmo y Cadencia.
  - Ejercicio 3.2: Impugnación y recalificación reglamentaria de una rutina por parte del jurado principal.

Al validar correctamente el Ejercicio 1 de cualquier flujo, la interfaz habilita el botón **"Siguiente Ejercicio del Flujo"**, cargando inmediatamente la segunda actividad del mismo tema antes de finalizar el módulo.

---

## Banco de Historias de Usuario (6 Ejercicios en Total)

### FLUJO 1: VOTACIÓN DEL PÚBLICO

#### Ejercicio 1.1: Votación Básica

- **Feature:** Votación del Público
- **Scenario:** Registrar el voto del público durante una presentación
- **Tarjetas Arrastrables (7 Opciones):**
  1. `El espectador tiene la app oficial abierta y la pareja de baile está ejecutando su rutina en la pista` *(Correcto - GIVEN)*
  2. `El espectador presiona el botón "Votar por esta Pareja" y selecciona un puntaje de 10` *(Correcto - WHEN)*
  3. `El sistema suma el voto al promedio en tiempo real y muestra la confirmación "¡Voto registrado!"` *(Correcto - THEN)*
  4. `El jurado internacional califica el vestuario y la coordinación de la escuela de baile` *(Distractor)*
  5. `El servidor web reinicia la transmisión en vivo por saturación de usuarios` *(Distractor)*
  6. `El bailarín principal se resbala durante la ejecución del paso caleño "El Repique"` *(Distractor)*
  7. `La app envía un correo promocional con descuento para la tienda oficial de salsa` *(Distractor)*

#### Ejercicio 1.2: Control de Voto Duplicado (Nivel Avanzado)

- **Feature:** Votación del Público
- **Scenario:** Control de votación duplicada en un mismo dispositivo
- **Tarjetas Arrastrables (7 Opciones):**
  1. `El usuario ya emitió su voto para la pareja en competencia desde su cuenta verificada` *(Correcto - GIVEN)*
  2. `Intenta presionar nuevamente el botón de votación para la misma presentación` *(Correcto - WHEN)*
  3. `El sistema deshabilita la acción, mantiene el voto previo y despliega el aviso "Ya has votado por este participante"` *(Correcto - THEN)*
  4. `El administrador del evento elimina la cuenta del usuario por intento de fraude` *(Distractor)*
  5. `La app cierra la sesión automáticamente y reinicia los valores del servidor` *(Distractor)*
  6. `El conteo total de votos retrocede a cero para todas las parejas de la categoría` *(Distractor)*
  7. `El dispositivo del usuario recibe una notificación push con la programación del día siguiente` *(Distractor)*

---

### FLUJO 2: BOLETERÍA DIGITAL

#### Ejercicio 2.1: Compra VIP

- **Feature:** Boletería Digital
- **Scenario:** Compra exitosa de entradas en categoría Ensambles
- **Tarjetas Arrastrables (7 Opciones):**
  1. `El usuario está autenticado en la plataforma y existen entradas disponibles en Zona VIP` *(Correcto - GIVEN)*
  2. `Selecciona 2 boletas y completa la transacción ingresando los datos de pago` *(Correcto - WHEN)*
  3. `El sistema reserva los asientos, descuenta las entradas del inventario y genera el código QR` *(Correcto - THEN)*
  4. `La orquesta en vivo comienza a interpretar el tema "Cali Pachanguero"` *(Distractor)*
  5. `El usuario descarga la lista de reproducción oficial del evento en Spotify` *(Distractor)*
  6. `El organizador del evento habilita el ingreso de comida y bebidas al coliseo` *(Distractor)*
  7. `El banco rechaza la tarjeta por saldo insuficiente y bloquea la cuenta del usuario` *(Distractor)*

#### Ejercicio 2.2: Redención de Cupón Promocional

- **Feature:** Boletería Digital
- **Scenario:** Aplicación de código de descuento instituido por la Alcaldía
- **Tarjetas Arrastrables (7 Opciones):**
  1. `El comprador se encuentra en la pantalla de resumen de pago con 2 boletas en su carrito` *(Correcto - GIVEN)*
  2. `Ingresa el código promocional "FERIADECALI" y presiona el botón "Aplicar"` *(Correcto - WHEN)*
  3. `El sistema descuenta el 20% del total a pagar, actualiza el monto y muestra el desglose del ahorro` *(Correcto - THEN)*
  4. `La pasarela de pago duplica el valor del pedido por cobro de comisiones bancarias` *(Distractor)*
  5. `El usuario se registra como participante en la maratón de salsa de la ciudad` *(Distractor)*
  6. `El sistema envía una alerta SMS al organizador notificando la compra` *(Distractor)*
  7. `El cupón expira y el carrito de compras elimina las boletas seleccionadas` *(Distractor)*

---

### FLUJO 3: CALIFICACIÓN DE JURADOS

#### Ejercicio 3.1: Registro de Calificación

- **Feature:** Calificación de Jurados
- **Scenario:** Registro del puntaje en el criterio de Ritmo y Cadencia
- **Tarjetas Arrastrables (7 Opciones):**
  1. `El jurado oficial tiene la sesión activa en la tablet de juzgamiento del evento` *(Correcto - GIVEN)*
  2. `Ingresa una calificación de "9.8" en la casilla de Ritmo y presiona "Guardar Puntaje"` *(Correcto - WHEN)*
  3. `El sistema calcula el promedio de la pareja, bloquea la celda y actualiza la tabla de posiciones` *(Correcto - THEN)*
  4. `El público asistente en el coliseo empieza a ovacionar a la delegación internacional` *(Distractor)*
  5. `La pareja realiza un cambio de vestuario de emergencia antes de salir a la pista` *(Distractor)*
  6. `El presentador del evento anuncia a los patrocinadores oficiales por el micrófono` *(Distractor)*
  7. `El sistema imprime un certificado en papel firmado por el alcalde de Cali` *(Distractor)*

#### Ejercicio 3.2: Impugnación y Recalificación

- **Feature:** Calificación de Jurados
- **Scenario:** Modificación justificada de puntaje por penalización técnica
- **Tarjetas Arrastrables (7 Opciones):**
  1. `El juez principal ha abierto la solicitud de revisión técnica sobre una rutina finalizada` *(Correcto - GIVEN)*
  2. `Registra la deducción de 0.5 puntos por caída de accesorio y confirma con su clave de juez` *(Correcto - WHEN)*
  3. `El sistema recalcula la nota final, registra el motivo en la bitácora de auditoría y notifica a la mesa central` *(Correcto - THEN)*
  4. `La transmisión de televisión interrumpe la señal para emitir comerciales` *(Distractor)*
  5. `El público vota a través de redes sociales para anular la decisión del juez` *(Distractor)*
  6. `El sistema deshabilita la conexión Wi-Fi de todas las tablets de juzgamiento` *(Distractor)*
  7. `Los participantes solicitan repetir la rutina desde el inicio del tema musical` *(Distractor)*

---

## Criterios de Aceptación (Gherkin)

### Scenario: Flujo de 2 Pasos y Transición de Ejercicio

  Given que el estudiante completa con éxito el Ejercicio 1 del flujo asignado aleatoriamente
  When hace clic en el botón "Validar Requerimiento"
  Then el sistema muestra la confirmación de éxito
  And habilita el botón "Avanzar al Ejercicio 2 de [Nombre del Flujo]"
  When el estudiante hace clic en "Avanzar al Ejercicio 2"
  Then la interfaz carga las 7 tarjetas correspondientes al Ejercicio 2 manteniendo la continuidad contextual del flujo
  And al completar el Ejercicio 2 habilita el botón "Completar Módulo de Análisis".

### Scenario: Retroalimentación por zona

  Given que el estudiante coloca tarjetas en las zonas GIVEN, WHEN y THEN
  When hace clic en "Validar Requerimiento"
  Then cada zona muestra una explicación: correcta (en verde, queda fija), vacía, con un distractor o con una tarjeta que va en otra zona (indicando a cuál)
  And un aviso resume cuántas zonas de 3 están correctas
  And al mover una tarjeta solo se borra la revisión de las zonas que cambiaron.

### Scenario: Pista y confirmación

  Given que el estudiante está resolviendo un ejercicio
  When toca "Pedir pista"
  Then aparece una pista sin costo para distinguir condición, acción, resultado y distractores
  When valida el requerimiento correcto
  Then se muestra la historia de usuario completa como frase ("Dado que…, cuando…, entonces…") y para qué le sirve al equipo.
