"use client";

import { type DragEvent, type KeyboardEvent, type ReactNode } from "react";
import { motion } from "framer-motion";

export const PUNTAJE_MAXIMO_NIVEL = 100;
export const PUNTAJE_MINIMO_NIVEL = 40;
export const PENALIDAD_FALLO = 15;
export const PENALIDAD_PISTA = 10;

export function calcularPuntaje(fallos: number, pistas: number): number {
  return Math.max(
    PUNTAJE_MINIMO_NIVEL,
    PUNTAJE_MAXIMO_NIVEL - fallos * PENALIDAD_FALLO - pistas * PENALIDAD_PISTA,
  );
}

export function barajar<T>(items: T[]): T[] {
  const copia = [...items];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

const COLORES_CONFETI = [
  "#F53E3E",
  "#FB8F3C",
  "#FBC02D",
  "#43A047",
  "#1E88E5",
  "#6A1B9A",
  "#D81B60",
];

const SACUDIDA = { x: [0, -12, 12, -12, 12, -8, 8, 0] };

/* ------------------------------------------------------------------ */

export function EncabezadoNivel({
  etiqueta,
  titulo,
  instrucciones,
}: {
  etiqueta: string;
  titulo: string;
  instrucciones: ReactNode;
}) {
  return (
    <div className="rounded-3xl border-2 border-brand-soft bg-brand-light/30 p-6 text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-support">
        {etiqueta}
      </span>
      <h2 className="mt-4 text-2xl font-black tracking-tight text-brand-support sm:text-3xl">
        {titulo}
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-brand-support/80">
        {instrucciones}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export type EstadoChip = "normal" | "correcto" | "incorrecto";

export function Chip({
  id,
  texto,
  detalle,
  estado = "normal",
  seleccionado = false,
  bloqueado = false,
  intento = 0,
  compacto = false,
  onSeleccionar,
}: {
  id: string;
  texto: string;
  detalle?: string;
  estado?: EstadoChip;
  seleccionado?: boolean;
  bloqueado?: boolean;
  intento?: number;
  compacto?: boolean;
  onSeleccionar: (id: string) => void;
}) {
  function handleDragStart(event: DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!bloqueado) onSeleccionar(id);
    }
  }

  const colores =
    estado === "correcto"
      ? "border-emerald-400 bg-emerald-50"
      : estado === "incorrecto"
        ? "border-red-400 bg-red-50 ring-2 ring-red-300"
        : seleccionado
          ? "border-brand-primary bg-brand-soft/20 ring-4 ring-brand-mid/40"
          : "border-brand-soft bg-white hover:-translate-y-0.5 hover:border-brand-mid";

  return (
    <motion.div
      key={estado === "incorrecto" ? `${id}-${intento}` : id}
      animate={estado === "incorrecto" ? SACUDIDA : undefined}
      transition={{ duration: 0.55 }}
    >
      <div
        role="button"
        tabIndex={bloqueado ? -1 : 0}
        aria-pressed={seleccionado}
        draggable={!bloqueado}
        onDragStart={handleDragStart}
        onClick={(event) => {
          event.stopPropagation();
          if (!bloqueado) onSeleccionar(id);
        }}
        onKeyDown={handleKeyDown}
        className={`select-none rounded-xl border-2 text-left shadow-sm transition ${colores} ${
          compacto ? "px-2.5 py-1.5" : "px-3 py-2.5"
        } ${bloqueado ? "cursor-default" : "cursor-grab active:cursor-grabbing"}`}
      >
        <div className="flex items-start gap-2">
          {estado === "correcto" && (
            <span className="font-black text-emerald-600" aria-hidden="true">
              ✓
            </span>
          )}
          {estado === "incorrecto" && (
            <span className="font-black text-red-500" aria-hidden="true">
              ✗
            </span>
          )}
          <span
            className={`font-semibold leading-snug text-brand-support ${
              compacto ? "text-xs sm:text-sm" : "text-sm"
            }`}
          >
            {texto}
          </span>
        </div>
        {detalle && (
          <p
            className={`mt-1 text-xs leading-snug ${
              estado === "incorrecto" ? "text-red-600" : "text-emerald-700"
            }`}
          >
            {detalle}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

export function ZonaSoltar({
  onSoltar,
  onClickZona,
  activa,
  invalida = false,
  className = "",
  children,
}: {
  onSoltar: (id: string) => void;
  onClickZona: () => void;
  /** true cuando hay una tarjeta seleccionada y la zona puede recibirla. */
  activa: boolean;
  invalida?: boolean;
  className?: string;
  children: ReactNode;
}) {
  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (id) onSoltar(id);
  }

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      onClick={onClickZona}
      className={`rounded-2xl border-2 border-dashed transition-colors ${
        invalida
          ? "border-red-400 bg-red-50"
          : activa
            ? "cursor-pointer border-brand-primary bg-brand-soft/20"
            : "border-brand-soft bg-white/60"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function BarraAcciones({
  puedeValidar,
  textoPendiente,
  textoValidar,
  pistaTexto,
  pistaVisible,
  onPista,
  onValidar,
  error,
}: {
  puedeValidar: boolean;
  textoPendiente: string;
  textoValidar: string;
  pistaTexto: string;
  pistaVisible: boolean;
  onPista: () => void;
  onValidar: () => void;
  error: string | null;
}) {
  return (
    <div className="space-y-4">
      {pistaVisible && (
        <div className="animate-fade-in rounded-xl border border-brand-mid/50 bg-brand-soft/20 p-3 text-sm text-brand-support">
          <strong>💡 Pista:</strong> {pistaTexto}
        </div>
      )}

      {error && (
        <p className="animate-fade-in rounded-xl border border-amber-300 bg-amber-50 p-3 text-center text-sm font-semibold text-amber-800">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        {!pistaVisible && (
          <button
            type="button"
            onClick={onPista}
            className="rounded-full border-2 border-brand-soft px-6 py-3 text-sm font-bold text-brand-support transition-all hover:border-brand-support"
          >
            💡 Pedir pista (−{PENALIDAD_PISTA} pts)
          </button>
        )}
        <button
          type="button"
          onClick={onValidar}
          disabled={!puedeValidar}
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-8 py-3 text-lg font-bold shadow-xl transition-all duration-300 ${
            puedeValidar
              ? "bg-brand-primary text-white shadow-brand-primary/30 hover:bg-brand-mid"
              : "cursor-not-allowed bg-brand-light text-brand-support/60 shadow-none"
          }`}
        >
          {puedeValidar ? textoValidar : textoPendiente}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Tarjeta que aparece al completar un nivel: revela el nombre técnico
 * de lo que el estudiante acaba de hacer.
 */
export function RevelacionConcepto({
  titulo,
  children,
  puntaje,
  textoBoton,
  onContinuar,
}: {
  titulo: string;
  children: ReactNode;
  puntaje: number;
  textoBoton: string;
  onContinuar: () => void;
}) {
  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <Confetti />
      <div className="animate-fade-in rounded-3xl border-2 border-emerald-300 bg-emerald-50 p-6 text-center sm:p-10">
        <p className="text-4xl">🎺🎉</p>
        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          +{puntaje} pts
        </span>
        <h2 className="mt-4 text-2xl font-black tracking-tight text-emerald-700 sm:text-3xl">
          {titulo}
        </h2>
        <div className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-brand-support">
          {children}
        </div>
        <button
          type="button"
          onClick={onContinuar}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-brand-primary/30 transition-all duration-300 hover:bg-brand-mid"
        >
          {textoBoton}
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

/* ------------------------------------------------------------------ */

export function Confetti() {
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
          style={{ left: pieza.x, backgroundColor: pieza.color }}
        />
      ))}
    </div>
  );
}
