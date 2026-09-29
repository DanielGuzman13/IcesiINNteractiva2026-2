"use client";

import { useState } from "react";
import Link from "next/link";
import Nivel1MoldeOEjemplo from "@/components/game/arquitecto/Nivel1MoldeOEjemplo";
import Nivel2Caracteristicas from "@/components/game/arquitecto/Nivel2Caracteristicas";
import Nivel3Conexiones from "@/components/game/arquitecto/Nivel3Conexiones";
import PlanoFinal, { PUNTAJE_MAXIMO_TOTAL } from "@/components/game/arquitecto/PlanoFinal";
import { PENALIDAD_FALLO, PENALIDAD_PISTA } from "@/components/game/arquitecto/ArquitectoUI";
import { saveActivityScore } from "@/lib/game-storage";
import { completeStage } from "@/lib/ruta-progress";
import { anunciarCierrePersonaje } from "@/lib/personajes";

type Paso = "intro" | "nivel1" | "nivel2" | "nivel3" | "resultado";

const GLOSARIO: { palabra: string; significado: string; ejemplo: string }[] = [
  {
    palabra: "🧩 Molde",
    significado: "Un tipo de cosa del que hay muchos",
    ejemplo: "Orquesta, Desfile, Boleta",
  },
  {
    palabra: "📍 Ejemplo real",
    significado: "Uno en particular, con nombre propio",
    ejemplo: "Grupo Niche, el Salsódromo",
  },
  {
    palabra: "🏷️ Característica",
    significado: "Un dato que describe al molde",
    ejemplo: "Toda boleta tiene un precio",
  },
  {
    palabra: "🔗 Conexión",
    significado: "Cómo se relacionan dos moldes",
    ejemplo: "Un asistente compra una boleta",
  },
];

const NIVELES = [
  {
    titulo: "Nivel 1 - ¿Molde o ejemplo?",
    desc: "Separa los tipos de cosa de los ejemplos reales de la Feria.",
    tiempo: "~4 min",
  },
  {
    titulo: "Nivel 2 - ¿Qué lo describe?",
    desc: "Dale a cada molde sus características.",
    tiempo: "~5 min",
  },
  {
    titulo: "Nivel 3 - ¿Cómo se conectan?",
    desc: "Une los moldes con la acción correcta.",
    tiempo: "~3 min",
  },
];

const MENSAJES: Record<"nivel1" | "nivel2" | "nivel3", string[]> = {
  nivel1: [
    "¡Qué visión! Ya sabes de qué cosas hablará la app de la Feria.",
    "¡Bien! Separaste lo general de lo particular como un ingeniero.",
  ],
  nivel2: [
    "¡Eso! Ahora la app sabe qué datos guardar de cada molde.",
    "¡Muy bien! Tus moldes ya tienen sus características.",
  ],
  nivel3: [
    "¡Plano completo! El equipo de desarrollo ya puede empezar.",
    "¡Arquitectura lista! Así se diseña un sistema de verdad.",
  ],
};

function BlueprintIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 9v12M3 15h18" />
      <path d="M13 13h4v4h-4z" fill="currentColor" />
    </svg>
  );
}

