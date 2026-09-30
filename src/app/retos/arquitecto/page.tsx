"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Nivel1MoldeOEjemplo from "@/components/game/arquitecto/Nivel1MoldeOEjemplo";
import Nivel2Caracteristicas from "@/components/game/arquitecto/Nivel2Caracteristicas";
import Nivel3Conexiones from "@/components/game/arquitecto/Nivel3Conexiones";
import PlanoFinal, { PUNTAJE_MAXIMO_TOTAL } from "@/components/game/arquitecto/PlanoFinal";
import { PENALIDAD_FALLO, PENALIDAD_PISTA } from "@/components/game/arquitecto/ArquitectoUI";
import { saveActivityScore } from "@/lib/game-storage";
import { completeStage } from "@/lib/ruta-progress";
import { continuarConCierre } from "@/lib/personajes";
import FotoPolaroid from "@/components/retos/FotoPolaroid";

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
    icono: "🧩",
    titulo: "Nivel 1 - ¿Molde o ejemplo?",
    desc: "Separa los tipos de cosa de los ejemplos reales de la Feria.",
  },
  {
    icono: "🏷️",
    titulo: "Nivel 2 - ¿Qué lo describe?",
    desc: "Dale a cada molde sus características.",
  },
  {
    icono: "🔗",
    titulo: "Nivel 3 - ¿Cómo se conectan?",
    desc: "Une los moldes con la acción correcta.",
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

export default function ArquitectoRetoPage() {
  const router = useRouter();
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
    <main className="fondo-plano flex min-h-screen flex-col items-center px-4 py-8">
      <div className="mb-6 flex w-full max-w-7xl items-center justify-between">
        <Link
          href="/retos"
          className="flex items-center gap-1 text-sm font-semibold text-white/80 transition-colors hover:text-white"
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
                className={`h-3 w-3 rounded-full border-2 border-white transition-all ${
                  progreso > i || paso === "resultado" ? "bg-white" : progreso === i ? "bg-brand-mid" : "bg-transparent"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-white/70">
            {Math.min(Math.max(progreso - 1, 0), 3)}/3 niveles
          </span>
        </div>
      </div>

      {mensajeEmergente && (
        <div className="fixed right-4 top-4 z-50 max-w-sm animate-fade-in rounded-lg bg-brand-primary px-6 py-3 text-white shadow-lg">
          <p className="text-sm font-medium">{mensajeEmergente}</p>
        </div>
      )}

      <div className="hoja-plano w-full max-w-7xl border-2 border-white/90 shadow-[0_0_0_6px_rgba(255,255,255,0.12)] 2xl:max-w-[1400px]">
        <header className="border-b-2 border-brand-support/80 text-brand-support">
          <div className="relative flex items-end justify-between gap-4 border-b border-brand-support/60 px-6 pt-5 sm:px-8 lg:min-h-[14rem]">
            <div className="pb-5 lg:self-center">
              <div className="font-mono text-[11px] tracking-wider text-brand-support/60">
                PLANO N.º 02 / DISEÑO DE CLASES
              </div>
              <h1 className="mt-1 text-3xl font-black leading-tight sm:text-4xl">
                Arquitecto de Software
              </h1>
            </div>
            <Image
              src="/personajes/arquitecto.webp"
              alt="Arquitecto de Software"
              width={601}
              height={560}
              priority
              className="pointer-events-none -mb-px hidden h-32 w-auto sm:block lg:h-52"
            />
            <div
              className="pointer-events-none absolute right-[11rem] top-9 hidden -rotate-[4deg] border-2 border-brand-soft/80 bg-white/85 font-mono text-[10px] leading-tight text-brand-soft lg:block"
              aria-hidden="true"
            >
              <div className="border-b-2 border-brand-soft/80 px-2 py-0.5 text-center font-bold">Feria</div>
              <div className="px-2 py-0.5">
                <div>+ fecha</div>
                <div>+ lugar</div>
              </div>
            </div>
            <FotoPolaroid
              src="/media/eventos/feria-cali-salsodromo.jpg"
              alt="Desfile nocturno del Salsódromo por la Autopista Suroriental en la Feria de Cali, con bailarines y tribunas llenas de público"
              pie="Feria de Cali"
              ancho={1280}
              alto={990}
              giro={2.5}
              anchoMarco="w-52"
              className="absolute right-[17rem] top-1/2 hidden -translate-y-1/2 lg:block"
            />
          </div>
          <dl className="grid grid-cols-2 divide-brand-support/60 font-mono text-xs sm:grid-cols-4 sm:divide-x">
            <div className="border-b border-brand-support/60 px-6 py-2.5 sm:border-b-0 sm:px-8">
              <dt className="text-[10px] text-brand-support/60">PROYECTO</dt>
              <dd className="font-bold">App Feria de Cali</dd>
            </div>
            <div className="border-b border-brand-support/60 px-6 py-2.5 sm:border-b-0">
              <dt className="text-[10px] text-brand-support/60">ESCALA</dt>
              <dd className="font-bold">3 niveles</dd>
            </div>
            <div className="px-6 py-2.5 sm:px-6">
              <dt className="text-[10px] text-brand-support/60">ESTADO</dt>
              <dd className="font-bold">{paso === "resultado" ? "Entregado" : paso === "intro" ? "Por iniciar" : "En dibujo"}</dd>
            </div>
            <div className="px-6 py-2.5">
              <dt className="text-[10px] text-brand-support/60">PUNTAJE</dt>
              <dd className="font-bold">{paso === "intro" ? "-" : `${total} pts`}</dd>
            </div>
          </dl>
        </header>

        <div className="p-4 md:p-6 lg:p-8">
          {paso === "intro" && (
            <div className="mx-auto w-full max-w-4xl">
              <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl shadow-brand-primary/20 backdrop-blur-md sm:p-10">
                <div className="text-center">
                  <span className="etiqueta">
                    Misión
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
                      <div className="mb-2">
                        <span className="text-2xl leading-none" aria-hidden="true">{n.icono}</span>
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
          {paso === "resultado" && <PlanoFinal puntajes={puntajes} onReintentar={reiniciar} onContinuar={() => continuarConCierre("arquitecto", router.push)} />}
        </div>
      </div>
    </main>
  );
}
