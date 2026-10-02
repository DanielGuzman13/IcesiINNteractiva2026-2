"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type DragEvent } from "react";
import { motion } from "framer-motion";
import { completeStage } from "@/lib/ruta-progress";
import { continuarConCierre } from "@/lib/personajes";

type TipoParteHU = "como" | "quiero" | "para";
type TipoParteBDD = "dado" | "cuando" | "entonces";
type TipoParte = TipoParteHU | TipoParteBDD;
type TipoBloque = TipoParte | "distractor";

interface Bloque {
  id: string;
  tipo: TipoBloque;
  texto: string;
}

/** Una de las tres partes en las que se descompone un paso del reto. */
interface Parte {
  tipo: TipoParte;
  etiqueta: string;
  /** Nombre corto de la parte, para textos breves. */
  corto: string;
  /** Cómo se llama esa parte, para los mensajes de retroalimentación. */
  resumen: string;
  /** Qué información guarda esa parte. */
  describe: string;
  /** Clases del badge de la zona. */
  color: string;
}

interface Historia {
  rotulo: string;
  titulo: string;
  modo: "hu" | "bdd";
  partes: Parte[];
  bloques: Bloque[];
}

interface Flujo {
  nombre: string;
  pasos: Historia[];
}

const PARTES_HU: Parte[] = [
  {
    tipo: "como",
    etiqueta: "1. COMO — ¿Quién es la persona?",
    corto: "Como",
    resumen: "quién es la persona que vive el problema",
    describe: "dice quién es la persona que usa la app",
    color: "bg-brand-soft text-white",
  },
  {
    tipo: "quiero",
    etiqueta: "2. QUIERO — ¿Qué quiere hacer?",
    corto: "Quiero",
    resumen: "la acción que la persona quiere poder hacer",
    describe: "dice qué quiere hacer la persona",
    color: "bg-brand-primary text-white",
  },
  {
    tipo: "para",
    etiqueta: "3. PARA — ¿Para qué le sirve?",
    corto: "Para",
    resumen: "el beneficio que la persona busca",
    describe: "dice para qué le sirve a la persona",
    color: "bg-brand-mid text-brand-support",
  },
];

const PARTES_BDD: Parte[] = [
  {
    tipo: "dado",
    etiqueta: "1. DADO QUE — ¿En qué situación?",
    corto: "Dado que",
    resumen: "la condición inicial (Dado que…)",
    describe: "describe cómo están las cosas antes de empezar",
    color: "bg-brand-soft text-white",
  },
  {
    tipo: "cuando",
    etiqueta: "2. CUANDO — ¿Qué hace la persona?",
    corto: "Cuando",
    resumen: "la acción de la persona (Cuando…)",
    describe: "describe lo que hace la persona en la app",
    color: "bg-brand-primary text-white",
  },
  {
    tipo: "entonces",
    etiqueta: "3. ENTONCES — ¿Qué responde el sistema?",
    corto: "Entonces",
    resumen: "la respuesta del sistema (Entonces…)",
    describe: "describe lo que responde el sistema",
    color: "bg-brand-mid text-brand-support",
  },
];

const TABLA_HU: { palabra: string; pregunta: string; ejemplo: string }[] = [
  {
    palabra: "COMO",
    pregunta: "¿Quién es la persona que necesita la solución?",
    ejemplo: "Como espectador del Mundial de Salsa",
  },
  {
    palabra: "QUIERO",
    pregunta: "¿Qué quiere hacer?",
    ejemplo: "Quiero emitir mi voto desde la app oficial",
  },
  {
    palabra: "PARA",
    pregunta: "¿Para qué le sirve?",
    ejemplo: "Para apoyar a mis artistas favoritos",
  },
];

const TABLA_BDD: { palabra: string; pregunta: string; ejemplo: string }[] = [
  {
    palabra: "DADO QUE",
    pregunta: "¿En qué situación está el mundo?",
    ejemplo: "Dado que el espectador tiene la app abierta",
  },
  {
    palabra: "CUANDO",
    pregunta: "¿Qué hace la persona?",
    ejemplo: "Cuando presiona “Votar por esta Pareja”",
  },
  {
    palabra: "ENTONCES",
    pregunta: "¿Qué debe responder el sistema?",
    ejemplo: "Entonces el sistema suma el voto y confirma",
  },
];

