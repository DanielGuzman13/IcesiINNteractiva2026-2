
# Feature: Módulo QA / Testeo de Software - Carrera del Pacífico

## Contexto General del Taller

Este módulo forma parte del taller interactivo "Ruta de Ingeniería de Software", donde los estudiantes asumen distintos roles del ciclo de vida del desarrollo de software a través de escenarios y eventos clave. En este módulo, el estudiante asume el rol de **Ingeniero de QA (Quality Assurance)**.

## Escenario

- **Evento:** Registro y Tiempos de la Carrera del Pacífico (Cali, Colombia).
- **Rol:** QA Engineer.
- **Objetivo del Estudiante:** Explorar el formulario de inscripción, detectar fallas de validación, lógica y UX, e ingresar el total exacto de bugs encontrados en el módulo de auditoría final.

---

## Criterios de Aceptación (Gherkin)

### Scenario: Exploración y detección de bugs intencionados en el formulario

  Given que el estudiante está en la interfaz de registro de la "Carrera del Pacífico"
  When interactúa con los campos del formulario
  Then debe poder identificar exactamente 7 bugs intencionados:
    | ID Bug | Tipo de Bug   | Descripción del Comportamiento Incorrecto |
    | BUG-1  | Validación    | El campo "Edad" permite valores negativos o irreales (ej. -5 o 200). |
    | BUG-2  | Formato       | El campo "Nombre Completo" acepta números y caracteres especiales. |
    | BUG-3  | Lógica        | Al seleccionar categoría "Infantil", se habilita la opción de "42K Maratón Completa". |
    | BUG-4  | Validación    | El campo "Número de Documento" permite ingresar letras. |
    | BUG-5  | UX / Interfaz | El botón "Registrar Corredor" se desplaza o desalinea al pasar el cursor sobre él. |
    | BUG-6  | Localización  | El mensaje de ayuda del campo "Teléfono" está escrito en inglés ("Enter a valid phone number"). |
    | BUG-7  | Flujo / Regla | El formulario permite enviarse exitosamente con el checkbox de "Términos y Condiciones" desmarcado. |

---

### Scenario: Validación del reporte de auditoría QA con conteo correcto

  Given que el estudiante ha contado los errores encontrados en el formulario
  When ingresa el número "7" en el campo "¿Cuántos errores encontraste?" de la sección "Auditoría QA"
  And hace clic en el botón "Validar Reporte"
  Then el sistema debe mostrar una animación de éxito con confeti
  And mostrar el mensaje: "¡Excelente trabajo de QA! Has detectado todos los errores del formulario de la Carrera del Pacífico."
  And habilitar el botón o enlace para continuar al siguiente rol del taller.

---

### Scenario: Intentos con conteo incorrecto de bugs

  Given que el estudiante ingresa un número diferente de "7" en la sección "Auditoría QA"
  When hace clic en el botón "Validar Reporte"
  Then el sistema debe mantener el estado no completado
  And mostrar un mensaje de retroalimentación: "Estás cerca. Revisa bien los campos numéricos, las opciones de categoría y el comportamiento de los botones."
