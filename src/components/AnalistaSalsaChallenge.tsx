"use client";

import { useRouter } from "next/navigation";
import { useState, type DragEvent } from "react";
import { motion } from "framer-motion";
import { completeStage } from "@/lib/ruta-progress";
import { continuarConCierre } from "@/lib/personajes";

type TipoBloque = "given" | "when" | "then" | "distractor";

interface Bloque {
  id: string;
  tipo: TipoBloque;
  texto: string;
}

interface Feature {
  nombre: string;
  scenario: string;
  bloques: Bloque[];
}

interface Flujo {
  nombre: string;
  ejercicios: Feature[];
}

const ZONAS: { tipo: TipoBloque; etiqueta: string }[] = [
  { tipo: "given", etiqueta: "1. Condición Inicial (GIVEN)" },
  { tipo: "when", etiqueta: "2. Acción del Usuario (WHEN)" },
  { tipo: "then", etiqueta: "3. Resultado del Sistema (THEN)" },
];

const TABLA_GHERKIN: { palabra: string; significado: string; ejemplo: string }[] = [
  {
    palabra: "GIVEN (Dado que...)",
    significado: "Contexto o condición inicial necesaria",
    ejemplo: "Dado que el usuario está registrado",
  },
  {
    palabra: "WHEN (Cuando...)",
    significado: "Acción o evento realizado por el usuario",
    ejemplo: "Cuando presiona el botón de comprar",
  },
  {
    palabra: "THEN (Entonces...)",
    significado: "Resultado esperado del sistema",
    ejemplo: "Entonces se genera su comprobante",
  },
];

