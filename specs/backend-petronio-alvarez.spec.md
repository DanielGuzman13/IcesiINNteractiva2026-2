# Feature: Módulo Backend con Blockly y Simulación Visual - Festival Petronio Álvarez

## Contexto General del Taller
Este módulo forma parte del taller interactivo "Ruta de Ingeniería de Software", donde los estudiantes de colegio experimentan roles clave del ciclo de vida del software a través de eventos culturales y deportivos emblemáticos. En este módulo, el estudiante asume el rol de **Desarrollador Backend (Backend Engineer)**.

## Escenario
- **Evento:** Festival de Música del Pacífico Petronio Álvarez (Cali, Colombia).
- **Rol:** Backend Engineer.
- **Situación:** Una caseta tradicional de gastronomía pacífica necesita automatizar la atención de pedidos de sus platos típicos (ej. Cazuela de Mariscos, Arroz Guacho) para evitar vender platos cuando los ingredientes se agotan en plena noche de concierto.
- **Objetivo del Estudiante:** Construir visualmente la lógica de un endpoint de API con validación de inventario y transacciones atómicas usando Google Blockly (DSL backend), observando en tiempo real el comportamiento del servidor y la cocina animada en un Canvas contiguo.

---

## Arquitectura de la Interfaz (Split Layout)
1. **Panel Izquierdo (Workspace Blockly):**
   - Motor: Google Blockly con tema visual `zelos` (estilo Scratch).
   - Toolbox con categorías específicas de Backend:
     - `Tráfico HTTP`: Bloques de endpoints y respuestas JSON/HTTP.
     - `Base de Datos`: Bloques de consulta y actualización de inventario.
     - `Lógica y Control`: Bloques condicionales de validación de existencias.
   - Barra de control: Botón "Desplegar API" / "Ejecutar Pedido", botón "Reiniciar Caseta", papelera y controles de zoom.

2. **Panel Derecho (Simulador y Canvas de la Caseta):**
   - `HTML5 Canvas`: Representación gráfica de la cocina tradicional (cocinera, olla burbujeante, ingredientes e interacción con comensales).
   - `Status Board / Terminal`: Consola en vivo con logs de peticiones HTTP, estado transaccional y métricas de inventario en memoria.

---

## Especificación del Dominio (Custom Blocks DSL)

| Block ID | Tipo / Conexión | Parámetros Configurables | Descripción Operacional |
| :--- | :--- | :--- | :--- |
| `api_endpoint` | Root / Statement | `Method` (POST), `Path` (string) | Punto de entrada del servicio HTTP. Contenedor de la rutina backend. |
| `db_get_stock` | Output (Number) | `Ingrediente` (Jaiba, Coco, Camarón) | Consulta la cantidad disponible de un recurso en la base de datos simulada. |
| `controls_if_stock` | Branching | Condición relacional (`stock >= cantidad`) | Bifurca el flujo si existe disponibilidad física del insumo. |
| `db_update_stock` | Statement | `Ingrediente`, `Operación` (-1) | Aplica el descuento atómico en el almacén de datos. |
| `http_response` | Terminator | `Status Code` (200, 201, 409), `Body` | Emite la respuesta HTTP y finaliza el ciclo de vida de la petición. |

---

## Criterios de Aceptación (Gherkin)

### Scenario: Inicialización del entorno de desarrollo backend
  Given que el estudiante abre el módulo Backend del Petronio Álvarez
  Then el espacio de trabajo de Blockly debe cargarse con el tema "zelos" y la barra de herramientas backend
  And el Canvas derecho debe mostrar la caseta en estado "Servidor Inactivo" con la cocinera en reposo
  And la terminal de estado debe indicar "Esperando despliegue de endpoint...".

---

### Scenario: Despliegue exitoso de transacción con stock disponible (201 Created)
  Given que el inventario del ingrediente "Camarón" es mayor a 0 (ej. 5 unidades)
  When el estudiante ensambla la estructura:
    """
    POST /api/pedidos
      -> IF db_get_stock("Camarón") >= 1
           -> db_update_stock("Camarón", -1)
           -> http_response(201, {"mensaje": "Plato servido"})
    """
  And hace clic en el botón "Desplegar API"
  Then el motor de ejecución debe decrementar en 1 la existencia de "Camarón" en pantalla
  And el Canvas debe animar la olla con vapor y emitir un plato hacia el comensal
  And el status-board debe registrar un log verde: `[POST 201 Created] - Transacción completada con éxito`
  And la interfaz debe marcar el reto como "Completado" y habilitar el botón de siguiente actividad.

---

### Scenario: Rechazo controlado por falta de inventario (409 Conflict)
  Given que el inventario de "Jaiba" se encuentra en 0 unidades
  When entra una petición `POST /api/pedidos` para "Jaiba"
  And los bloques incluyen la validación condicional `ELSE -> http_response(409, {"error": "Sin ingredientes"})`
  Then el sistema NO debe permitir valores negativos de inventario
  And el Canvas debe mostrar a la cocinera cruzando los brazos con una nube de alerta roja
  And la consola de estado debe emitir el log: `[POST 409 Conflict] - Pedido rechazado: Stock insuficiente`.

---

### Scenario: Error de concurrencia o venta fantasma (Sin validación de stock)
  Given que el inventario se encuentra en 0
  When el estudiante omite el bloque `controls_if_stock` y ejecuta directamente `db_update_stock` seguido de `http_response(201)`
  And hace clic en "Desplegar API"
  Then el sistema debe arrojar una excepción crítica en la terminal: `[DATABASE ERROR] Integridad violada: Stock negativo no permitido`
  And el Canvas debe detenerse con humo sobre la olla y un letrero: "⚠️ Venta fantasma detectada: Vendiste sin insumos"
  And la interfaz debe sugerir: "Tip de Arquitectura: Recuerda siempre consultar y validar el inventario antes de descontar o responder al cliente".