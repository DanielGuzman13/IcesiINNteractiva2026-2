# Contraseñas de las actividades · Solo para guías

> ⚠️ **No compartir con los estudiantes.** Este archivo es solo para los guías del taller.

Cada parada del mapa pide su contraseña cuando el estudiante la toca. Así los guías controlan en qué momento empieza cada grupo la siguiente actividad.

| # | Parada del mapa | Rol | Contraseña |
|---|---|---|---|
| 1 | Mundial de Salsa | Analista de Requerimientos | **PANDEBONO-378** |
| 2 | Feria de Cali | Arquitecto de Software | **CHONTADURO-138** |
| 3 | Petronio Álvarez | Full Stack (Backend → Frontend) | **CHAMPUS-385** |
| 4 | Carrera del Pacífico | QA → Ciberseguridad | **LULADA-438** |

## Cómo funciona

- No importan las mayúsculas, los espacios ni el guion: `chontaduro 138` también sirve.
- Se pide **una vez por parada y por dispositivo**. Después de acertar, recargar la página no la vuelve a pedir.
- Las actividades internas de una parada no piden otra contraseña: Frontend (después de Backend) usa la de la parada 3, y Ciberseguridad (después de QA) usa la de la parada 4.
- Las paradas completadas se pueden repasar sin contraseña.
- Si alguien escribe la dirección directamente (por ejemplo `/retos/qa`), también se le pide la contraseña.

## Cambio de grupo (no hay que tocar ningún computador)

El avance y los desbloqueos se guardan en el navegador de cada computador, pero **se borran solos cuando alguien se registra con un nombre distinto** al del jugador anterior. Entre un grupo y otro:

1. Deja cada computador en la **pantalla de inicio** de la app. Si quedó en el mapa, basta con tocar la flecha de arriba a la izquierda ("Volver al perfil").
2. El estudiante del grupo nuevo toca **Iniciar** y se registra con **su** nombre.
3. El mapa arranca desde cero y vuelve a pedir las 4 contraseñas.

Si un estudiante del mismo grupo vuelve al perfil y se registra con el **mismo nombre** (por ejemplo, para cambiar de avatar), conserva su avance.

> Consejo: pidan a cada grupo que no deje el navegador en el mapa al terminar. Si el siguiente estudiante no se registra y sigue desde el mapa del grupo anterior, heredaría los desbloqueos.

## Cambiar una contraseña

1. En la carpeta del proyecto, ejecuta: `node scripts/hash-contrasena.mjs NUEVACLAVE-123`
2. Copia la **Huella** que imprime y reemplaza el valor de esa parada en `src/lib/stage-access.ts` (`STAGE_PASSWORD_HASHES`).
3. Actualiza la tabla de este archivo.

## Nota de seguridad

En el código solo queda la huella (hash) de cada contraseña, no la contraseña en texto, así que no aparece al inspeccionar la página. Es suficiente para un taller con estudiantes de colegio, pero no es una protección de nivel bancario: la app no tiene servidor, así que alguien con conocimientos técnicos podría saltarse el bloqueo editando el almacenamiento del navegador.
