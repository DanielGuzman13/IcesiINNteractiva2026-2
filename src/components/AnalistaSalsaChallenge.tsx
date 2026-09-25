"use client";

import Link from "next/link";
import { useState, type DragEvent } from "react";
import { motion } from "framer-motion";

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

const FEATURES: Feature[] = [
  {
    nombre: "Votación del Público",
    scenario: "Registrar el voto del público durante una presentación",
    bloques: [
      {
        id: "f1-given",
        tipo: "given",
        texto:
          "El espectador tiene la app oficial abierta y la pareja de baile está ejecutando su rutina en la pista",
      },
      {
        id: "f1-when",
        tipo: "when",
        texto:
          'El espectador presiona el botón "Votar por esta Pareja" y selecciona un puntaje de 10',
      },
      {
        id: "f1-then",
        tipo: "then",
        texto:
          'El sistema suma el voto al promedio en tiempo real y muestra la confirmación "¡Voto registrado!"',
      },
      {
        id: "f1-d1",
        tipo: "distractor",
        texto:
          "El jurado internacional califica el vestuario y la coordinación de la escuela de baile",
      },
      {
        id: "f1-d2",
        tipo: "distractor",
        texto:
          "El servidor web reinicia la transmisión en vivo por saturación de usuarios",
      },
      {
        id: "f1-d3",
        tipo: "distractor",
        texto:
          'El bailarín principal se resbala durante la ejecución del paso caleño "El Repique"',
      },
      {
        id: "f1-d4",
        tipo: "distractor",
        texto:
          "La app envía un correo promocional con descuento para la tienda oficial de salsa",
      },
    ],
  },
  {
    nombre: "Boletería Digital",
    scenario: "Compra exitosa de entradas en categoría Ensambles",
    bloques: [
      {
        id: "f2-given",
        tipo: "given",
        texto:
          "El usuario está autenticado en la plataforma y existen entradas disponibles en Zona VIP",
      },
      {
        id: "f2-when",
        tipo: "when",
        texto:
          "Selecciona 2 boletas y completa la transacción ingresando los datos de pago",
      },
      {
        id: "f2-then",
        tipo: "then",
        texto:
          "El sistema reserva los asientos, descuenta las entradas del inventario y genera el código QR",
      },
      {
        id: "f2-d1",
        tipo: "distractor",
        texto:
          'La orquesta en vivo comienza a interpretar el tema "Cali Pachanguero"',
      },
      {
        id: "f2-d2",
        tipo: "distractor",
        texto:
          "El usuario descarga la lista de reproducción oficial del evento en Spotify",
      },
      {
        id: "f2-d3",
        tipo: "distractor",
        texto:
          "El organizador del evento habilita el ingreso de comida y bebidas al coliseo",
      },
      {
        id: "f2-d4",
        tipo: "distractor",
        texto:
          "El banco rechaza la tarjeta por saldo insuficiente y bloquea la cuenta del usuario",
      },
    ],
  },
  {
    nombre: "Calificación de Jurados",
    scenario: "Registro del puntaje en el criterio de Ritmo y Cadencia",
    bloques: [
      {
        id: "f3-given",
        tipo: "given",
        texto:
          "El jurado oficial tiene la sesión activa en la tablet de juzgamiento del evento",
      },
      {
        id: "f3-when",
        tipo: "when",
        texto:
          'Ingresa una calificación de "9.8" en la casilla de Ritmo y presiona "Guardar Puntaje"',
      },
      {
        id: "f3-then",
        tipo: "then",
        texto:
          "El sistema calcula el promedio de la pareja, bloquea la celda y actualiza la tabla de posiciones",
      },
      {
        id: "f3-d1",
        tipo: "distractor",
        texto:
          "El público asistente en el coliseo empieza a ovacionar a la delegación internacional",
      },
      {
        id: "f3-d2",
        tipo: "distractor",
        texto:
          "La pareja realiza un cambio de vestuario de emergencia antes de salir a la pista",
      },
      {
        id: "f3-d3",
        tipo: "distractor",
        texto:
          "El presentador del evento anuncia a los patrocinadores oficiales por el micrófono",
      },
      {
        id: "f3-d4",
        tipo: "distractor",
        texto:
          "El sistema imprime un certificado en papel firmado por el alcalde de Cali",
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

export default function AnalistaSalsaChallenge() {
  const [pantalla, setPantalla] = useState<"intro" | "desafio">("intro");
  const [featureIndex, setFeatureIndex] = useState(0);
  const [banco, setBanco] = useState<string[]>([]);
  const [zonas, setZonas] = useState<(string | null)[]>([null, null, null]);
  const [estado, setEstado] = useState<"idle" | "correcto" | "incorrecto">(
    "idle",
  );
  const [zonasInvalidas, setZonasInvalidas] = useState<number[]>([]);
  const [intento, setIntento] = useState(0);

  function handleComenzar() {
    const indice = Math.floor(Math.random() * FEATURES.length);
    setFeatureIndex(indice);
    setBanco(barajar(FEATURES[indice].bloques.map((bloque) => bloque.id)));
    setZonas([null, null, null]);
    setEstado("idle");
    setZonasInvalidas([]);
    setIntento(0);
    setPantalla("desafio");
  }

  if (pantalla === "intro") {
    return <PantallaIntro onComenzar={handleComenzar} />;
  }

  const feature = FEATURES[featureIndex];
  const bloquesEnBanco = banco.filter((id) => !zonas.includes(id));

  function encontrarBloque(id: string) {
    return feature.bloques.find((bloque) => bloque.id === id) ?? null;
  }

  function soltarEnZona(indice: number, id: string) {
    if (!id) return;
    setZonas((actual) => {
      const siguiente = [...actual];
      const otraZona = siguiente.indexOf(id);
      if (otraZona !== -1 && otraZona !== indice) {
        siguiente[otraZona] = null;
      }
      siguiente[indice] = id;
      return siguiente;
    });
    setEstado("idle");
    setZonasInvalidas([]);
  }

  function devolverAlBanco(id: string) {
    setZonas((actual) => actual.map((zona) => (zona === id ? null : zona)));
    setEstado("idle");
    setZonasInvalidas([]);
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
    const invalidas: number[] = [];
    zonas.forEach((id, indice) => {
      const bloque = encontrarBloque(id ?? "");
      if (!bloque || bloque.tipo !== ZONAS[indice].tipo) {
        invalidas.push(indice);
      }
    });

    if (invalidas.length === 0) {
      setEstado("correcto");
      setZonasInvalidas([]);
      return;
    }
    setEstado("incorrecto");
    setZonasInvalidas(invalidas);
    setIntento((actual) => actual + 1);
  }

  return (
    <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
      <section className="space-y-6">
        <div className="rounded-3xl border-2 border-brand-soft bg-brand-light/30 p-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-support">
            Analista de Requerimientos · Mundial de Salsa
          </span>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-brand-support sm:text-3xl">
            {feature.nombre}
          </h2>
          <p className="mt-2 text-sm text-brand-support/80">
            Scenario: <strong>{feature.scenario}</strong>
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
        </div>
      </section>

      <section className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl shadow-brand-primary/20 backdrop-blur-md sm:p-8">
        <div className="mb-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-support">
            Estructura BDD
          </span>
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
            const invalida = estado === "incorrecto" && zonasInvalidas.includes(indice);

            return (
              <motion.div
                key={`${intento}-${indice}-${bloque?.id ?? "vacia"}`}
                animate={
                  invalida
                    ? { x: [0, -12, 12, -12, 12, -8, 8, 0] }
                    : undefined
                }
                transition={{ duration: 0.55 }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDropZona(indice, event)}
                className={`rounded-2xl border-2 border-dashed p-5 text-left transition-colors ${
                  invalida
                    ? "border-red-400 bg-red-50"
                    : bloque
                      ? "border-brand-mid bg-brand-soft/10"
                      : "border-brand-soft bg-white/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest ${
                      zona.tipo === "given"
                        ? "bg-amber-500 text-white"
                        : zona.tipo === "when"
                          ? "bg-pink-500 text-white"
                          : "bg-emerald-600 text-white"
                    }`}
                  >
                    {zona.etiqueta}
                  </span>
                  {bloque && (
                    <button
                      type="button"
                      onClick={() => devolverAlBanco(bloque.id)}
                      aria-label={`Devolver "${bloque.texto}" al banco`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-brand-soft text-brand-support transition hover:border-red-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="mt-3">
                  {bloque ? (
                    <TarjetaArrastrable
                      id={bloque.id}
                      texto={bloque.texto}
                      invalida={invalida}
                    />
                  ) : (
                    <p className="rounded-xl border-2 border-dashed border-brand-soft/60 bg-white/40 px-4 py-3 text-center text-sm text-brand-support/40">
                      Suelta aquí la tarjeta correcta
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {estado !== "correcto" && (
          <button
            type="button"
            onClick={handleValidar}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-brand-primary/30 transition-all duration-300 hover:bg-brand-mid"
          >
            Validar Requerimiento
          </button>
        )}

        {estado === "incorrecto" && (
          <p className="mt-5 animate-fade-in rounded-xl border border-amber-300 bg-amber-50 p-3 text-center text-sm font-semibold text-amber-800">
            ⚠️ Requerimiento no válido. Asegúrate de identificar el contexto
            inicial, la acción y el resultado del sistema entre las opciones.
          </p>
        )}

        {estado === "correcto" && (
          <div className="relative mt-6">
            <Confetti />
            <div className="animate-fade-in rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-6 text-center">
              <p className="text-3xl">🎺🎉</p>
              <p className="mt-3 text-lg font-bold text-emerald-700">
                ¡Excelente trabajo de Análisis! Has filtrado los distractores y
                estructurado el requerimiento correctamente.
              </p>
              <Link
                href="/retos"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-brand-primary/30 transition-all duration-300 hover:bg-brand-mid"
              >
                Avanzar a la Siguiente Actividad
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
              </Link>
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
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-support">
            Analista de Requerimientos · Mundial de Salsa
          </span>
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
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-10 py-4 text-lg font-bold text-white shadow-xl shadow-brand-primary/30 transition-all duration-300 hover:bg-brand-mid"
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
}: {
  id: string;
  texto: string;
  invalida?: boolean;
}) {
  function handleDragStart(event: DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`flex cursor-grab items-start gap-3 rounded-xl border-2 border-brand-soft bg-white p-3 text-left shadow-sm transition active:cursor-grabbing hover:-translate-y-0.5 ${
        invalida ? "border-red-400 ring-2 ring-red-300" : ""
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