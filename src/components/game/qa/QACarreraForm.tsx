"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type DragEvent } from "react";
import { continuarConCierre } from "@/lib/personajes";
import { barajar } from "@/lib/random";
import { motion } from "framer-motion";

/** Reglas de negocio que debe cumplir el formulario de inscripción. */
const REGLAS = [
  { numero: 1, texto: "El número de documento no puede tener más de 10 dígitos." },
  {
    numero: 2,
    texto: "El nombre completo solo usa letras y espacios: no admite números ni caracteres especiales.",
  },
  { numero: 3, texto: "La edad solo admite números mayores a 18 y hasta 120 años." },
  { numero: 4, texto: "El número de celular no puede tener más de 13 caracteres." },
  { numero: 5, texto: "La fecha de nacimiento no puede ser una fecha futura." },
];

type TipoControl = "letras" | "digitos" | "edad" | "telefono" | "fecha";

/**
 * Un campo del formulario de inscripción. `etiqueta` nunca se pinta junto al
 * control: solo aparece en las tarjetas arrastrables. `pista` describe el
 * comportamiento observable del control para la retroalimentación.
 */
interface Campo {
  id: string;
  etiqueta: string;
  tipo: TipoControl;
  regla: number;
  pista: string;
}

const CAMPOS: Campo[] = [
  {
    id: "nombre",
    etiqueta: "Nombre Completo",
    tipo: "letras",
    regla: 2,
    pista:
      "borra los números y los símbolos mientras escribes: si tecleas Jhon3, en la casilla queda Jhon.",
  },
  {
    id: "documento",
    etiqueta: "Documento",
    tipo: "digitos",
    regla: 1,
    pista:
      "acepta solo dígitos y se corta en el décimo: la cifra número 11 nunca llega a entrar.",
  },
  {
    id: "edad",
    etiqueta: "Edad",
    tipo: "edad",
    regla: 3,
    pista:
      "acepta el 25 y también el 120, pero se niega a tomar el 200, y ante un -5 solo queda el 5: aquí los negativos no existen.",
  },
  {
    id: "telefono",
    etiqueta: "Teléfono",
    tipo: "telefono",
    regla: 4,
    pista:
      "acepta solo dígitos y aguanta 13 posiciones: es el único campo que no se corta en el décimo.",
  },
  {
    id: "fecha",
    etiqueta: "Fecha de Nacimiento",
    tipo: "fecha",
    regla: 5,
    pista: "abre un calendario y no te deja elegir un día de mañana.",
  },
];

const EDAD_MIN = 18;
const EDAD_MAX = 120;
const DIGITOS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const SACUDIDA = { x: [0, -7, 7, -5, 5, 0] };

const HOY = new Date();
const HOY_ISO = [
  HOY.getFullYear(),
  String(HOY.getMonth() + 1).padStart(2, "0"),
  String(HOY.getDate()).padStart(2, "0"),
].join("-");

const COLORES_CONFETI = [
  "#F53E3E",
  "#FB8F3C",
  "#FBC02D",
  "#43A047",
  "#1E88E5",
  "#6A1B9A",
  "#D81B60",
];

function soloLetras(valor: string) {
  return valor.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g, "");
}

function soloDigitos(valor: string) {
  return valor.replace(/\D/g, "");
}

/**
 * true si lo escrito ya es una edad válida, o si todavía puede crecer hasta
 * serlo. Así el estudiante puede teclear "2" y luego "5", pero no "200".
 */
function edadAceptable(valor: string) {
  if (valor === "") return true;
  const n = Number(valor);
  if (n >= EDAD_MIN && n <= EDAD_MAX) return true;
  return DIGITOS.some((digito) => {
    const candidato = Number(valor + digito);
    return candidato >= EDAD_MIN && candidato <= EDAD_MAX;
  });
}