const FLUJOS: Flujo[] = [
  {
    nombre: "Votación del Público",
    ejercicios: [
      {
        nombre: "Votación del Público",
        scenario: "Registrar el voto del público durante una presentación",
        bloques: [
          {
            id: "f1e1-given",
            tipo: "given",
            texto:
              "El espectador tiene la app oficial abierta y la pareja de baile está ejecutando su rutina en la pista",
          },
          {
            id: "f1e1-when",
            tipo: "when",
            texto:
              'El espectador presiona el botón "Votar por esta Pareja" y selecciona un puntaje de 10',
          },
          {
            id: "f1e1-then",
            tipo: "then",
            texto:
              'El sistema suma el voto al promedio en tiempo real y muestra la confirmación "¡Voto registrado!"',
          },
          {
            id: "f1e1-d1",
            tipo: "distractor",
            texto:
              "El jurado internacional califica el vestuario y la coordinación de la escuela de baile",
          },
          {
            id: "f1e1-d2",
            tipo: "distractor",
            texto:
              "El servidor web reinicia la transmisión en vivo por saturación de usuarios",
          },
          {
            id: "f1e1-d3",
            tipo: "distractor",
            texto:
              'El bailarín principal se resbala durante la ejecución del paso caleño "El Repique"',
          },
          {
            id: "f1e1-d4",
            tipo: "distractor",
            texto:
              "La app envía un correo promocional con descuento para la tienda oficial de salsa",
          },
        ],
      },
      {
        nombre: "Control de Voto Duplicado",
        scenario: "Control de votación duplicada en un mismo dispositivo",
        bloques: [
          {
            id: "f1e2-given",
            tipo: "given",
            texto:
              "El usuario ya emitió su voto para la pareja en competencia desde su cuenta verificada",
          },
          {
            id: "f1e2-when",
            tipo: "when",
            texto:
              "Intenta presionar nuevamente el botón de votación para la misma presentación",
          },
          {
            id: "f1e2-then",
            tipo: "then",
            texto:
              'El sistema deshabilita la acción, mantiene el voto previo y despliega el aviso "Ya has votado por este participante"',
          },
          {
            id: "f1e2-d1",
            tipo: "distractor",
            texto:
              "El administrador del evento elimina la cuenta del usuario por intento de fraude",
          },
          {
            id: "f1e2-d2",
            tipo: "distractor",
            texto:
              "La app cierra la sesión automáticamente y reinicia los valores del servidor",
          },
          {
            id: "f1e2-d3",
            tipo: "distractor",
            texto:
              "El conteo total de votos retrocede a cero para todas las parejas de la categoría",
          },
          {
            id: "f1e2-d4",
            tipo: "distractor",
            texto:
              "El dispositivo del usuario recibe una notificación push con la programación del día siguiente",
          },
        ],
      },
    ],
  },
  {
    nombre: "Boletería Digital",
    ejercicios: [
      {
        nombre: "Boletería Digital",
        scenario: "Compra exitosa de entradas en categoría Ensambles",
        bloques: [
          {
            id: "f2e1-given",
            tipo: "given",
            texto:
              "El usuario está autenticado en la plataforma y existen entradas disponibles en Zona VIP",
          },
          {
            id: "f2e1-when",
            tipo: "when",
            texto:
              "Selecciona 2 boletas y completa la transacción ingresando los datos de pago",
          },
          {
            id: "f2e1-then",
            tipo: "then",
            texto:
              "El sistema reserva los asientos, descuenta las entradas del inventario y genera el código QR",
          },
          {
            id: "f2e1-d1",
            tipo: "distractor",
            texto:
              'La orquesta en vivo comienza a interpretar el tema "Cali Pachanguero"',
          },
          {
            id: "f2e1-d2",
            tipo: "distractor",
            texto:
              "El usuario descarga la lista de reproducción oficial del evento en Spotify",
          },
          {
            id: "f2e1-d3",
            tipo: "distractor",
            texto:
              "El organizador del evento habilita el ingreso de comida y bebidas al coliseo",
          },
          {
            id: "f2e1-d4",
            tipo: "distractor",
            texto:
              "El banco rechaza la tarjeta por saldo insuficiente y bloquea la cuenta del usuario",
          },
        ],
      },
      {
        nombre: "Redención de Cupón Promocional",
        scenario: "Aplicación de código de descuento instituido por la Alcaldía",
        bloques: [
          {
            id: "f2e2-given",
            tipo: "given",
            texto:
              "El comprador se encuentra en la pantalla de resumen de pago con 2 boletas en su carrito",
          },
          {
            id: "f2e2-when",
            tipo: "when",
            texto:
              'Ingresa el código promocional "FERIADECALI" y presiona el botón "Aplicar"',
          },
          {
            id: "f2e2-then",
            tipo: "then",
            texto:
              "El sistema descuenta el 20% del total a pagar, actualiza el monto y muestra el desglose del ahorro",
          },
          {
            id: "f2e2-d1",
            tipo: "distractor",
            texto:
              "La pasarela de pago duplica el valor del pedido por cobro de comisiones bancarias",
          },
          {
            id: "f2e2-d2",
            tipo: "distractor",
            texto:
              "El usuario se registra como participante en la maratón de salsa de la ciudad",
          },
          {
            id: "f2e2-d3",
            tipo: "distractor",
            texto:
              "El sistema envía una alerta SMS al organizador notificando la compra",
          },
          {
            id: "f2e2-d4",
            tipo: "distractor",
            texto:
              "El cupón expira y el carrito de compras elimina las boletas seleccionadas",
          },
        ],
      },
    ],
  },
  {
    nombre: "Calificación de Jurados",
    ejercicios: [
      {
        nombre: "Calificación de Jurados",
        scenario: "Registro del puntaje en el criterio de Ritmo y Sabor",
        bloques: [
          {
            id: "f3e1-given",
            tipo: "given",
            texto:
              "El jurado oficial tiene la sesión activa en la tablet de juzgamiento del evento",
          },
          {
            id: "f3e1-when",
            tipo: "when",
            texto:
              'Ingresa una calificación de "9.8" en la casilla de Ritmo y presiona "Guardar Puntaje"',
          },
          {
            id: "f3e1-then",
            tipo: "then",
            texto:
              "El sistema calcula el promedio de la pareja, bloquea la celda y actualiza la tabla de posiciones",
          },
          {
            id: "f3e1-d1",
            tipo: "distractor",
            texto:
              "El público asistente en el coliseo empieza a ovacionar a la delegación internacional",
          },
          {
            id: "f3e1-d2",
            tipo: "distractor",
            texto:
              "La pareja realiza un cambio de vestuario de emergencia antes de salir a la pista",
          },
          {
            id: "f3e1-d3",
            tipo: "distractor",
            texto:
              "El presentador del evento anuncia a los patrocinadores oficiales por el micrófono",
          },
          {
            id: "f3e1-d4",
            tipo: "distractor",
            texto:
              "El sistema imprime un certificado en papel firmado por el alcalde de Cali",
          },
        ],
      },
      {
        nombre: "Impugnación y Recalificación",
        scenario: "Modificación justificada de puntaje por penalización técnica",
        bloques: [
          {
            id: "f3e2-given",
            tipo: "given",
            texto:
              "El juez principal ha abierto la solicitud de revisión técnica sobre una rutina finalizada",
          },
          {
            id: "f3e2-when",
            tipo: "when",
            texto:
              "Registra la deducción de 0.5 puntos por caída de accesorio y confirma con su clave de juez",
          },
          {
            id: "f3e2-then",
            tipo: "then",
            texto:
              "El sistema recalcula la nota final, registra el motivo en la bitácora de auditoría y notifica a la mesa central",
          },
          {
            id: "f3e2-d1",
            tipo: "distractor",
            texto:
              "La transmisión de televisión interrumpe la señal para emitir comerciales",
          },
          {
            id: "f3e2-d2",
            tipo: "distractor",
            texto:
              "El público vota a través de redes sociales para anular la decisión del juez",
          },
          {
            id: "f3e2-d3",
            tipo: "distractor",
            texto:
              "El sistema deshabilita la conexión Wi-Fi de todas las tablets de juzgamiento",
          },
          {
            id: "f3e2-d4",
            tipo: "distractor",
            texto:
              "Los participantes solicitan repetir la rutina desde el inicio del tema musical",
          },
        ],
      },
    ],
  },
];

