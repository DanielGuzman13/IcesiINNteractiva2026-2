
# Feature: Módulo Ciberseguridad / Incident Response - Carrera del Pacífico

## Contexto General del Taller

Este módulo forma parte del taller interactivo "Ruta de Ingeniería de Software", donde los estudiantes asumen distintos roles del ciclo de vida del desarrollo de software a través de escenarios y eventos clave. En este módulo, el estudiante asume el rol de **Analista de Ciberseguridad / Incident Responder**.

## Escenario

- **Evento:** Publicación de Tiempos Oficiales de la Carrera del Pacífico (Cali, Colombia).
- **Rol:** Cybersecurity Analyst.
- **Situación:** Un atacante ha bloqueado la puerta de enlace (gateway) del servidor de resultados en el Bulevar del Río con un algoritmo de Cifrado César dinámico.
- **Objetivo del Estudiante:** Calcular la clave de desplazamiento en papel resolviendo la pista de los 21K de la maratón, descifrar la expresión asignada aleatoriamente ingresando cada letra desplazada e ingresar la clave resultante en la interfaz web para restaurar el sistema.

---

## Reto Análogo (Hoja de Papel)

- **Generación Aleatoria (Mecanismo Anti-Trampa):** Cada estudiante/estación de trabajo recibe en pantalla un **Código Encriptado Único** seleccionado aleatoriamente de un banco de 35 expresiones típicas caleñas y colombianas encriptadas con Cifrado César (Shift = 3).
- **Pista Impresa en Papel / Pantalla:** *"La clave de desplazamiento es igual al número de kilómetros oficiales de la Media Maratón de Cali (21K) dividida entre 7"*. ($21 \div 7 = 3$, Desplazamiento = 3 posiciones hacia atrás en el abecedario).
- **Herramienta en Papel:** Hoja con la tabla o disco de sustitución del Cifrado César para retroceder 3 posiciones por cada letra.
- **Banco de Expresiones Encriptadas y Descifradas (Shift = 3):**
  1. `FKRODGRKHODGR` ➔ **CHOLADOHELADO**
  2. `OXODGDIULD` ➔ **LULADAFRIA**
  3. `PDQJRYLFKH` ➔ **MANGOVICHE**
  4. `FKRQWDGXUR` ➔ **CHONTADURO**
  5. `SDQDGDGHFDOL` ➔ **PANADADECALI**
  6. `PBDFDGMHOR` ➔ **MYACADJELO**
  7. `FKRULSDQ` ➔ **CHORIPAN**
  8. `PBDFDGJDR` ➔ **MYACADGAO**
  9. `CLOROLVGD` ➔ **ZILOLISDA**
  10. `EULVDVGHFDOL` ➔ **BRISASDECALI**
  11. `SROORFRQSDSD` ➔ **POLLOCONPAPA**
  12. `FKRODGRIULR` ➔ **CHOLADOFRIO**
  13. `IULWRFDOHQR` ➔ **FRITOCALENO**
  14. `EXOHYDUGHOULR` ➔ **BULEVARDELRIO**
  15. `LVOLWDGHOULR` ➔ **ISLITADELRIO**
  16. `JDRFRQSDSD` ➔ **GAOCONPAPA**
  17. `OXODGDULFD` ➔ **LULADARICA**
  18. `PDQJRHQOLPRQ` ➔ **MANGOENLIMON**
  19. `FKRODGRGXOFH` ➔ **CHOLADODULCE**
  20. `PDOERQLWR` ➔ **MALBONITO**
  21. `SDSDIULWD` ➔ **PAPAFRITA**
  22. `OXODGDJRUGD` ➔ **LULADAGORDA**
  23. `PBDFDFRQSDSD` ➔ **MYACACONPAPA**
  24. `SROORFDOHQR` ➔ **POLLOCALENO**
  25. `FDOHQRIULR` ➔ **CALENOFRIO**
  26. `FKRULFDOHQR` ➔ **CHORICALENO**
  27. `OXODGDIUHVFD` ➔ **LULADAFRESCA**
  28. `PDQJRYLWR` ➔ **MANGOVITO**
  29. `EXIIRFDOHQR` ➔ **BUFFOCALENO**
  30. `SROODJRWR` ➔ **POLLAGOTO**
  31. `PBDFDFRQIULR` ➔ **MYACACONFRIO**
  32. `SDSDIULWD` ➔ **PAPAFRITA**
  33. `IULWRULFR` ➔ **FRITORICO**
  34. `SROORULFR` ➔ **POLLORICO**
  35. `FDOHQRDPRU` ➔ **CALENOAMOR**

---

## Criterios de Aceptación (Gherkin)

### Scenario: Generación dinámica del reto en pantalla inicial

  Given que el estudiante ingresa al módulo de Ciberseguridad en la app web
  Then la interfaz debe mostrar una alerta roja de "SERVIDOR BLOQUEADO / ATAQUE DETECTADO"
  And seleccionar y mostrar aleatoriamente un código encriptado del banco (ej. "Código Encriptado: FRRODGRKHODGR")
  And mostrar la instrucción: "Paso 1: Resuelve el acertijo numérico en tu hoja para hallar el desplazamiento y descifra el código usando la tabla de Cifrado César."
  And mostrar un campo de texto (input) para ingresar la "Clave Descifrada"
  And un botón con la etiqueta "Restaurar Servidor".

---

### Scenario: Desbloqueo exitoso con la clave descifrada válida

  Given que el sistema asignó un código aleatorio (ej. "FRRODGRKHODGR")
  When el estudiante calcula el desplazamiento de 3 posiciones en su hoja de papel
  And descifra la expresión ("CHOLADOHELADO")
  And ingresa "CHOLADOHELADO" (o "choladohelado", ignorando mayúsculas/minúsculas) en el input de la UI
  And hace clic en el botón "Restaurar Servidor"
  Then la interfaz debe cambiar de estado a "SISTEMA RESTAURADO" (estilo/tema verde de éxito)
  And mostrar un mensaje de consola/terminal simulada: `[SUCCESS] Clave Cifrado César verificada. Desbloqueando tabla de tiempos...`
  And desplegar la tabla oficial de ganadores de la Carrera del Pacífico con animación de confeti
  And habilitar el botón para avanzar a la siguiente actividad del taller.

---

### Scenario: Intento de desbloqueo con clave errónea

  Given que la interfaz muestra un código encriptado aleatorio
  When el estudiante ingresa un texto que no corresponde a la sustitución por Cifrado César del código asignado
  And hace clic en el botón "Restaurar Servidor"
  Then el sistema debe mantenerse en estado "BLOQUEADO"
  And mostrar un mensaje de error: "⚠️ Clave de acceso no válida. Recuerda resolver el acertijo (21K ÷ 7 = 3) y retroceder 3 posiciones en el abecedario para cada letra."
  And aplicar una animación de sacudida (shake) al contenedor del formulario.