export default function QACarreraForm() {
  const router = useRouter();
  const [filas] = useState(() => barajar(CAMPOS));
  const [tarjetas] = useState(() => barajar(CAMPOS));
  const [valores, setValores] = useState<Record<string, string>>({});
  const [asignacion, setAsignacion] = useState<(string | null)[]>(() =>
    CAMPOS.map(() => null),
  );
  const [revision, setRevision] = useState<(boolean | null)[]>(() =>
    CAMPOS.map(() => null),
  );
  const [estado, setEstado] = useState<"idle" | "correcto" | "incorrecto">(
    "idle",
  );
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [sacudiendo, setSacudiendo] = useState<string | null>(null);

  const bloqueado = estado === "correcto";
  const enBanco = tarjetas.filter((tarjeta) => !asignacion.includes(tarjeta.id));

  function rechazar(id: string) {
    setSacudiendo(id);
    window.setTimeout(() => setSacudiendo((a) => (a === id ? null : a)), 400);
  }

  function escribirCampo(campo: Campo, bruto: string): string | null {
    switch (campo.tipo) {
      case "letras":
        return soloLetras(bruto);
      case "digitos":
        return soloDigitos(bruto).slice(0, 10);
      case "edad": {
        const digitos = soloDigitos(bruto);
        return edadAceptable(digitos) ? digitos : null;
      }
      case "telefono":
        return soloDigitos(bruto).slice(0, 13);
      case "fecha":
        return bruto;
    }
  }

  function handleCambio(campo: Campo, bruto: string) {
    const siguiente = escribirCampo(campo, bruto);
    if (siguiente === null) {
      rechazar(campo.id);
      return;
    }
    if (siguiente === valores[campo.id]) return;
    setValores((actual) => ({ ...actual, [campo.id]: siguiente }));
  }

  /** Borra la revisión solo de los cuadros que cambiaron. */
  function limpiarRevision(indices: number[]) {
    setRevision((actual) =>
      actual.map((r, i) => (indices.includes(i) ? null : r)),
    );
    setEstado("idle");
  }

  function soltarEnCuadro(indice: number, idTarjeta: string) {
    if (!idTarjeta || bloqueado) return;
    const otra = asignacion.indexOf(idTarjeta);
    setAsignacion((actual) => {
      const siguiente = [...actual];
      if (otra !== -1 && otra !== indice) siguiente[otra] = null;
      siguiente[indice] = idTarjeta;
      return siguiente;
    });
    limpiarRevision(otra === -1 ? [indice] : [indice, otra]);
    setSeleccionada(null);
  }

  function quitarDeCuadro(indice: number) {
    if (bloqueado) return;
    setAsignacion((actual) =>
      actual.map((id, i) => (i === indice ? null : id)),
    );
    limpiarRevision([indice]);
    setSeleccionada(null);
  }

  function handleValidar() {
    const resultados = asignacion.map(
      (id, indice) => id !== null && id === filas[indice].id,
    );
    setRevision(resultados);
    setEstado(resultados.every(Boolean) ? "correcto" : "incorrecto");
  }

  const errores = filas.flatMap((campo, indice) => {
    const resultado = revision[indice];
    if (resultado === null || resultado) return [];
    return [
      {
        fila: indice + 1,
        texto:
          asignacion[indice] === null
            ? `ese cuadro quedó vacío y el campo no puede estarlo: ${campo.pista}`
            : `la tarjeta que pusiste ahí no corresponde: ${campo.pista}`,
      },
    ];
  });

  return (
    <div className="w-full space-y-8">
      <section className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl shadow-brand-primary/20 backdrop-blur-md sm:p-8">
        <div className="text-center">
          <h2 className="mt-4 text-2xl font-black tracking-tight text-brand-support sm:text-3xl">
            Reglas de juego del formulario
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-support/80">
            Estas son las reglas de negocio que debe cumplir la inscripción de la
            Carrera del Pacífico. Cada regla corresponde a un único campo: tu
            trabajo es descubrir cuál es cuál y colocarlo en su sitio.
          </p>
        </div>

        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {REGLAS.map((regla) => (
            <li
              key={regla.numero}
              className="flex items-start gap-3 rounded-2xl border-2 border-brand-soft bg-white/80 p-4 text-left"
            >
              <span className="etiqueta shrink-0">#{regla.numero}</span>
              <span className="text-sm leading-relaxed text-brand-support">
                {regla.texto}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <div className="grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <section className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl shadow-brand-primary/20 backdrop-blur-md sm:p-8">
          <div className="min-h-[104px] text-center">
            <h2 className="mt-4 text-2xl font-black tracking-tight text-brand-support sm:text-3xl">
              Eres el ingeniero de QA
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-support/80">
              Escribe valores inválidos y observa qué acepta y qué rechaza cada uno.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            {filas.map((campo, indice) => (
              <div
                key={campo.id}
                className={`rounded-2xl px-3 py-2 ${
                  indice % 2 === 0 ? "bg-brand-light/25" : ""
                }`}
              >
                <ControlPrueba
                  campo={campo}
                  indice={indice}
                  valor={valores[campo.id] ?? ""}
                  rechazando={sacudiendo === campo.id}
                  onChange={(bruto) => handleCambio(campo, bruto)}
                />
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-brand-support/70">
            Un campo no te va a decir su nombre. Si escribes algo que no debería
            aceptar y la casilla lo Borra o lo trunca, ya tienes una pista de qué
            regla está implementando.
          </p>
        </section>

        <section className="relative rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl shadow-brand-primary/20 backdrop-blur-md sm:p-8">
          {estado === "correcto" && <Confetti />}

          <div className="min-h-[104px] text-center">
            <h2 className="mt-4 text-2xl font-black tracking-tight text-brand-support sm:text-3xl">
              Coloca cada tarjeta
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-support/80">
              Arrastra la tarjeta del campo que descubriste al cuadro que está
              en su misma fila, a la derecha. Cada fila de este panel corresponde
              al campo de la misma fila del panel izquierdo.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            {filas.map((campo, indice) => {
              const idPuesto = asignacion[indice];
              const tarjeta = tarjetas.find((t) => t.id === idPuesto) ?? null;
              return (
                <div
                  key={indice}
                  className={`rounded-2xl px-3 py-2 ${
                    indice % 2 === 0 ? "bg-brand-light/25" : ""
                  }`}
                >
                  <CuadroCampo
                    indice={indice}
                    tarjeta={tarjeta}
                    revision={revision[indice]}
                    activa={seleccionada !== null && idPuesto === null}
                    bloqueado={bloqueado}
                    onSoltar={(id) => soltarEnCuadro(indice, id)}
                    onActivar={() => {
                      if (tarjeta) {
                        quitarDeCuadro(indice);
                      } else if (seleccionada) {
                        soltarEnCuadro(indice, seleccionada);
                      }
                    }}
                    onQuitar={() => quitarDeCuadro(indice)}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <p className="text-center text-xs font-bold uppercase tracking-wide text-brand-support/60">
              Tarjetas de campo
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              {enBanco.length === 0 && (
                <p className="text-sm text-brand-support/60">
                  Ya colocaste todas las tarjetas.
                </p>
              )}
              {enBanco.map((tarjeta) => (
                <TarjetaCampo
                  key={tarjeta.id}
                  id={tarjeta.id}
                  texto={tarjeta.etiqueta}
                  seleccionada={seleccionada === tarjeta.id}
                  bloqueado={bloqueado}
                  onSeleccionar={() =>
                    setSeleccionada((a) =>
                      a === tarjeta.id ? null : tarjeta.id,
                    )
                  }
                />
              ))}
            </div>
          </div>

          {!bloqueado && (
            <button
              type="button"
              onClick={handleValidar}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-8 py-3.5 text-lg font-bold text-white shadow-lg shadow-brand-primary/30 transition-all duration-300 hover:bg-brand-support"
            >
              Validar Trazabilidad
            </button>
          )}

          {errores.length > 0 && (
            <div className="mt-5 animate-fade-in rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 text-left">
              <p className="text-sm font-bold text-amber-800">
                Revisa {errores.length}{" "}
                {errores.length === 1 ? "colocación" : "colocaciones"}:
              </p>
              <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-amber-900">
                {errores.map((error) => (
                  <li key={error.fila}>
                    <span className="font-bold">Fila {error.fila}:</span>{" "}
                    {error.texto}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {estado === "correcto" && (
            <div className="mt-5 animate-fade-in rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4 text-center">
              <p className="text-base font-bold text-emerald-700">
                ¡Excelente trabajo de QA! Identificaste los 5 campos de la
                Carrera del Pacífico y cada uno responde a su regla.
              </p>
              <ul className="mt-3 space-y-1 text-left text-xs leading-relaxed text-emerald-800">
                {filas.map((campo) => (
                  <li key={campo.id}>
                    <span className="font-bold">{campo.etiqueta}</span> responde
                    a la Regla #{campo.regla}.
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => continuarConCierre("qa", router.push)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-brand-primary/30 transition-all duration-300 hover:bg-brand-support"
              >
                Continuar
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
          )}
        </section>
      </div>
    </div>
  );
}

function ControlPrueba({
  campo,
  indice,
  valor,
  rechazando,
  onChange,
}: {
  campo: Campo;
  indice: number;
  valor: string;
  rechazando: boolean;
  onChange: (bruto: string) => void;
}) {
  const clase =
    "h-14 w-full rounded-2xl border-2 border-brand-soft bg-white/80 px-3 text-center text-base text-brand-support shadow-sm outline-none transition placeholder:text-brand-support/50 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20";

  const comunes = {
    id: `qa-prueba-${campo.id}`,
    "aria-label": `Campo de prueba de la fila ${indice + 1}`,
    value: valor,
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      onChange(event.target.value),
    className: clase,
  };

  return (
    <motion.div
      animate={rechazando ? SACUDIDA : { x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {campo.tipo === "fecha" ? (
        <input {...comunes} type="date" max={HOY_ISO} />
      ) : (
        <input
          {...comunes}
          type="text"
          inputMode={campo.tipo === "letras" ? "text" : "numeric"}
          placeholder="Escribe aquí"
          autoComplete="off"
        />
      )}
    </motion.div>
  );
}

function TarjetaCampo({
  id,
  texto,
  seleccionada,
  bloqueado,
  onSeleccionar,
}: {
  id: string;
  texto: string;
  seleccionada: boolean;
  bloqueado: boolean;
  onSeleccionar: () => void;
}) {
  function handleDragStart(event: DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
  }

  return (
    <div
      role="button"
      tabIndex={bloqueado ? -1 : 0}
      aria-pressed={seleccionada}
      draggable={!bloqueado}
      onDragStart={handleDragStart}
      onClick={onSeleccionar}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (!bloqueado) onSeleccionar();
        }
      }}
      className={`select-none rounded-2xl border-2 px-4 py-3 text-sm font-bold shadow-sm transition ${
        bloqueado
          ? "cursor-default border-brand-soft bg-white/70 text-brand-support/60"
          : seleccionada
            ? "cursor-grab border-brand-primary bg-brand-soft/25 text-brand-support ring-4 ring-brand-mid/40"
            : "cursor-grab border-brand-soft bg-white/80 text-brand-support hover:-translate-y-0.5 hover:border-brand-mid active:cursor-grabbing"
      }`}
    >
      {texto}
    </div>
  );
}

function CuadroCampo({
  indice,
  tarjeta,
  revision,
  activa,
  bloqueado,
  onSoltar,
  onActivar,
  onQuitar,
}: {
  indice: number;
  tarjeta: Campo | null;
  revision: boolean | null;
  activa: boolean;
  bloqueado: boolean;
  onSoltar: (id: string) => void;
  onActivar: () => void;
  onQuitar: () => void;
}) {
  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (id) onSoltar(id);
  }

  const correcto = revision === true;
  const revisado = revision !== null;

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      className={`flex h-14 items-center justify-center rounded-2xl border-2 border-dashed px-3 text-center transition-colors ${
        correcto
          ? "border-emerald-400 bg-emerald-50"
          : revisado
            ? "border-amber-400 bg-amber-50"
            : activa
              ? "border-brand-primary bg-brand-soft/20"
              : "border-brand-soft bg-white/60"
      }`}
    >
      {tarjeta ? (
        <div
          draggable={!bloqueado}
          onDragStart={(event) => {
            event.dataTransfer.setData("text/plain", tarjeta.id);
            event.dataTransfer.effectAllowed = "move";
          }}
          className={`flex w-full items-center justify-center gap-1 ${
            bloqueado ? "" : "cursor-grab active:cursor-grabbing"
          }`}
        >
          {correcto && (
            <span
              className="font-black text-emerald-600"
              aria-hidden="true"
            >
              ✓
            </span>
          )}
          {revisado && !correcto && (
            <span className="font-black text-amber-600" aria-hidden="true">
              ✗
            </span>
          )}
          <span className="text-sm font-bold leading-tight text-brand-support">
            {tarjeta.etiqueta}
          </span>
          {!bloqueado && (
            <button
              type="button"
              onClick={onQuitar}
              aria-label={`Quitar la tarjeta ${tarjeta.etiqueta} de la fila ${indice + 1}`}
              className="shrink-0 rounded-full p-1 text-brand-support/50 transition hover:bg-brand-soft/30 hover:text-brand-support"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={onActivar}
          disabled={bloqueado}
          className="w-full text-xs leading-tight text-brand-support/40 disabled:cursor-default"
        >
          {revisado ? "Vacío" : "Suelta aquí"}
        </button>
      )}
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
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-3xl"
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
