"use client";

import Link from "next/link";
import { MedalIcon, TrophyIcon } from "@/components/game/icons";
import { Confetti } from "./ArquitectoUI";
import { CONEXIONES, MOLDES, verboPorId, type MoldeId } from "./feria-data";

export const PUNTAJE_MAXIMO_TOTAL = 300;

const ETAPAS = [
  { etapa: "Requisitos", rol: "Analista", actual: false },
  { etapa: "Diseño", rol: "Arquitecto", actual: true },
  { etapa: "Desarrollo", rol: "Fullstack", actual: false },
  { etapa: "Pruebas", rol: "QA", actual: false },
  { etapa: "Seguridad y entrega", rol: "Ciberseguridad", actual: false },
];

function verboDe(desde: MoldeId, hacia: MoldeId): string {
  const conexion = CONEXIONES.find((c) => c.desde === desde && c.hacia === hacia);
  return conexion ? (verboPorId(conexion.verboCorrecto)?.texto ?? "") : "";
}

function CajaClase({ id }: { id: MoldeId }) {
  const molde = MOLDES[id];
  return (
    <div className="overflow-hidden rounded-xl border-2 border-brand-primary bg-white shadow-md">
      <div className="bg-brand-primary px-2 py-2 text-center text-xs font-black text-white sm:text-sm">
        {molde.nombreTecnico}
      </div>
      <ul className="space-y-0.5 px-2 py-2 font-mono text-[10px] text-brand-support sm:text-xs">
        {molde.atributos.map((atributo) => (
          <li key={atributo} className="break-all">
            − {atributo}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ConectorHorizontal({ texto }: { texto: string }) {
  return (
    <div className="flex w-14 flex-col items-center justify-center sm:w-28">
      <span className="mb-1 text-center text-[10px] font-bold leading-tight text-brand-primary sm:text-xs">
        {texto}
      </span>
      <div className="flex w-full items-center">
        <div className="h-0.5 flex-1 bg-brand-primary" />
        <span className="-ml-1 text-xs leading-none text-brand-primary" aria-hidden="true">
          ▶
        </span>
      </div>
    </div>
  );
}

function ConectorVertical({ texto, haciaArriba = false }: { texto: string; haciaArriba?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <div className="flex flex-col items-center">
        {haciaArriba && (
          <span className="-mb-1 text-xs leading-none text-brand-primary" aria-hidden="true">
            ▲
          </span>
        )}
        <div className="h-8 w-0.5 bg-brand-primary sm:h-10" />
        {!haciaArriba && (
          <span className="-mt-1 text-xs leading-none text-brand-primary" aria-hidden="true">
            ▼
          </span>
        )}
      </div>
      <span className="text-[10px] font-bold leading-tight text-brand-primary sm:text-xs">
        {texto}
      </span>
    </div>
  );
}

export function obtenerNivel(total: number) {
  if (total >= 260) {
    return {
      label: "Arquitecto Maestro del Salsódromo",
      color: "text-amber-600",
      bg: "border-amber-300 bg-amber-50",
      icono: (
        <span className="text-amber-500">
          <TrophyIcon className="h-16 w-16" />
        </span>
      ),
    };
  }
  if (total >= 180) {
    return {
      label: "Arquitecto de la Feria",
      color: "text-brand-primary",
      bg: "border-brand-mid bg-brand-soft/30",
      icono: (
        <span className="text-brand-support">
          <MedalIcon medalla={2} className="h-16 w-16" />
        </span>
      ),
    };
  }
  return {
    label: "Aprendiz de Arquitecto",
    color: "text-orange-600",
    bg: "border-orange-200 bg-orange-50",
    icono: (
      <span className="text-orange-500">
        <MedalIcon medalla={3} className="h-16 w-16" />
      </span>
    ),
  };
}

export default function PlanoFinal({
  puntajes,
  onReintentar,
}: {
  puntajes: [number, number, number];
  onReintentar: () => void;
}) {
  const total = puntajes[0] + puntajes[1] + puntajes[2];
  const nivel = obtenerNivel(total);

  return (
    <div className="relative space-y-8">
      <Confetti />

      <div className="text-center">
        <div className="mb-4 flex justify-center">{nivel.icono}</div>
        <h2 className="text-3xl font-extrabold text-brand-support">¡Plano terminado!</h2>
        <p className="mx-auto mt-2 max-w-2xl text-brand-support/80">
          Esto que ves es un <strong>diagrama de clases</strong>: el plano que
          un ingeniero de sistemas entrega al equipo antes de escribir una sola
          línea de código. ¡Y lo armaste tú!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-white/60 bg-brand-light/20 p-4 shadow-2xl shadow-brand-primary/20 sm:p-6">
          <div className="mb-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-support">
              Diagrama de clases · App Feria de Cali
            </span>
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-1 sm:gap-x-3">
            <CajaClase id="escuela" />
            <div />
            <CajaClase id="orquesta" />

            <ConectorVertical texto={verboDe("escuela", "bailarin")} />
            <div />
            <ConectorVertical texto={verboDe("orquesta", "desfile")} />

            <CajaClase id="bailarin" />
            <ConectorHorizontal texto={verboDe("bailarin", "desfile")} />
            <CajaClase id="desfile" />

            <div />
            <div />
            <ConectorVertical texto={verboDe("boleta", "desfile")} haciaArriba />

            <CajaClase id="asistente" />
            <ConectorHorizontal texto={verboDe("asistente", "boleta")} />
            <CajaClase id="boleta" />
          </div>
          <p className="mt-4 text-center text-xs text-brand-support/70">
            Los ingenieros escriben los nombres sin espacios ni tildes
            (<span className="font-mono">EscuelaDeSalsa</span>,{" "}
            <span className="font-mono">horaDeInicio</span>) para que el
            computador los entienda.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-xl shadow-brand-primary/10">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand-support">
              Lo que aprendiste
            </h3>
            <ul className="space-y-2 text-sm text-brand-support">
              <li>🧩 <strong>Molde</strong> → se llama <strong>clase</strong></li>
              <li>📍 <strong>Ejemplo real</strong> → se llama <strong>objeto</strong></li>
              <li>🏷️ <strong>Característica</strong> → se llama <strong>atributo</strong></li>
              <li>🔗 <strong>Conexión</strong> → se llama <strong>relación</strong></li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-xl shadow-brand-primary/10">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand-support">
              ¿Dónde está el arquitecto?
            </h3>
            <ol className="space-y-2">
              {ETAPAS.map((e, i) => (
                <li
                  key={e.etapa}
                  className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2 text-sm ${
                    e.actual
                      ? "border-brand-primary bg-brand-primary text-white shadow-md"
                      : "border-brand-soft bg-white/60 text-brand-support"
                  }`}
                >
                  <span className="font-black">{i + 1}</span>
                  <span className="flex-1 font-semibold">{e.etapa}</span>
                  <span className={`text-xs ${e.actual ? "font-bold" : "text-brand-support/70"}`}>
                    {e.actual ? "¡Aquí estuviste!" : e.rol}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-brand-support/70">
              Así avanza el <strong>ciclo de vida del software</strong>: con tu
              plano, el equipo de desarrollo ya puede empezar a programar.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Moldes y ejemplos", score: puntajes[0], bold: false },
          { label: "Características", score: puntajes[1], bold: false },
          { label: "Conexiones", score: puntajes[2], bold: false },
          { label: `Total (máx. ${PUNTAJE_MAXIMO_TOTAL})`, score: total, bold: true },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-xl border p-4 text-center ${
              item.bold ? "border-brand-primary bg-brand-soft/30" : "border-brand-soft bg-brand-light/40"
            }`}
          >
            <div className={`text-2xl font-black ${item.bold ? "text-brand-primary" : "text-brand-support"}`}>
              {item.score} pts
            </div>
            <div className="text-xs text-brand-support/80">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <div className={`inline-block rounded-xl border-2 px-6 py-3 ${nivel.bg}`}>
          <span className={`text-lg font-extrabold ${nivel.color}`}>🏅 {nivel.label}</span>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onReintentar}
          className="rounded-full border-2 border-brand-soft px-6 py-3 font-bold text-brand-support transition-all hover:border-brand-support"
        >
          Reintentar el reto
        </button>
        <Link
          href="/retos"
          className="flex items-center justify-center rounded-full bg-brand-primary px-8 py-3 font-bold text-white shadow-md transition-all hover:bg-brand-mid"
        >
          Continuar
        </Link>
      </div>
    </div>
  );
}
