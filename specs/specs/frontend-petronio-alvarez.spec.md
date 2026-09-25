# Feature: Módulo Frontend / UX & Heurísticas de Usabilidad - Festival Petronio Álvarez

## Contexto General del Taller
Este módulo forma parte del taller interactivo "Ruta de Ingeniería de Software", donde los estudiantes de colegio experimentan roles clave del ciclo de vida del software a través de eventos emblemáticos. En este módulo, el estudiante asume el rol de **Desarrollador Frontend & Diseñador UI/UX (Frontend Engineer)**.

## Escenario
- **Evento:** Festival de Música del Pacífico Petronio Álvarez (Cali, Colombia).
- **Rol:** Frontend / UX Engineer.
- **Narrativa / Misión (Ventana Emergente):** La organización del festival acaba de lanzar la app oficial "Sonoridades del Pacífico" para que el público consulte en vivo qué agrupación de marimba o chirimía está tocando en tarima y escuche adelantos de sus canciones. Sin embargo, la interfaz actual está causando frustración entre los asistentes: los botones no responden visualmente, los contrastes son ilegibles bajo el sol de Cali y la navegación es confusa. El equipo necesita a un especialista de Frontend para auditar la app y elegir las mejores decisiones de interfaz y heurísticas de usabilidad.

---

## Arquitectura de la Interfaz

1. **Modal de Contexto Inicial (Storytelling Modal):**
   - Se abre automáticamente al cargar la pantalla.
   - Presenta el símil con la música del Petronio Álvarez y explica la misión de UX/Frontend.
   - Botón: "Comenzar Auditoría Frontend".

2. **Panel de Evaluación Interactiva (Quiz Visual de 6 Preguntas):**
   - Barra de progreso superior (ej. "Pregunta 3 de 6").
   - Enunciado del problema de interfaz.
   - Tarjetas de opción visual (Simulación o Screenshots de componentes UI: botones, modales, paletas, reproductores).
   - Modo de selección: Selección única excluyente por pregunta.
   - Botón de navegación: "Siguiente Pregunta" (inactivo hasta seleccionar una opción) y "Finalizar Auditoría" en la última pregunta.

3. **Panel de Retroalimentación y Resultados (Feedback Screen):**
   - Se despliega únicamente cuando las 6 preguntas han sido respondidas.
   - Resumen de puntaje global (ej. "5/6 aciertos").
   - Desglose pregunta por pregunta que muestra:
     - La opción elegida por el estudiante.
     - Indicador visual claro (Check verde si fue correcta, Cruz roja si fue incorrecta).
     - La respuesta correcta en caso de error.
     - **Justificación detallada:** Explicación técnica de por qué esa opción cumple o viola la heurística de usabilidad, el principio de color o el estándar de accesibilidad.
   - Botón de cierre o avance a la siguiente estación del taller.

---

## Banco de Preguntas: Heurísticas, Color y UI Components

### Pregunta 1: Visibilidad del estado del sistema (Heurística 1 de Nielsen)
- **Caso:** Un usuario pulsa el botón "Reproducir Marimba de Chonta" en la app, pero la canción tarda 3 segundos en cargar debido a la congestión de red en el festival.
- **Opciones Visuales (Screenshots / Mockups):**
  - *Opción A:* El botón no cambia en absoluto; se queda estático mientras carga.
  - *Opción B (Correcta):* El botón cambia inmediatamente su texto a un spinner de carga animado con el mensaje *"Cargando audio..."*.
  - *Opción C:* La pantalla se pone completamente en blanco hasta que el audio comienza a sonar.
- **Justificación:** El sistema siempre debe informar al usuario en tiempo real qué está sucediendo mediante retroalimentación inmediata, evitando que el usuario presione el botón varias veces pensando que falló.