const COLORES_CONFETI = [
  "#F53E3E",
  "#FB8F3C",
  "#FBC02D",
  "#43A047",
  "#1E88E5",
  "#6A1B9A",
  "#D81B60",
];

function barajar<T>(items: T[]): T[] {
  const copia = [...items];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/* ------------------------------------------------------------------ */
/* Retroalimentación                                                   */
/* ------------------------------------------------------------------ */

type TipoZona = Exclude<TipoBloque, "distractor">;

/** Cómo se llama cada parte del requerimiento, en palabras sencillas. */
const NOMBRE_PARTE: Record<TipoZona, string> = {
  given: "la condición inicial (Dado que…)",
  when: "la acción de la persona (Cuando…)",
  then: "la respuesta del sistema (Entonces…)",
};

/** Qué describe una tarjeta de cada tipo. */
const QUE_DESCRIBE: Record<TipoZona, string> = {
  given: "describe cómo están las cosas antes de empezar",
  when: "es lo que hace la persona en la app",
  then: "es lo que el sistema responde o hace después",
};

const PISTA =
  "Lee cada tarjeta y pregúntate: ¿describe cómo están las cosas antes de empezar (Dado que), lo que hace la persona (Cuando) o lo que responde el sistema (Entonces)? Si cuenta algo que pasa en el evento pero no tiene que ver con usar la app, es un distractor y se queda en el banco.";

interface ResultadoZona {
  ok: boolean;
  mensaje: string;
}

function revisarZona(indice: number, bloque: Bloque | null): ResultadoZona {
  const esperado = ZONAS[indice].tipo as TipoZona;

  if (!bloque) {
    return {
      ok: false,
      mensaje: `Falta una tarjeta: aquí va ${NOMBRE_PARTE[esperado]}.`,
    };
  }
  if (bloque.tipo === esperado) {
    return {
      ok: true,
      mensaje: `¡Bien! Esta tarjeta ${QUE_DESCRIBE[esperado]}.`,
    };
  }
  if (bloque.tipo === "distractor") {
    return {
      ok: false,
      mensaje:
        "Esta tarjeta es un distractor: cuenta algo que pasa en el evento, pero no es algo que la persona haga en la app ni algo que el sistema responda. Devuélvela al banco.",
    };
  }
  const destino = ZONAS.findIndex((z) => z.tipo === bloque.tipo) + 1;
  return {
    ok: false,
    mensaje: `Casi: esta tarjeta sí hace parte del requerimiento, pero ${QUE_DESCRIBE[bloque.tipo]}. Muévela a la zona ${destino}: ${NOMBRE_PARTE[bloque.tipo]}.`,
  };
}

/** "El usuario está…" -> "el usuario está…" para armar la frase completa. */
function enMinuscula(texto: string): string {
  return texto.charAt(0).toLowerCase() + texto.slice(1);
}

export default function AnalistaSalsaChallenge() {
  const router = useRouter();
  const [pantalla, setPantalla] = useState<"intro" | "desafio">("intro");
  const [flujoIndex, setFlujoIndex] = useState(0);
  const [ejercicioIndex, setEjercicioIndex] = useState(0);
  const [banco, setBanco] = useState<string[]>([]);
  const [zonas, setZonas] = useState<(string | null)[]>([null, null, null]);
  const [estado, setEstado] = useState<"idle" | "correcto" | "incorrecto">(
    "idle",
  );
  const [revision, setRevision] = useState<(ResultadoZona | null)[]>([null, null, null]);
  const [intento, setIntento] = useState(0);
  const [pistaVisible, setPistaVisible] = useState(false);

  function prepararEjercicio(indiceFlujo: number, indiceEjercicio: number) {
    setBanco(
      barajar(
        FLUJOS[indiceFlujo].ejercicios[indiceEjercicio].bloques.map((bloque) => bloque.id),
      ),
    );
    setZonas([null, null, null]);
    setEstado("idle");
    setRevision([null, null, null]);
    setIntento(0);
    setPistaVisible(false);
  }

  function handleComenzar() {
    const indiceFlujo = Math.floor(Math.random() * FLUJOS.length);
    setFlujoIndex(indiceFlujo);
    setEjercicioIndex(0);
    prepararEjercicio(indiceFlujo, 0);
    setPantalla("desafio");
  }

  if (pantalla === "intro") {
    return <PantallaIntro onComenzar={handleComenzar} />;
  }

  const flujo = FLUJOS[flujoIndex];
  const feature = flujo.ejercicios[ejercicioIndex];
  const bloquesEnBanco = banco.filter((id) => !zonas.includes(id));
  const zonaBloqueada = (indice: number) => revision[indice]?.ok === true;
  const correctas = revision.filter((r) => r?.ok).length;

  function encontrarBloque(id: string) {
    return feature.bloques.find((bloque) => bloque.id === id) ?? null;
  }

  /** Borra la revisión solo de las zonas que cambiaron. */
  function limpiarRevision(indices: number[]) {
    setRevision((actual) => actual.map((r, i) => (indices.includes(i) ? null : r)));
    setEstado("idle");
  }

  function soltarEnZona(indice: number, id: string) {
    if (!id || estado === "correcto" || zonaBloqueada(indice)) return;
    const otraZona = zonas.indexOf(id);
    if (otraZona !== -1 && zonaBloqueada(otraZona)) return;

    setZonas((actual) => {
      const siguiente = [...actual];
      if (otraZona !== -1 && otraZona !== indice) {
        siguiente[otraZona] = null;
      }
      siguiente[indice] = id;
      return siguiente;
    });
    limpiarRevision(otraZona === -1 ? [indice] : [indice, otraZona]);
  }

  function devolverAlBanco(id: string) {
    const indice = zonas.indexOf(id);
    if (indice === -1 || zonaBloqueada(indice)) return;
    setZonas((actual) => actual.map((zona) => (zona === id ? null : zona)));
    limpiarRevision([indice]);
  }

  function handleDropZona(indice: number, event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    soltarEnZona(indice, id);
  }

  function handleDropBanco(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (zonas.includes(id)) {
      devolverAlBanco(id);
    }
  }

  function handleValidar() {
    const resultados = zonas.map((id, indice) =>
      revisarZona(indice, id ? encontrarBloque(id) : null),
    );
    setRevision(resultados);

    if (resultados.every((r) => r.ok)) {
      setEstado("correcto");
      if (ejercicioIndex === 1) {
        completeStage(1);
      }
      return;
    }
    setEstado("incorrecto");
    setIntento((actual) => actual + 1);
  }

  function handleAvanzarEjercicio() {
    setEjercicioIndex(1);
    prepararEjercicio(flujoIndex, 1);
  }

  const bloquesFinales = zonas.map((id) => (id ? encontrarBloque(id) : null));
  const historia =
    estado === "correcto" && bloquesFinales.every(Boolean)
      ? `Dado que ${enMinuscula(bloquesFinales[0]!.texto)}, cuando ${enMinuscula(bloquesFinales[1]!.texto)}, entonces ${enMinuscula(bloquesFinales[2]!.texto)}.`
      : null;

  return (
    <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
      <section className="space-y-6">
        <div className="rounded-3xl border-2 border-brand-soft bg-brand-light/30 p-6 text-center">
          <span className="etiqueta">
            Ejercicio{" "}
            {ejercicioIndex + 1} de 2
          </span>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-brand-support sm:text-3xl">
            {flujo.nombre}
          </h2>
          <p className="mt-2 text-sm text-brand-support/80">
            Escenario: <strong>{feature.scenario}</strong>
          </p>
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl shadow-brand-primary/20 backdrop-blur-md sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide text-brand-support">
              Banco de tarjetas
            </h3>
            <span className="text-xs text-brand-support/60">
              Arrastra las 3 correctas a su zona
            </span>
          </div>

          <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDropBanco}
            className="flex min-h-32 flex-col gap-3 rounded-2xl border-2 border-dashed border-brand-soft bg-white/60 p-4"
          >
            {bloquesEnBanco.length === 0 && (
              <p className="m-auto text-center text-sm text-brand-support/50">
                Todas las tarjetas están colocadas
              </p>
            )}
            {bloquesEnBanco.map((id) => (
              <TarjetaArrastrable
                key={id}
                id={id}
                texto={encontrarBloque(id)?.texto ?? ""}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-brand-support/70">
            Hay 4 tarjetas que no hacen parte del requerimiento: son distractores
            y deben quedarse en el banco.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl shadow-brand-primary/20 backdrop-blur-md sm:p-8">
        <div className="mb-6 text-center">
          <h2 className="mt-4 text-2xl font-black tracking-tight text-brand-support sm:text-3xl">
            Organiza el requerimiento
          </h2>
          <p className="mt-2 text-sm text-brand-support/80">
            Selecciona las 3 tarjetas correctas y ordénalas en formato
            Given-When-Then para el equipo de desarrollo.
          </p>
        </div>

        <div className="space-y-4">
          {ZONAS.map((zona, indice) => {
            const id = zonas[indice];
            const bloque = id ? encontrarBloque(id) : null;
            const resultado = revision[indice];
            const invalida = resultado?.ok === false;
            const bien = resultado?.ok === true;

            return (
              <motion.div
                key={`${indice}-${invalida ? intento : "estable"}`}
                animate={
                  invalida
                    ? { x: [0, -12, 12, -12, 12, -8, 8, 0] }
                    : undefined
                }
                transition={{ duration: 0.55 }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDropZona(indice, event)}
                className={`rounded-2xl border-2 p-5 text-left transition-colors ${
                  invalida
                    ? "border-dashed border-red-400 bg-red-50"
                    : bien
                      ? "border-solid border-emerald-400 bg-emerald-50"
                      : bloque
                        ? "border-dashed border-brand-mid bg-brand-soft/10"
                        : "border-dashed border-brand-soft bg-white/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`rounded-sm px-3 py-1 font-mono text-xs font-black uppercase tracking-widest ${
                      zona.tipo === "given"
                        ? "bg-brand-soft text-white"
                        : zona.tipo === "when"
                          ? "bg-brand-primary text-white"
                          : "bg-brand-mid text-brand-support"
                    }`}
                  >
                    {zona.etiqueta}
                  </span>
                  {bien ? (
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-sm font-black text-white" aria-label="Zona correcta">
                      ✓
                    </span>
                  ) : (
                    bloque && (
                      <button
                        type="button"
                        onClick={() => devolverAlBanco(bloque.id)}
                        aria-label={`Devolver "${bloque.texto}" al banco`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-brand-soft text-brand-support transition hover:border-red-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    )
                  )}
                </div>

                <div className="mt-3">
                  {bloque ? (
                    <TarjetaArrastrable
                      id={bloque.id}
                      texto={bloque.texto}
                      invalida={invalida}
                      correcta={bien}
                    />
                  ) : (
                    <p className="rounded-xl border-2 border-dashed border-brand-soft/60 bg-white/40 px-4 py-3 text-center text-sm text-brand-support/40">
                      Suelta aquí la tarjeta correcta
                    </p>
                  )}
                </div>

                {resultado && (
                  <p
                    className={`mt-3 flex gap-2 text-sm leading-snug ${
                      resultado.ok ? "text-emerald-700" : "font-medium text-red-600"
                    }`}
                  >
                    <span aria-hidden="true">{resultado.ok ? "✓" : "✗"}</span>
                    <span>{resultado.mensaje}</span>
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        {estado !== "correcto" && (
          <div className="mt-6 space-y-4">
            {pistaVisible && (
              <div className="animate-fade-in rounded-xl border border-brand-mid/50 bg-brand-soft/10 p-3 text-sm leading-relaxed text-brand-support">
                <strong>💡 Pista:</strong> {PISTA}
              </div>
            )}

            {estado === "incorrecto" && (
              <p className="animate-fade-in rounded-xl border border-amber-300 bg-amber-50 p-3 text-center text-sm font-semibold text-amber-800">
                {correctas > 0
                  ? `⚠️ Vas bien: ${correctas} de 3 zonas están correctas. Lee la explicación en rojo de cada zona y corrígela.`
                  : "⚠️ Todavía no hay zonas correctas. Lee la explicación en rojo de cada zona y vuelve a intentarlo."}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              {!pistaVisible && (
                <button
                  type="button"
                  onClick={() => setPistaVisible(true)}
                  className="rounded-full border-2 border-brand-soft px-6 py-3 text-sm font-bold text-brand-support transition-all hover:border-brand-support"
                >
                  💡 Pedir pista
                </button>
              )}
              <button
                type="button"
                onClick={handleValidar}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-brand-primary/30 transition-all duration-300 hover:bg-brand-support"
              >
                Validar Requerimiento
              </button>
            </div>
          </div>
        )}

        {estado === "correcto" && (
          <div className="relative mt-6">
            <Confetti />
            <div className="animate-fade-in rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-6 text-center">
              <p className="text-3xl">🎺🎉</p>
              <p className="mt-3 text-lg font-bold text-emerald-700">
                ¡Requerimiento listo! Separaste los distractores y pusiste cada
                parte en su lugar.
              </p>

              {historia && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-white p-4 text-left">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                    Así queda la historia de usuario completa
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-support">
                    {historia}
                  </p>
                </div>
              )}

              <p className="mt-4 text-sm leading-relaxed text-brand-support/90">
                {ejercicioIndex === 0
                  ? "Con esta frase, el equipo de desarrollo sabe en qué situación ocurre, qué hace la persona y qué debe responder la app. ¡Vamos con el segundo caso!"
                  : "¡Completaste los 2 ejercicios! Así trabaja un analista: convierte lo que la gente necesita en requerimientos claros que todo el equipo entiende igual."}
              </p>

              {ejercicioIndex === 0 ? (
                <button
                  type="button"
                  onClick={handleAvanzarEjercicio}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-brand-primary/30 transition-all duration-300 hover:bg-brand-support"
                >
                  Avanzar al Ejercicio 2 de {flujo.nombre}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => continuarConCierre("analista", router.push)}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-brand-primary/30 transition-all duration-300 hover:bg-brand-support"
                >
                  Completar Módulo de Análisis
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function PantallaIntro({ onComenzar }: { onComenzar: () => void }) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl shadow-brand-primary/20 backdrop-blur-md sm:p-10">
        <div className="text-center">
          <h2 className="mt-4 text-2xl font-black tracking-tight text-brand-support sm:text-3xl">
            Estructura una historia de usuario en formato BDD
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-support/80">
            Antes de iniciar el reto, repasa cómo se organiza un requerimiento
            con la sintaxis Gherkin (Given-When-Then). Luego deberás filtrar los
            distractores y colocar las tarjetas correctas en su zona.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-brand-soft">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-brand-soft bg-brand-light/40 text-xs font-bold uppercase tracking-wide text-brand-support">
                <th className="px-4 py-3">Palabra Clave</th>
                <th className="px-4 py-3">Significado</th>
                <th className="px-4 py-3">Ejemplo Contextual</th>
              </tr>
            </thead>
            <tbody>
              {TABLA_GHERKIN.map((fila) => (
                <tr
                  key={fila.palabra}
                  className="border-b border-brand-soft/40 text-brand-support last:border-0"
                >
                  <td className="px-4 py-3 font-black text-brand-primary">
                    {fila.palabra}
                  </td>
                  <td className="px-4 py-3">{fila.significado}</td>
                  <td className="px-4 py-3">{fila.ejemplo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={onComenzar}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-10 py-4 text-lg font-bold text-white shadow-xl shadow-brand-primary/30 transition-all duration-300 hover:bg-brand-support"
        >
          Comenzar Reto de Análisis
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function TarjetaArrastrable({
  id,
  texto,
  invalida = false,
  correcta = false,
}: {
  id: string;
  texto: string;
  invalida?: boolean;
  /** Tarjeta ya validada: queda fija en su zona. */
  correcta?: boolean;
}) {
  function handleDragStart(event: DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
  }

  return (
    <div
      draggable={!correcta}
      onDragStart={handleDragStart}
      className={`flex items-start gap-3 rounded-xl border-2 bg-white p-3 text-left shadow-sm transition ${
        correcta
          ? "cursor-default border-emerald-400"
          : invalida
            ? "cursor-grab border-red-400 ring-2 ring-red-300 active:cursor-grabbing hover:-translate-y-0.5"
            : "cursor-grab border-brand-soft active:cursor-grabbing hover:-translate-y-0.5"
      }`}
    >
      <p className="text-sm font-medium leading-snug text-brand-support">
        {texto}
      </p>
    </div>
  );
}

function Confetti() {
  const piezas = Array.from({ length: 80 }, (_, index) => ({
    id: index,
    color: COLORES_CONFETI[index % COLORES_CONFETI.length],
    x: `${(index % 10) * 11}%`,
    delay: (index % 12) * 0.06,
    rotation: (index % 7) * 90,
  }));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-2xl"
    >
      {piezas.map((pieza) => (
        <motion.div
          key={pieza.id}
          initial={{ y: -16, opacity: 1 }}
          animate={{ y: "110vh", opacity: 0, rotate: pieza.rotation }}
          transition={{ duration: 2.4, delay: pieza.delay, ease: "easeIn" }}
          className="absolute h-3 w-2 rounded-sm"
          style={{
            left: pieza.x,
            backgroundColor: pieza.color,
          }}
        />
      ))}
    </div>
  );
}