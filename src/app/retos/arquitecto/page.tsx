"use client";

import { useState } from "react";
import Link from "next/link";
import Actividad1DiagramaClases from "@/components/game/arquitecto/Actividad1DiagramaClases";
import Actividad2AsignarAtributos from "@/components/game/arquitecto/Actividad2AsignarAtributos";
import { MedalIcon, TrophyIcon } from "@/components/game/icons";
import { saveActivityScore } from "@/lib/game-storage";

type Paso = "intro" | "actividad1" | "actividad2" | "resultado";

export default function ArquitectoRetoPage() {
  const [paso, setPaso] = useState<Paso>("intro");
  const [scoreA1, setScoreA1] = useState(0);
  const [scoreA2, setScoreA2] = useState(0);
  const [mensajeEmergente, setMensajeEmergente] = useState<string | null>(null);

  const handleA1Complete = (score: number) => {
    setScoreA1(score);
    setPaso("actividad2");
    window.scrollTo({ top: 0, behavior: "smooth" });

    saveActivityScore("arquitecto", "actividad-1", score);

    const mensajes = [
      "¡Excelente! Como un técnico que define las posiciones, has identificado las clases del sistema.",
      "¡Bien hecho! Ahora vamos a detallar cada clase con sus atributos específicos.",
      "¡Perfecto! Has diseñado la estructura básica como un arquitecto diseña los planos.",
    ];
    setMensajeEmergente(mensajes[Math.floor(Math.random() * mensajes.length)]);
    setTimeout(() => setMensajeEmergente(null), 4000);
  };

  const handleA2Complete = (score: number) => {
    setScoreA2(score);
    setPaso("resultado");
    window.scrollTo({ top: 0, behavior: "smooth" });

    const total = scoreA1 + score;
    saveActivityScore("arquitecto", "score", total);

    const mensajes = [
      "¡Increíble! Has completado el diseño arquitectónico del sistema.",
      "¡Perfecto! Como un arquitecto que finaliza su obra, has organizado toda la estructura.",
      "¡Excelente trabajo! Has diseñado un sistema tan bien estructurado como un equipo campeón.",
    ];
    setMensajeEmergente(mensajes[Math.floor(Math.random() * mensajes.length)]);
    setTimeout(() => setMensajeEmergente(null), 4000);
  };

  const totalScore = scoreA1 + scoreA2;

  const getNivel = () => {
    if (totalScore >= 180) {
      return {
        label: "Arquitecto Maestro — Diseño Estructural Perfecto",
        color: "text-amber-600",
        bg: "border-amber-300 bg-amber-50",
      };
    }
    if (totalScore >= 120) {
      return {
        label: "Arquitecto Competente — Estructura Sólida",
        color: "text-brand-primary",
        bg: "border-brand-mid bg-brand-soft/30",
      };
    }
    return {
      label: "Arquitecto Junior — Necesita Mejorar la Visión",
      color: "text-orange-600",
      bg: "border-orange-200 bg-orange-50",
    };
  };

  const progreso = paso === "intro" ? 0 : paso === "actividad1" ? 1 : paso === "actividad2" ? 2 : 3;

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-br from-brand-primary via-brand-support to-brand-mid px-4 py-8">
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
                  progreso >= i ? "bg-brand-light" : "bg-white/20"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-white/70">
            {Math.min(progreso, 2)}/2 actividades
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
          style={{ background: "linear-gradient(90deg, #45609B 0%, #719FC1 100%)" }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white/20 text-3xl shadow-inner">
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 9v12M3 15h18" />
                <path d="M13 13h4v4h-4z" fill="currentColor" />
              </svg>
            </div>
            <div>
              <div className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-white/80">
                Rol del equipo
              </div>
              <h1 className="text-3xl font-extrabold">Arquitecto</h1>
              <div className="text-sm font-medium text-white/80">
                Arquitecto de Software · Diseño Estructural y Patrones
              </div>
            </div>
            {paso !== "intro" && paso !== "resultado" && (
              <div className="ml-auto text-right">
                <div className="text-xs text-white/80">Score parcial</div>
                <div className="text-2xl font-black">{scoreA1} pts</div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          {paso === "intro" && (
            <div className="text-center">
              <p className="mx-auto mb-6 max-w-xl text-base leading-relaxed text-brand-support">
                El <strong>Arquitecto de Software</strong> es el estratega del
                equipo: diseña la estructura del sistema, define las clases y sus
                relaciones, y establece los patrones que guiarán todo el
                desarrollo.
              </p>
              <div className="mb-6 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
                {[
                  {
                    title: "Actividad 1 — Diagrama de Clases",
                    desc: "Organiza las clases principales en el diagrama arquitectónico",
                  },
                  {
                    title: "Actividad 2 — Asignación de Atributos",
                    desc: "Define los atributos correctos para cada clase",
                  },
                ].map((a) => (
                  <div
                    key={a.title}
                    className="rounded-xl border border-brand-soft bg-brand-light/40 p-4"
                  >
                    <div className="mb-2 text-2xl">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand-primary" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18M9 9v12M3 15h18" />
                        <path d="M13 13h4v4h-4z" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="text-sm font-bold text-brand-support">{a.title}</div>
                    <div className="mt-1 text-xs text-brand-support/80">{a.desc}</div>
                  </div>
                ))}
              </div>
              <div className="mb-6 rounded-xl border border-brand-mid/50 bg-brand-soft/30 p-4 text-left text-sm text-brand-support">
                <strong>Puntuación máxima: 200 pts.</strong> Cada actividad vale
                hasta <strong>100 pts</strong>. Las decisiones incorrectas
                significan <em>arquitectura confusa</em> o{" "}
                <em>sistema desestructurado</em> — 0 pts.
              </div>
              <button
                type="button"
                onClick={() => setPaso("actividad1")}
                className="rounded-full bg-brand-primary px-10 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-brand-mid active:scale-95"
              >
                ¡Comenzar reto!
              </button>
            </div>
          )}

          {paso === "actividad1" && <Actividad1DiagramaClases onComplete={handleA1Complete} />}

          {paso === "actividad2" && <Actividad2AsignarAtributos onComplete={handleA2Complete} />}

          {paso === "resultado" && (() => {
            const nivel = getNivel();
            const total = totalScore;
            return (
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  {total >= 180 ? (
                    <span className="text-amber-500">
                      <TrophyIcon className="h-16 w-16" />
                    </span>
                  ) : total >= 120 ? (
                    <span className="text-brand-support">
                      <MedalIcon medalla={2} className="h-16 w-16" />
                    </span>
                  ) : (
                    <span className="text-orange-500">
                      <MedalIcon medalla={3} className="h-16 w-16" />
                    </span>
                  )}
                </div>
                <h2 className="mb-2 text-3xl font-extrabold text-brand-support">
                  ¡Reto Completado!
                </h2>
                <p className="mb-6 text-brand-support/80">
                  Has completado las 2 actividades del rol{" "}
                  <strong>Arquitecto de Software</strong>
                </p>

                <div className="mb-6 grid grid-cols-3 gap-3">
                  {[
                    { label: "Diagrama de Clases", score: scoreA1, bold: false },
                    { label: "Asignación de Atributos", score: scoreA2, bold: false },
                    { label: "Total", score: total, bold: true },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`rounded-xl border p-4 ${
                        item.bold
                          ? "border-brand-primary bg-brand-soft/30"
                          : "border-brand-soft bg-brand-light/40"
                      }`}
                    >
                      <div
                        className={`text-2xl font-black ${
                          item.bold
                            ? "text-brand-primary"
                            : item.score === 0
                              ? "text-red-500"
                              : "text-brand-support"
                        }`}
                      >
                        {item.score} pts
                      </div>
                      <div className="text-xs text-brand-support/80">{item.label}</div>
                    </div>
                  ))}
                </div>

                <div className={`mb-6 inline-block rounded-xl border-2 px-6 py-3 ${nivel.bg}`}>
                  <span className={`text-lg font-extrabold ${nivel.color}`}>
                    {nivel.label}
                  </span>
                </div>

                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setPaso("intro");
                      setScoreA1(0);
                      setScoreA2(0);
                    }}
                    className="rounded-full border-2 border-brand-soft px-6 py-3 font-bold text-brand-support transition-all hover:border-brand-support"
                  >
                    Reintentar Arquitectura
                  </button>
                  <Link
                    href="/retos"
                    className="flex flex-col items-center rounded-full bg-brand-primary px-8 py-3 font-bold text-white shadow-md transition-all hover:bg-brand-mid"
                  >
                    <span>Volver a los retos</span>
                  </Link>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </main>
  );
}