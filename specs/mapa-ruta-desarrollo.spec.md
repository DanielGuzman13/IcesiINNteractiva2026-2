# Feature: Mapa del Tesoro / Ruta Interactiva del Taller de Software

## Contexto General del Taller
El taller "Ruta de Ingeniería de Software" guía a los estudiantes a través de las diferentes etapas y roles del ciclo de desarrollo de software, asociando cada parada a un evento representativo de Cali sobre un mapa interactivo.

## Escenario y Metáfora Visual
- **Diseño Base:** Silueta del mapa geográfico de Cali (con río y paradas emblemáticas).
- **Estilo:** Mapa del tesoro con línea de trayectoria discontinua (curvas Bézier / dashed path).
- **Progresión:** De abajo hacia arriba (Sur a Norte).
- **Elemento Móvil:** El avatar/ícono que el estudiante escogió en la pantalla de bienvenida.

---

## Puntos de Parada y Coordenadas Relativas (Layout Porcentual)

| Parada | Rol de Software | Evento Cultural / Escudo | Coordenadas Aprox. (X%, Y%) | Estado Inicial |
| :--- | :--- | :--- | :--- | :--- |
| **0. Inicio** | Registro / Bienvenida | Marcador "X" (Punto de partida) | (45%, 92%) | Activo al iniciar |
| **1. Parada 1** | Analista de Requerimientos | Mundial de Salsa (Trofeo/Bailarines) | (42%, 78%) | Bloqueado / Pendiente |
| **2. Parada 2** | Arquitecto de Software | Feria de Cali (Salsódromo / Chiva) | (54%, 56%) | Bloqueado / Pendiente |
| **3. Parada 3** | Full Stack Developer | Festival Petronio Álvarez (Marimba) | (43%, 39%) | Bloqueado / Pendiente |
| **4. Parada 4** | QA & Ciberseguridad | Carrera del Pacífico (Atleta / Meta) | (63%, 22%) | Bloqueado / Pendiente |

---

## Criterios de Aceptación (Gherkin)

### Scenario: Carga inicial y posicionamiento del avatar
  Given que el estudiante seleccionó su avatar en la pantalla inicial
  When se carga la pantalla del mapa de retos
  Then el avatar debe posicionarse exactamente sobre el punto "X" de inicio (abajo)
  And la parada 1 (Mundial de Salsa) debe mostrar un pulso visual sutil indicando que es la siguiente estación
  And las paradas superiores (2, 3 y 4) deben mostrarse con un filtro de bloqueo/inactivo.

---

### Scenario: Transición fluida estilo mapa del tesoro entre actividades
  Given que el estudiante completa con éxito un reto (ej. Analista en Mundial de Salsa)
  When regresa a la vista del mapa
  Then el avatar debe desplazarse suavemente a lo largo de la curva del camino hacia la siguiente parada
  And la animación de traslación debe usar una función de tiempo fluida (ease-in-out, duración 1.5s - 2s)
  And el tramo recorrido del camino de puntos debe cambiar a color activo/completado
  And al llegar a la parada destino, el avatar debe dar un pequeño salto o animación de aterrizaje (bounce).

---

### Scenario: Apertura de la actividad correspondiente
  Given que el avatar se encuentra situado en una parada activa
  When el estudiante hace clic sobre el escudo o estación activa (o sobre el botón "Comenzar Reto")
  Then el sistema debe abrir la actividad correspondiente (Mundial de Salsa -> Feria de Cali -> Petronio -> Carrera del Pacífico)
  And no debe permitir hacer clic en estaciones futuras no desbloqueadas.