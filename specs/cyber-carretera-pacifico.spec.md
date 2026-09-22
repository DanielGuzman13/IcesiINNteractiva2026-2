
# Feature: Módulo Ciberseguridad / Incident Response - Carrera del Pacífico

## Contexto General del Taller

Este módulo forma parte del taller interactivo "Ruta de Ingeniería de Software", donde los estudiantes asumen distintos roles del ciclo de vida del desarrollo de software a través de escenarios y eventos clave. En este módulo, el estudiante asume el rol de **Analista de Ciberseguridad / Incident Responder**.

## Escenario

- **Evento:** Publicación de Tiempos Oficiales de la Carrera del Pacífico (Cali, Colombia).
- **Rol:** Cybersecurity Analyst.
- **Situación:** Un atacante ha bloqueado la puerta de enlace (gateway) del servidor de resultados en el Bulevar del Río mediante un cifrado básico y dejó una nota de rescate encriptada.
- **Objetivo del Estudiante:** Resolver el reto de criptografía (Cifrado César) usando la hoja de papel y la plantilla de sustitución, descifrar el PIN/palabra clave de recuperación e ingresarlo en la interfaz web para restaurar el sistema.

---

## Reto Análogo (Hoja de Papel)

- **Mensaje Encriptado en Papel:** `FDUUHUD GHOSDFLILFR` (o la palabra clave `SDFLILFR2026`)
- **Pista Impresa:** *"La clave de desplazamiento es igual al número de kilómetros oficiales de la Media Maratón de Cali (21K) dividida entre 7"*. ($21 \div 7 = 3$, Desplazamiento = 3).
- **Herramienta en Papel:** Disco o tabla de sustitución del Cifrado César para retroceder 3 posiciones en el abecedario.
- **Resultado Esperado:** `PACIFICO2026`

---

## Criterios de Aceptación (Gherkin)

### Scenario: Pantalla inicial en estado de emergencia / bloqueo

  Given que el estudiante ingresa al módulo de Ciberseguridad en la app web
  Then la interfaz debe mostrar una alerta roja de "SERVIDOR BLOQUEADO / ATAQUE DETECTADO"
  And ocultar la tabla oficial de tiempos y ganadores de la Carrera del Pacífico
  And mostrar un campo de texto (input) para ingresar la "Clave de Desbloqueo de Emergencia"
  And un botón con la etiqueta "Restaurar Servidor".

---

### Scenario: Desbloqueo exitoso con la clave descifrada en papel

  Given que la interfaz se encuentra en estado "BLOQUEADO"
  When el estudiante descifra la clave en papel ("PACIFICO2026")
  And ingresa "PACIFICO2026" (o "pacifico2026", ignorando mayúsculas/minúsculas) en el input de la UI
  And hace clic en el botón "Restaurar Servidor"
  Then la interfaz debe cambiar de estado a "SISTEMA RESTAURADO" (estilo/tema verde de éxito)
  And mostrar un mensaje de consola/terminal simulada: `[SUCCESS] Clave válida. Desbloqueando tabla de tiempos...`
  And desplegar la tabla oficial de ganadores de la Carrera del Pacífico con animación de confeti
  And habilitar el botón para avanzar a la siguiente actividad del taller.

---

### Scenario: Intento de desbloqueo con clave errónea

  Given que la interfaz se encuentra en estado "BLOQUEADO"
  When el estudiante ingresa una clave incorrecta (ej. "CALI2026" o "CARRERA123")
  And hace clic en el botón "Restaurar Servidor"
  Then el sistema debe mantenerse en estado "BLOQUEADO"
  And mostrar un mensaje de error: "⚠️ Clave de acceso no válida. Revisa la pista de los 21K y la tabla de desplazamiento en tu hoja."
  And aplicar una animación de sacudida (shake) al contenedor del formulario.