### Pregunta 2: Contraste y Accesibilidad de Color (Accesibilidad Web / WCAG)
- **Caso:** Diseñar la tarjeta del horario de la noche para la tarima principal bajo el brillo de las luces del escenario y pantallas al aire libre.
- **Opciones Visuales:**
  - *Opción A:* Texto amarillo claro sobre fondo blanco (#FFFF00 sobre #FFFFFF).
  - *Opción B (Correcta):* Texto blanco sobre fondo azul petróleo oscuro (#FFFFFF sobre #0F172A) con relación de contraste mayor a 4.5:1.
  - *Opción C:* Texto gris claro sobre fondo gris medio (#A3A3A3 sobre #737373).
- **Justificación:** Un contraste alto garantiza que la información clave (horarios y artistas) sea legible tanto para personas con baja agudeza visual como bajo la luz solar directa o pantallas con poco brillo.

### Pregunta 3: Consistencia y Estándares (Heurística 4 de Nielsen)
- **Caso:** Diseñar los controles de reproducción de música (Play, Pausa, Siguiente) en la app del festival.
- **Opciones Visuales:**
  - *Opción A:* Usar un triángulo apuntando a la derecha para Pausa y un círculo para Play.
  - *Opción B:* Usar palabras de texto extensas: "Iniciar audición musical" y "Suspender audición musical".
  - *Opción C (Correcta):* Usar los iconos universales estándar: triángulo a la derecha (▶) para Play y dos barras verticales (⏸) para Pausa.
- **Justificación:** La consistencia externa con estándares de la industria permite que los usuarios reconozcan y operen los controles al instante sin tener que aprender una simbología nueva.

### Pregunta 4: Prevención de Errores vs. Eliminación Accidental (Heurística 5 de Nielsen)
- **Caso:** El usuario tiene una lista de "Mis Canciones Favoritas del Petronio" y toca el icono de la papelera para quitar una canción.
- **Opciones Visuales:**
  - *Opción A:* La canción se borra al instante sin aviso ni opción de deshacer.
  - *Opción B (Correcta):* Aparece un modal o notificación inferior con confirmación: *"¿Eliminar de favoritos?"* junto a un botón rápido de *"Deshacer"*.
  - *Opción C:* La app cierra sesión automáticamente como medida de seguridad.
- **Justificación:** Prevenir acciones destructivas involuntarias y permitir revertir descuidos da seguridad al usuario y reduce la frustración al interactuar con listas personalizadas.

### Pregunta 5: Jerarquía Visual y Anatomía de Botones (Call to Action - CTA)
- **Caso:** En la pantalla de compra/reserva de entrada al concierto estelar, hay dos acciones: "Confirmar Reserva" (acción principal) y "Cancelar" (acción secundaria).
- **Opciones Visuales:**
  - *Opción A:* Ambos botones son gigantes, de color rojo brillante y exactamente del mismo tamaño.
  - *Opción B (Correcta):* "Confirmar Reserva" tiene fondo sólido llamativo (Botón Primario / Alto Contraste) y "Cancelar" tiene estilo de borde o enlace neutro (Botón Secundario / Ghost Button).
  - *Opción C:* "Cancelar" es el botón más grande y vistoso, mientras que "Confirmar Reserva" es un texto gris diminuto.
- **Justificación:** La jerarquía visual guía la vista del usuario hacia la acción principal deseada, reduciendo la carga cognitiva y evitando clics accidentales en la opción secundaria.

### Pregunta 6: Reconocimiento antes que Recuerdo (Heurística 6 de Nielsen)
- **Caso:** El usuario quiere buscar grupos de música tradicional por categoría de instrumentos en el festival.
- **Opciones Visuales:**
  - *Opción A:* Un campo de texto vacío donde el usuario debe escribir de memoria el nombre exacto de la modalidad (ej. "Violines Caucanos").
  - *Opción B (Correcta):* Filtros rápidos visibles en chips o tarjetas seleccionables con iconos y nombres: [Marimba], [Chirimía], [Cantos Tradicionales], [Violines Caucanos].
  - *Opción C:* Un manual en PDF de 20 páginas con la lista de categorías que debe memorizar antes de usar el buscador.
- **Justificación:** Es mucho más fácil para el cerebro humano reconocer opciones visibles en pantalla que recordar términos exactos de memoria.

---

## Criterios de Aceptación (Gherkin)

### Scenario: Despliegue del contexto musical en ventana emergente
  Given que el estudiante entra a la actividad de Frontend
  When la página termina de cargar
  Then debe mostrarse una ventana emergente (Modal) con la narrativa de la app de música del Petronio Álvarez
  And el fondo debe mostrarse atenuado (overlay oscuro)
  And al hacer clic en "Comenzar Auditoría Frontend", el modal debe cerrarse y mostrar la primera pregunta.

---

### Scenario: Flujo de respuesta con selección única obligatoria
  Given que el estudiante está en una pregunta activa (ej. Pregunta 1 de 6)
  When aún no ha seleccionado ninguna opción
  Then el botón "Siguiente Pregunta" debe encontrarse deshabilitado
  When selecciona una de las opciones visuales disponibles
  Then esa opción debe marcarse visualmente como seleccionada (borde destacado)
  And las demás opciones deben desmarcarse automáticamente (selección única)
  And el botón "Siguiente Pregunta" debe habilitarse.

---

### Scenario: Visualización del panel de justificaciones al completar el quiz
  Given que el estudiante ha respondido la pregunta 6
  When hace clic en "Finalizar Auditoría"
  Then el sistema debe calcular el número total de aciertos sobre 6
  And renderizar la pantalla de retroalimentación detallada
  And por cada pregunta, mostrar si la respuesta fue correcta o incorrecta junto con la justificación técnica de la heurística/principio aplicado
  And habilitar el botón de finalización del taller o avance de estación.