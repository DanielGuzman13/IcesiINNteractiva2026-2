# Feature: Módulo QA / Testeo de Software - Carrera del Pacífico

## Contexto General del Taller

Este módulo forma parte del taller interactivo "Ruta de Ingeniería de Software", donde los estudiantes asumen distintos roles del ciclo de vida del desarrollo de software a través de escenarios y eventos clave. En este módulo, el estudiante asume el rol de **Ingeniero de QA (Quality Assurance)**.

## Escenario

- **Evento:** Registro y Tiempos de la Carrera del Pacífico (Cali, Colombia).
- **Rol:** QA Engineer.
- **Situación:** El formulario de inscripción salió a producción con fallas. Antes de poder reportar un error, hay que saber qué se esperaba de cada campo.
- **Objetivo del Estudiante:** Explorar el formulario con sus errores y **declarar el dominio de datos de cada campo evaluado**: qué tipo de dato debería aceptar cada celda. Declarar el dominio es el primer paso de un caso de prueba, y es lo que permite distinguir un dato válido de una falla.

> El formulario de la izquierda se conserva completo, con sus bugs, como evidencia observable. El panel derecho es la "Matriz de Calidad", donde el estudiante declara el dominio de cada campo.

---

## Reto Análogo (Hoja de Papel)

- **Catálogo de Dominios** (opciones del desplegable, el mismo para todas las filas):

  | Dominio | Ejemplo válido en el formulario |
  | --- | --- |
  | Texto (solo letras) | "Santiago Pérez Caicedo" |
  | Solo números | "1144012345" |
  | Número con rango | 25 (no -5, no 200) |
  | Lista cerrada (opciones) | "21K Media Maratón" |
  | Casilla (Sí/No) | Términos y Condiciones marcado |

- **Matriz de Calidad (6 campos evaluados):** el orden de las filas se baraja en pantalla, pero las respuestas correctas son fijas.

  | Campo evaluado | Dominio correcto | Cálculo / motivo |
  | --- | --- | --- |
  | Nombre Completo | Texto (solo letras) | No admite números ni caracteres especiales. |
  | Número de Documento | Solo números | Es una identificación numérica; no admite letras. |
  | Edad | Número con rango | Entero dentro de un rango (1 a 120); -5 y 200 son irreales. |
  | Teléfono | Solo números | Es una identificación numérica; no admite letras. |
  | Distancia | Lista cerrada (opciones) | Solo las distancias habilitadas para la categoría; "Infantil" no habilita "42K". |
  | Términos y Condiciones | Casilla (Sí/No) | Casilla de verificación, y además es obligatoria para poder enviar. |

- **Bugs presentes en el formulario (7 en total).** Seis corresponden a los campos de la matriz; BUG-5 (botón) es una falla de UX que se conserva en el formulario como demostración para el profesor, pero **no** se evalúa en la matriz porque no es un campo de datos.

  | ID Bug | Tipo de Bug | Campo | Descripción del Comportamiento Incorrecto | En la matriz |
  | --- | --- | --- | --- | --- |
  | BUG-1 | Validación | Edad | Permite valores negativos o irreales (ej. -5 o 200). | Sí |
  | BUG-2 | Formato | Nombre Completo | Acepta números y caracteres especiales. | Sí |
  | BUG-3 | Lógica | Distancia | Al seleccionar categoría "Infantil", se habilita "42K Maratón Completa". | Sí |
  | BUG-4 | Formato | Número de Documento | Permite ingresar letras. | Sí |
  | BUG-5 | UX / Interfaz | Botón "Registrar Corredor" | Se desplaza o desalinea al pasar el cursor sobre él. | No (demo de UX) |
  | BUG-6 | Flujo / Regla | Términos y Condiciones | Permite enviar el formulario con la casilla desmarcada. | Sí |
  | BUG-7 | Formato | Teléfono | Permite ingresar letras. | Sí |

---

## Criterios de Aceptación (Gherkin)

### Scenario: Generación de la Matriz de Calidad

  Given que el estudiante está en la interfaz del módulo QA
  Then la interfaz debe mostrar a la izquierda el formulario de inscripción de la "Carrera del Pacífico", completo y con sus fallas
  And mostrar a la derecha la sección "Eres el ingeniero de QA" con la explicación: "Declara el dominio de cada campo: qué tipo de dato debería aceptar"
  And barajar el orden de las filas en cada carga de la página
  And mostrar 6 filas numeradas del 1 al 6, cada una con el nombre del campo evaluado
  And cada fila debe tener un desplegable con las 5 opciones del catálogo de dominios, iniciando en "Selecciona el dominio…"
  And un botón con la etiqueta "Validar Clasificación".

---

### Scenario: Dominio incorrecto en una o más filas

  Given que el estudiante ha declarado el dominio de las 6 filas
  When hace clic en el botón "Validar Clasificación"
  Then cada fila correcta debe quedar marcada en verde con un visto bueno
  And cada fila incorrecta debe quedar marcada en ámbar
  And mostrar bajo la fila incorrecta una pista que explica el criterio sin revelar la respuesta (ej. para "Edad": "Si el dominio fuera 'solo números', ¿el -5 sería un error? Falta algo más que un tipo de dato.")
  And el sistema NO debe habilitar el avance ni mostrar el confeti mientras alguna fila sea incorrecta
  And permitir corregir la fila y volver a validar.

---

### Scenario: Matriz completa con todos los dominios correctos

  Given que el estudiante declaró correctamente el dominio de los 6 campos evaluados
  When hace clic en el botón "Validar Clasificación"
  Then las 6 filas deben quedar marcadas en verde
  And el sistema debe mostrar una animación de éxito con confeti
  And mostrar el mensaje: "¡Excelente trabajo de QA! Has declarado el dominio correcto de los 6 campos de la Carrera del Pacífico."
  And habilitar el botón o enlace para continuar al siguiente rol del taller.

---

### Scenario: Anti-trampa por barajado de filas

  Given que dos estudiantes de la misma sala abren el módulo
  When cada uno carga la página
  Then el orden de las filas puede ser distinto en cada pantalla
  And las respuestas correctas se mantienen iguales para todos.