export default function ArquitectoRetoPage() {
  const [paso, setPaso] = useState<Paso>("intro");
  const [puntajes, setPuntajes] = useState<[number, number, number]>([0, 0, 0]);
  const [mensajeEmergente, setMensajeEmergente] = useState<string | null>(null);

  const total = puntajes[0] + puntajes[1] + puntajes[2];

  function avanzar(nivel: 0 | 1 | 2, score: number) {
    const siguientes: [number, number, number] = [...puntajes];
    siguientes[nivel] = score;
    setPuntajes(siguientes);

    const claveNivel = (["nivel1", "nivel2", "nivel3"] as const)[nivel];
    saveActivityScore("arquitecto", claveNivel, score);

    const siguientePaso: Paso = nivel === 0 ? "nivel2" : nivel === 1 ? "nivel3" : "resultado";
    if (siguientePaso === "resultado") {
      saveActivityScore("arquitecto", "score", siguientes[0] + siguientes[1] + siguientes[2]);
      completeStage(2);
      anunciarCierrePersonaje("arquitecto", 1500);
    }
    setPaso(siguientePaso);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const opciones = MENSAJES[claveNivel];
    setMensajeEmergente(opciones[Math.floor(Math.random() * opciones.length)]);
    setTimeout(() => setMensajeEmergente(null), 4000);
  }

  function reiniciar() {
    setPuntajes([0, 0, 0]);
    setPaso("intro");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const progreso =
    paso === "intro" ? 0 : paso === "nivel1" ? 1 : paso === "nivel2" ? 2 : paso === "nivel3" ? 3 : 4;

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-br from-white to-brand-light px-4 py-8">
      <div className="mb-6 flex w-full max-w-7xl items-center justify-between">
        <Link
          href="/retos"
          className="flex items-center gap-1 text-sm font-semibold text-brand-support/80 transition-colors hover:text-brand-primary"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver a los retos
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-3 w-3 rounded-full border-2 border-brand-primary transition-all ${
                  progreso > i || paso === "resultado" ? "bg-brand-primary" : progreso === i ? "bg-brand-mid" : "bg-transparent"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-brand-support/70">
            {Math.min(Math.max(progreso - 1, 0), 3)}/3 niveles
          </span>
        </div>
      </div>

      {mensajeEmergente && (
        <div className="fixed right-4 top-4 z-50 max-w-sm animate-fade-in rounded-lg bg-brand-primary px-6 py-3 text-white shadow-lg">
          <p className="text-sm font-medium">{mensajeEmergente}</p>
        </div>
      )}

      <div className="w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl 2xl:max-w-[1400px]">
        <div
          className="px-8 py-6 text-white"
          style={{ background: "linear-gradient(90deg, var(--brand-primary) 0%, var(--brand-fin) 100%)" }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-white bg-white/20 shadow-inner">
              <BlueprintIcon className="h-8 w-8" />
            </div>
            <div>
              <div className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-white/80">
                Rol del equipo
              </div>
              <h1 className="text-3xl font-extrabold">Arquitecto de Software</h1>
              <div className="text-sm font-medium text-white/80">
                Feria de Cali - Diseño del plano de la app oficial
              </div>
            </div>
            {paso !== "intro" && paso !== "resultado" && (
              <div className="ml-auto text-right">
                <div className="text-xs text-white/80">Puntaje</div>
                <div className="text-2xl font-black">{total} pts</div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          {paso === "intro" && (
            <div className="mx-auto w-full max-w-4xl">
              <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl shadow-brand-primary/20 backdrop-blur-md sm:p-10">
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-support">
                    Misión - Feria de Cali - ~15 min
                  </span>
                  <h2 className="mt-4 text-2xl font-black tracking-tight text-brand-support sm:text-3xl">
                    Diseña el plano de la app de la Feria
                  </h2>
                  <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-brand-support/80 sm:text-base">
                    La Alcaldía quiere crear la <strong>app oficial de la Feria de
                    Cali</strong> para vender boletas y seguir los desfiles, y
                    contrató a tu equipo. Tú eres el{" "}
                    <strong>arquitecto de software</strong>: igual que un
                    arquitecto dibuja el plano antes de construir un edificio,
                    tú vas a diseñar el plano del programa antes de que alguien
                    escriba código.
                  </p>
                </div>

                <h3 className="mt-8 text-sm font-bold uppercase tracking-wide text-brand-support">
                  Las 4 ideas que vas a usar
                </h3>
                <div className="mt-3 overflow-x-auto rounded-2xl border border-brand-soft">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b-2 border-brand-soft bg-brand-light/40 text-xs font-bold uppercase tracking-wide text-brand-support">
                        <th className="px-4 py-3">Idea</th>
                        <th className="px-4 py-3">Qué es</th>
                        <th className="px-4 py-3">En la Feria</th>
                      </tr>
                    </thead>
                    <tbody>
                      {GLOSARIO.map((fila) => (
                        <tr key={fila.palabra} className="border-b border-brand-soft/40 text-brand-support last:border-0">
                          <td className="whitespace-nowrap px-4 py-3 font-black text-brand-primary">{fila.palabra}</td>
                          <td className="px-4 py-3">{fila.significado}</td>
                          <td className="px-4 py-3">{fila.ejemplo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {NIVELES.map((n) => (
                    <div key={n.titulo} className="rounded-xl border border-brand-soft bg-brand-light/40 p-4 text-left">
                      <div className="mb-2 flex items-center justify-between">
                        <BlueprintIcon className="h-6 w-6 text-brand-primary" />
                        <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold text-brand-support">
                          {n.tiempo}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-brand-support">{n.titulo}</div>
                      <div className="mt-1 text-xs text-brand-support/80">{n.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-brand-mid/50 bg-brand-soft/30 p-4 text-left text-sm text-brand-support">
                  <strong>Puntuación máxima: {PUNTAJE_MAXIMO_TOTAL} pts.</strong> Cada
                  nivel vale hasta <strong>100 pts</strong>. Cada intento fallido
                  resta {PENALIDAD_FALLO} pts y cada pista {PENALIDAD_PISTA} pts.
                  Al final verás tu trabajo convertido en un plano real.
                </div>

                <button
                  type="button"
                  onClick={() => setPaso("nivel1")}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-10 py-4 text-lg font-bold text-white shadow-xl shadow-brand-primary/30 transition-all duration-300 hover:bg-brand-support"
                >
                  ¡Comenzar misión!
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {paso === "nivel1" && <Nivel1MoldeOEjemplo onComplete={(s) => avanzar(0, s)} />}
          {paso === "nivel2" && <Nivel2Caracteristicas onComplete={(s) => avanzar(1, s)} />}
          {paso === "nivel3" && <Nivel3Conexiones onComplete={(s) => avanzar(2, s)} />}
          {paso === "resultado" && <PlanoFinal puntajes={puntajes} onReintentar={reiniciar} />}
        </div>
      </div>
    </main>
  );
}
