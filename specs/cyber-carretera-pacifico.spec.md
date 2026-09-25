
# Feature: Módulo Ciberseguridad / Incident Response - Carrera del Pacífico

## Contexto General del Taller

Este módulo forma parte del taller interactivo "Ruta de Ingeniería de Software", donde los estudiantes asumen distintos roles del ciclo de vida del desarrollo de software a través de escenarios y eventos clave. En este módulo, el estudiante asume el rol de **Analista de Ciberseguridad / Incident Responder**.

## Escenario

- **Evento:** Publicación de Tiempos Oficiales de la Carrera del Pacífico (Cali, Colombia).
- **Rol:** Cybersecurity Analyst.
- **Situación:** Un atacante ha bloqueado la puerta de enlace (gateway) del servidor de resultados en el Bulevar del Río con una clave dinámica de autenticación.
- **Objetivo del Estudiante:** Resolver el reto de desencriptación en papel sobre su expresión asignada aleatoriamente, descifrar la clave original e ingresarla en la interfaz web para restaurar el sistema.

---

## Reto Análogo (Hoja de Papel)

- **Generación Aleatoria (Mecanismo Anti-Trampa):** Cada estudiante/estación de trabajo recibe en pantalla un **Código Encriptado Único** seleccionado aleatoriamente de un banco de 35 expresiones típicas caleñas y colombianas (palabras simples y compuestas pegadas).
- **Mecanismo de Encriptación:** La expresión está escrita en reversa (Inversión de Cadena / Mirror Cipher).
- **Banco de Expresiones (35 Tokens Caleños/Colombianos):**
  1. `ODALEHODALOHC` ➔ **CHOLADOHELADO**
  2. `AIRFADALUL` ➔ **LULADAFRIA**
  3. `EHCIVOGNAM` ➔ **MANGOVICHE**
  4. `ORUDATNOHC` ➔ **CHONTADURO**
  5. `RAOSASAMARAP` ➔ **PARAMASASOAR**
  6. `ACIRARAMAP` ➔ **PAMARARICA**
  7. `AIRIFADANAP` ➔ **PANADAFIRIA**
  8. `OYACNABATAP` ➔ **PATABANCAYO**
  9. `ODALECABOR` ➔ **ROBACELADO**
  10. `ECLUDACABU` ➔ **UBACADULCE**
  11. `OYELALAVA` ➔ **AVALALEYO**
  12. `ECRADABAM` ➔ **MABADARCE**
  13. `ASOICELAM` ➔ **MALECIOSA**
  14. `OIRFAYUB` ➔ **BUYAFRIO**
  15. `OIRECRAC` ➔ **CARCERIO**
  16. `ODICAACU` ➔ **UCAACIDO**
  17. `ACIRASAM` ➔ **MASARICA**
  18. `ASAPADAC` ➔ **CADAPASA**
  19. `AIRFEDALUL` ➔ **LULADEFRIA**
  20. `ECLUDOGNAM` ➔ **MANGODULCE**
  21. `OYPAUANAP` ➔ **PANAUAPYO**
  22. `ACIRAYUB` ➔ **BUYARICA**
  23. `ORUDORAM` ➔ **MARODURO**
  24. `AIRFACAT` ➔ **TACAFRIA**
  25. `ASOICEMAP` ➔ **PAMECIOSA**
  26. `ECLUDACAT` ➔ **TACADULCE**
  27. `ACIRADALUL` ➔ **LULADARICA**
  28. `ODICAANOA` ➔ **AONAACIDO**
  29. `ODALEEBAY` ➔ **YABEELADO**
  30. `OIRFAUAN` ➔ **NAUAFRIO**
  31. `ACIRAMAP` ➔ **PAMARICA**
  32. `ECLUDAMAP` ➔ **PAMADULCE**
  33. `ASAPAYUB` ➔ **BUYAPASA**
  34. `ODALENAP` ➔ **PANELADO**
  35. `AIRFASAM` ➔ **MASAFRIA**
- **Herramienta en Papel:** Hoja de análisis de patrones donde el estudiante debe invertir el orden de los caracteres (de derecha a izquierda) para revelar la contraseña del sistema.

---

## Criterios de Aceptación (Gherkin)

### Scenario: Generación dinámica del reto en pantalla inicial

  Given que el estudiante ingresa al módulo de Ciberseguridad en la app web
  Then la interfaz debe mostrar una alerta roja de "SERVIDOR BLOQUEADO / ATAQUE DETECTADO"
  And seleccionar y mostrar aleatoriamente un mensaje encriptado del banco de 35 expresiones (ej. "Código Encriptado: ODALEHDALOHC")
  And mostrar la instrucción: "Paso 1: Copia tu código encriptado en la hoja de papel y descífralo invirtiendo el orden de las letras de derecha a izquierda."
  And mostrar un campo de texto (input) para ingresar la "Clave Descifrada"
  And un botón con la etiqueta "Restaurar Servidor".

---

### Scenario: Desbloqueo exitoso con la clave descifrada válida

  Given que el sistema asignó una expresión aleatoria (ej. "ODALEHDALOHC")
  When el estudiante invierte el texto en su hoja de papel ("CHOLADOHELADO")
  And ingresa "CHOLADOHELADO" (o "choladohelado", ignorando mayúsculas/minúsculas) en el input de la UI
  And hace clic en el botón "Restaurar Servidor"
  Then la interfaz debe cambiar de estado a "SISTEMA RESTAURADO" (estilo/tema verde de éxito)
  And mostrar un mensaje de consola/terminal simulada: `[SUCCESS] Token caleño verificado. Desbloqueando tabla de tiempos...`
  And desplegar la tabla oficial de ganadores de la Carrera del Pacífico con animación de confeti
  And habilitar el botón para avanzar a la siguiente actividad del taller.

---

### Scenario: Intento de desbloqueo con clave errónea

  Given que la interfaz muestra un código encriptado aleatorio
  When el estudiante ingresa un texto que no corresponde a la inversión correcta de la expresión asignada
  And hace clic en el botón "Restaurar Servidor"
  Then el sistema debe mantenerse en estado "BLOQUEADO"
  And mostrar un mensaje de error: "⚠️ Clave de acceso no válida. Recuerda invertir el orden de las letras de derecha a izquierda en tu hoja."
  And aplicar una animación de sacudida (shake) al contenedor del formulario.