const FLUJOS: Flujo[] = [
  {
    nombre: "Votación del Público",
    pasos: [
      {
        rotulo: "Historia de usuario 1.1",
        titulo: "Votación del público",
        modo: "hu",
        partes: PARTES_HU,
        bloques: [
          {
            id: "f1h1-como",
            tipo: "como",
            texto:
              "Como espectador del Mundial de Salsa en el Coliseo El Pueblo",
          },
          {
            id: "f1h1-quiero",
            tipo: "quiero",
            texto:
              "Quiero emitir mi voto desde la app oficial por la pareja que está en la pista",
          },
          {
            id: "f1h1-para",
            tipo: "para",
            texto:
              "Para apoyar a mis artistas favoritos y reflejar el favoritismo del público",
          },
          {
            id: "f1h1-d1",
            tipo: "distractor",
            texto:
              "La orquesta en vivo empieza a interpretar “Cali Pachanguero” frente al Coliseo",
          },
          {
            id: "f1h1-d2",
            tipo: "distractor",
            texto:
              "El bailarín principal se resbala durante la ejecución del paso caleño “El Repique”",
          },
          {
            id: "f1h1-d3",
            tipo: "distractor",
            texto:
              "El presentador del evento anuncia a los patrocinadores oficiales por el micrófono",
          },
          {
            id: "f1h1-d4",
            tipo: "distractor",
            texto:
              "El servidor web reinicia la transmisión en vivo por saturación de usuarios",
          },
        ],
      },
      {
        rotulo: "Criterio de aceptación 1.1",
        titulo: "Votación del público",
        modo: "bdd",
        partes: PARTES_BDD,
        bloques: [
          {
            id: "f1b1-dado",
            tipo: "dado",
            texto:
              "El espectador tiene la app oficial abierta y la pareja de baile está ejecutando su rutina en la pista",
          },
          {
            id: "f1b1-cuando",
            tipo: "cuando",
            texto:
              'El espectador presiona el botón "Votar por esta Pareja" y selecciona un puntaje de 10',
          },
          {
            id: "f1b1-entonces",
            tipo: "entonces",
            texto:
              'El sistema suma el voto al promedio en tiempo real y muestra la confirmación "¡Voto registrado!"',
          },
          {
            id: "f1b1-x1",
            tipo: "distractor",
            texto:
              "El jurado internacional califica el vestuario y la coordinación de la escuela de baile",
          },
          {
            id: "f1b1-x2",
            tipo: "distractor",
            texto:
              "El servidor web reinicia la transmisión en vivo por saturación de usuarios",
          },
          {
            id: "f1b1-x3",
            tipo: "distractor",
            texto:
              'El bailarín principal se resbala durante la ejecución del paso caleño "El Repique"',
          },
          {
            id: "f1b1-x4",
            tipo: "distractor",
            texto:
              "La app envía un correo promocional con descuento para la tienda oficial de salsa",
          },
        ],
      },
    ],
  },
  {
    nombre: "Boletería Digital",
    pasos: [
      {
        rotulo: "Historia de usuario 2.1",
        titulo: "Compra de entradas VIP",
        modo: "hu",
        partes: PARTES_HU,
        bloques: [
          {
            id: "f2h1-como",
            tipo: "como",
            texto:
              "Como aficionado a la salsa que quiere ver el Mundial desde el Coliseo El Pueblo",
          },
          {
            id: "f2h1-quiero",
            tipo: "quiero",
            texto:
              "Quiero comprar entradas VIP de la categoría Ensambles sin hacer fila en la boletería",
          },
          {
            id: "f2h1-para",
            tipo: "para",
            texto:
              "Para asegurar mi lugar en primera fila y apoyar a las parejas del Mundial",
          },
          {
            id: "f2h1-x1",
            tipo: "distractor",
            texto:
              "Las boleterías físicas del Coliseo El Pueblo abren a las 8 de la mañana y forman una fila larga",
          },
          {
            id: "f2h1-x2",
            tipo: "distractor",
            texto:
              "La orquesta de salsa ensaya en el camerino del Coliseo antes de la apertura",
          },
          {
            id: "f2h1-x3",
            tipo: "distractor",
            texto:
              "Cambian la señalización del Coliseo para indicar dónde está cada zona de boletería",
          },
          {
            id: "f2h1-x4",
            tipo: "distractor",
            texto:
              "El proveedor de la pasarela de pagos actualiza sus tarifas antes del Mundial",
          },
        ],
      },
      {
        rotulo: "Criterio de aceptación 2.1",
        titulo: "Compra de entradas VIP",
        modo: "bdd",
        partes: PARTES_BDD,
        bloques: [
          {
            id: "f2b1-dado",
            tipo: "dado",
            texto:
              "El usuario está autenticado en la plataforma y existen entradas disponibles en Zona VIP",
          },
          {
            id: "f2b1-cuando",
            tipo: "cuando",
            texto:
              "Selecciona 2 boletas y completa la transacción ingresando los datos de pago",
          },
          {
            id: "f2b1-entonces",
            tipo: "entonces",
            texto:
              "El sistema reserva los asientos, descuenta las entradas del inventario y genera el código QR",
          },
          {
            id: "f2b1-x1",
            tipo: "distractor",
            texto:
              'La orquesta en vivo comienza a interpretar el tema "Cali Pachanguero"',
          },
          {
            id: "f2b1-x2",
            tipo: "distractor",
            texto:
              "El usuario descarga la lista de reproducción oficial del evento en Spotify",
          },
          {
            id: "f2b1-x3",
            tipo: "distractor",
            texto:
              "El organizador del evento habilita el ingreso de comida y bebidas al coliseo",
          },
          {
            id: "f2b1-x4",
            tipo: "distractor",
            texto:
              "El banco rechaza la tarjeta por saldo insuficiente y bloquea la cuenta del usuario",
          },
        ],
      },
    ],
  },
  {
    nombre: "Calificación de Jurados",
    pasos: [
      {
        rotulo: "Historia de usuario 3.1",
        titulo: "Registro de calificaciones",
        modo: "hu",
        partes: PARTES_HU,
        bloques: [
          {
            id: "f3h1-como",
            tipo: "como",
            texto: "Como jurado internacional del Mundial de Salsa",
          },
          {
            id: "f3h1-quiero",
            tipo: "quiero",
            texto:
              "Quiero registrar el puntaje de cada pareja en la tablet de juzgamiento",
          },
          {
            id: "f3h1-para",
            tipo: "para",
            texto:
              "Para que la competencia se evalúe con el mismo criterio y la decisión sea transparente",
          },
          {
            id: "f3h1-x1",
            tipo: "distractor",
            texto:
              "Las parejas hacen su entrada a la pista saludando al público del Coliseo",
          },
          {
            id: "f3h1-x2",
            tipo: "distractor",
            texto:
              "El público en las gradas canta la salsa de la delegación invitada",
          },
          {
            id: "f3h1-x3",
            tipo: "distractor",
            texto:
              "La transmisión de televisión interrumpe la señal para emitir comerciales",
          },
          {
            id: "f3h1-x4",
            tipo: "distractor",
            texto:
              "La organización reparte refrigerios y credenciales en la zona de jurados",
          },
        ],
      },
      {
        rotulo: "Criterio de aceptación 3.1",
        titulo: "Registro de calificaciones",
        modo: "bdd",
        partes: PARTES_BDD,
        bloques: [
          {
            id: "f3b1-dado",
            tipo: "dado",
            texto:
              "El jurado oficial tiene la sesión activa en la tablet de juzgamiento del evento",
          },
          {
            id: "f3b1-cuando",
            tipo: "cuando",
            texto:
              'Ingresa una calificación de "9.8" en la casilla de Ritmo y presiona "Guardar Puntaje"',
          },
          {
            id: "f3b1-entonces",
            tipo: "entonces",
            texto:
              "El sistema calcula el promedio de la pareja, bloquea la celda y actualiza la tabla de posiciones",
          },
          {
            id: "f3b1-x1",
            tipo: "distractor",
            texto:
              "El público asistente en el coliseo empieza a ovacionar a la delegación internacional",
          },
          {
            id: "f3b1-x2",
            tipo: "distractor",
            texto:
              "La pareja realiza un cambio de vestuario de emergencia antes de salir a la pista",
          },
          {
            id: "f3b1-x3",
            tipo: "distractor",
            texto:
              "El presentador del evento anuncia a los patrocinadores oficiales por el micrófono",
          },
          {
            id: "f3b1-x4",
            tipo: "distractor",
            texto:
              "El sistema imprime un certificado en papel firmado por el alcalde de Cali",
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

const PISTAS: Record<"hu" | "bdd", string> = {
  hu: "Lee cada tarjeta y pregúntate: ¿dice quién es la persona que usa la app (Como), qué quiere hacer (Quiero) o para qué le sirve (Para)? Si cuenta algo que pasa en el evento, como la orquesta o los patrocinadores, es un distractor y se queda en el banco.",
  bdd: "Lee cada tarjeta y pregúntate: ¿describe cómo están las cosas antes de empezar (Dado que), lo que hace la persona (Cuando) o lo que responde el sistema (Entonces)? Si cuenta algo que pasa en el evento pero no tiene que ver con usar la app, es un distractor y se queda en el banco.",
};

interface ResultadoZona {
  ok: boolean;
  mensaje: string;
}

function revisarZona(
  indice: number,
  bloque: Bloque | null,
  partes: Parte[],
): ResultadoZona {
  const esperada = partes[indice];

  if (!bloque) {
    return {
      ok: false,
      mensaje: `Falta una tarjeta: aquí va ${esperada.resumen}.`,
    };
  }
  if (bloque.tipo === esperada.tipo) {
    return {
      ok: true,
      mensaje: `¡Bien! Esta tarjeta ${esperada.describe}.`,
    };
  }
  if (bloque.tipo === "distractor") {
    return {
      ok: false,
      mensaje:
        "Esta tarjeta es un distractor: cuenta algo que pasa en el evento, pero no es algo que la persona haga en la app ni algo que el sistema responda. Devuélvela al banco.",
    };
  }
  const destino = partes.findIndex((p) => p.tipo === bloque.tipo) + 1;
  const otra = partes.find((p) => p.tipo === bloque.tipo);
  return {
    ok: false,
    mensaje: `Casi: esta tarjeta sí hace parte del requerimiento, pero ${otra?.describe}. Muévela a la zona ${destino}: ${otra?.resumen}.`,
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
  const [pasoIndex, setPasoIndex] = useState(0);
  const [banco, setBanco] = useState<string[]>([]);
  const [zonas, setZonas] = useState<(string | null)[]>([null, null, null]);
  const [estado, setEstado] = useState<"idle" | "correcto" | "incorrecto">(
    "idle",
  );
  const [revision, setRevision] = useState<(ResultadoZona | null)[]>([null, null, null]);
  const [intento, setIntento] = useState(0);
  const [pistaVisible, setPistaVisible] = useState(false);
  const [revisando, setRevisando] = useState(false);

  function prepararPaso(indiceFlujo: number, indicePaso: number) {
    setBanco(
      barajar(
        FLUJOS[indiceFlujo].pasos[indicePaso].bloques.map((bloque) => bloque.id),
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
    setPasoIndex(0);
    prepararPaso(indiceFlujo, 0);
    setPantalla("desafio");
  }

  if (pantalla === "intro") {
    return <PantallaIntro onComenzar={handleComenzar} />;
  }

  const flujo = FLUJOS[flujoIndex];
  const paso = flujo.pasos[pasoIndex];
  const pasoAnterior = pasoIndex > 0 ? flujo.pasos[pasoIndex - 1] : null;
  const bloquesEnBanco = banco.filter((id) => !zonas.includes(id));
  const zonaBloqueada = (indice: number) => revision[indice]?.ok === true;
  const correctas = revision.filter((r) => r?.ok).length;

  function encontrarBloque(id: string) {
    return paso.bloques.find((bloque) => bloque.id === id) ?? null;
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
      revisarZona(indice, id ? encontrarBloque(id) : null, paso.partes),
    );
    setRevision(resultados);

    if (resultados.every((r) => r.ok)) {
      setEstado("correcto");
      if (pasoIndex === 1) {
        completeStage(1);
      }
      return;
    }
    setEstado("incorrecto");
    setIntento((actual) => actual + 1);
  }

  function handleAvanzarPaso() {
    setPasoIndex(1);
    prepararPaso(flujoIndex, 1);
  }

  const bloquesFinales = zonas.map((id) => (id ? encontrarBloque(id) : null));
  const historia =
    estado === "correcto" && bloquesFinales.every(Boolean)
      ? paso.modo === "hu"
        ? `${bloquesFinales[0]!.texto}, ${bloquesFinales[1]!.texto}, ${bloquesFinales[2]!.texto}.`
        : `Dado que ${enMinuscula(bloquesFinales[0]!.texto)}, cuando ${enMinuscula(bloquesFinales[1]!.texto)}, entonces ${enMinuscula(bloquesFinales[2]!.texto)}.`
      : null;

  const esHu = paso.modo === "hu";

  return (
    <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
      <section className="space-y-6">
        <div className="rounded-3xl border-2 border-brand-soft bg-brand-light/30 p-6 text-center">
          <span className="etiqueta">
            Paso {pasoIndex + 1} de 2
          </span>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-brand-support sm:text-3xl">
            {paso.rotulo}
          </h2>
          <p className="mt-2 text-sm text-brand-support/80">
            Tema: <strong>{paso.titulo}</strong> · Flujo {flujo.nombre}
          </p>
          {pasoAnterior && (
            <button
              type="button"
              onClick={() => setRevisando(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-brand-soft bg-white/80 px-5 py-2 text-sm font-bold text-brand-support shadow-sm transition hover:-translate-y-0.5 hover:border-brand-mid"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              {pasoAnterior.modo === "hu"
                ? "Ver la historia de usuario"
                : "Ver el criterio de aceptación"}
            </button>
          )}
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
            {esHu ? "Escribe la historia de usuario" : "Escribe el criterio de aceptación"}
          </h2>
          <p className="mt-2 text-sm text-brand-support/80">
            {esHu
              ? "Una historia de usuario dice quién la necesita, qué quiere hacer y para qué le sirve. Coloca las 3 tarjetas en su parte."
              : "Un criterio de aceptación en formato Dado-Cuando-Entonces le dice al equipo de desarrollo exactamente qué debe hacer la app."}
          </p>
        </div>

        <div className="space-y-4">
          {paso.partes.map((zona, indice) => {
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
                    className={`rounded-sm px-3 py-1 font-mono text-xs font-black uppercase tracking-widest ${zona.color}`}
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
                      Suelta aquí la tarjeta de {zona.corto}
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
                <strong>💡 Pista:</strong> {PISTAS[paso.modo]}
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
                {esHu ? "Validar Historia de Usuario" : "Validar Criterio de Aceptación"}
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
                {esHu
                  ? "¡Historia de usuario lista! Ya sabes quién la necesita, qué quiere hacer y para qué le sirve."
                  : "¡Criterio de aceptación listo! Separaste los distractores y pusiste cada parte en su lugar."}
              </p>

              {historia && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-white p-4 text-left">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                    {esHu
                      ? "Así queda la historia de usuario completa"
                      : "Así queda el criterio de aceptación completo"}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-support">
                    {historia}
                  </p>
                </div>
              )}

              <p className="mt-4 text-sm leading-relaxed text-brand-support/90">
                {pasoIndex === 0
                  ? "Con esta frase el equipo sabe qué necesita la persona, sin detalles técnicos. Ahora toca bajar al detalle: ¿qué tendría que verse en la app para decir que está lista?"
                  : "¡Completaste los 2 pasos! Así trabaja un analista: primero cuenta la necesidad con palabras simples y después la traduce en un criterio que se pueda verificar."}
              </p>

              {pasoIndex === 0 ? (
                <button
                  type="button"
                  onClick={handleAvanzarPaso}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-brand-primary/30 transition-all duration-300 hover:bg-brand-support"
                >
                  Escribir el criterio de aceptación
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

      {revisando && pasoAnterior && (
        <ModalPasoAnterior
          paso={pasoAnterior}
          numeroPasoAnterior={pasoIndex}
          nombreFlujo={flujo.nombre}
          onCerrar={() => setRevisando(false)}
        />
      )}
    </div>
  );
}

/**
 * Consulta en modo lectura del paso que el estudiante ya resolvió. No permite
 * arrastrar ni editar: solo deja volver a leer la frase y las tres partes.
 */
function ModalPasoAnterior({
  paso,
  numeroPasoAnterior,
  nombreFlujo,
  onCerrar,
}: {
  paso: Historia;
  numeroPasoAnterior: number;
  nombreFlujo: string;
  onCerrar: () => void;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCerrar();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCerrar]);

  /** La tarjeta correcta de cada parte: la que coincide con su tipo. */
  const tarjetasCorrectas = paso.partes.map(
    (parte) => paso.bloques.find((bloque) => bloque.tipo === parte.tipo) ?? null,
  );
  const frases = tarjetasCorrectas.map((tarjeta) => tarjeta?.texto ?? "");
  const frase =
    paso.modo === "hu"
      ? `${frases[0]}, ${frases[1]}, ${frases[2]}.`
      : `Dado que ${enMinuscula(frases[0])}, cuando ${enMinuscula(frases[1])}, entonces ${enMinuscula(frases[2])}.`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-paso-anterior"
      onClick={onCerrar}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 text-left shadow-2xl sm:p-8"
      >
        <div className="text-center">
          <span className="etiqueta">Paso {numeroPasoAnterior} de 2</span>
          <h3
            id="titulo-paso-anterior"
            className="mt-4 text-2xl font-black tracking-tight text-brand-support"
          >
            {paso.rotulo}
          </h3>
          <p className="mt-2 text-sm text-brand-support/80">
            Tema: <strong>{paso.titulo}</strong> · Flujo {nombreFlujo}
          </p>
        </div>

        <div className="mt-6 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
            {paso.modo === "hu"
              ? "Así quedó tu historia de usuario"
              : "Así quedó tu criterio de aceptación"}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-brand-support">
            {frase}
          </p>
        </div>

        <ol className="mt-5 space-y-3">
          {paso.partes.map((parte, indice) => (
            <li
              key={parte.tipo}
              className="flex items-start gap-3 rounded-2xl border-2 border-brand-soft bg-white/80 p-3"
            >
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${parte.color}`}
              >
                {parte.corto}
              </span>
              <span className="text-sm leading-relaxed text-brand-support">
                {tarjetasCorrectas[indice]?.texto}
              </span>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={onCerrar}
          autoFocus
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-brand-primary/30 transition-all duration-300 hover:bg-brand-support"
        >
          {paso.modo === "hu"
            ? "Volver al criterio de aceptación"
            : "Volver a la historia de usuario"}
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function PantallaIntro({ onComenzar }: { onComenzar: () => void }) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl shadow-brand-primary/20 backdrop-blur-md sm:p-10">
        <div className="text-center">
          <h2 className="mt-4 text-2xl font-black tracking-tight text-brand-support sm:text-3xl">
            De la idea al requerimiento: Historia de Usuario y Criterio de
            Aceptación
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-support/80">
            Un requerimiento se escribe en dos capas. Primero cuentas la
            necesidad con palabras sencillas; después dices cómo se comprueba
            que la app quedó bien. Repasa las dos antes de iniciar el reto.
          </p>
        </div>

        <h3 className="mt-8 text-sm font-black uppercase tracking-wide text-brand-support">
          1. Historia de usuario — la necesidad
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-brand-support/70">
          Se escribe desde el punto de vista de la persona que la usa, nunca
          desde el punto de vista técnico.
        </p>
        <TablaFormato filas={TABLA_HU} />

        <h3 className="mt-8 text-sm font-black uppercase tracking-wide text-brand-support">
          2. Criterio de aceptación — cómo se comprueba
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-brand-support/70">
          Se escribe en formato BDD (Dado-Cuando-Entonces) y describe el
          comportamiento que la app debe cumplir.
        </p>
        <TablaFormato filas={TABLA_BDD} />

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

function TablaFormato({
  filas,
}: {
  filas: { palabra: string; pregunta: string; ejemplo: string }[];
}) {
  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-brand-soft">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b-2 border-brand-soft bg-brand-light/40 text-xs font-bold uppercase tracking-wide text-brand-support">
            <th className="px-4 py-3">Palabra Clave</th>
            <th className="px-4 py-3">Pregunta que responde</th>
            <th className="px-4 py-3">Ejemplo Contextual</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr
              key={fila.palabra}
              className="border-b border-brand-soft/40 text-brand-support last:border-0"
            >
              <td className="px-4 py-3 font-black text-brand-primary">
                {fila.palabra}
              </td>
              <td className="px-4 py-3">{fila.pregunta}</td>
              <td className="px-4 py-3">{fila.ejemplo}</td>
            </tr>
          ))}
        </tbody>
      </table>
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