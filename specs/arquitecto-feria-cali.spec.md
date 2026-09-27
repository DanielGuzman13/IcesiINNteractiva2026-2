# Feature: Módulo Arquitecto de Software - Feria de Cali

## Contexto General del Taller

Este módulo forma parte del taller interactivo "Ruta de Ingeniería de Software", donde los estudiantes asumen distintos roles del ciclo de vida del desarrollo de software. En este módulo, el estudiante asume el rol de **Arquitecto de Software** y diseña el diagrama de clases de la app oficial de la Feria de Cali.

## Público y Enfoque

- **Público:** estudiantes de grado 10° y 11° sin conocimientos previos de programación.
- **Duración:** ~15 minutos (intro 1 min · nivel 1 ~4 min · nivel 2 ~5 min · nivel 3 ~3 min · plano final ~2 min).
- **Principio:** primero la idea, después la palabra técnica. Se juega con lenguaje cotidiano y al completar cada nivel se revela el término técnico.

| Palabra cotidiana | Término técnico |
| --- | --- |
| Molde | Clase |
| Ejemplo real | Objeto |
| Característica | Atributo |
| Conexión | Relación |

## Flujo de Pantallas (`/retos/arquitecto`)

1. **Intro (misión):** la Alcaldía contrata al equipo para crear la app de la Feria. Tabla con las 4 ideas, tarjetas de los 3 niveles con tiempo estimado y reglas de puntaje.
2. **Nivel 1 · ¿Molde o ejemplo?:** 12 tarjetas (6 moldes: Orquesta, Bailarín, Boleta, Desfile, Escuela de salsa, Asistente; 6 ejemplos: Grupo Niche, El Salsódromo, Swing Latino, Valentina, Boleta #0457, Carlos). Se clasifican en dos columnas. Revelación: clase, objeto y abstracción.
3. **Nivel 2 · ¿Qué lo describe?:** 4 moldes (Orquesta, Bailarín, Boleta, Desfile) reciben 3 características cada uno desde un banco de 15 (3 distractores: "Grupo Niche", "Salsa", "Muchos aplausos"). Revelación: atributo y valor.
4. **Nivel 3 · ¿Cómo se conectan?:** 5 frases "Molde ___ Molde" que se completan con una acción de un banco de 7 (2 distractores). Revelación: relación.
5. **Plano final:** diagrama de clases con los 6 moldes, sus atributos y relaciones; glosario; ubicación del rol en el ciclo de vida (Requisitos → **Diseño** → Desarrollo → Pruebas → Seguridad y entrega); puntaje e insignia.

El contenido vive en `src/components/game/arquitecto/feria-data.ts`.

## Reglas de Puntaje

- Cada nivel vale hasta **100 pts** (total 300).
- Cada validación con errores resta **15 pts**; la pista resta **10 pts** (una por nivel). Mínimo 40 pts por nivel.
- Insignias: ≥260 "Arquitecto Maestro del Salsódromo" · ≥180 "Arquitecto de la Feria" · menos "Aprendiz de Arquitecto".
- Se guarda con `saveActivityScore("arquitecto", ...)`: `nivel1`, `nivel2`, `nivel3` y `score` (total).

## Criterios de Aceptación (Gherkin)

### Scenario: Interacción con arrastrar o tocar

  Given que el estudiante está en cualquier nivel
  Then puede arrastrar una tarjeta a una zona
  And en pantallas táctiles puede tocar la tarjeta y luego tocar la zona de destino

### Scenario: Validación con errores

  Given que el estudiante completó todas las zonas de un nivel
  When hace clic en el botón de validar
  Then las respuestas correctas quedan fijas en verde con su explicación
  And las incorrectas se marcan en rojo, se sacuden y muestran por qué están mal
  And se descuentan 15 pts del nivel

### Scenario: Nivel completado

  Given que todas las respuestas del nivel son correctas
  When valida
  Then se muestra confeti y una tarjeta que revela el término técnico de lo que acaba de hacer
  And un botón para continuar al siguiente nivel
