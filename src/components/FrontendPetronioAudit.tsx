"use client";

import Link from "next/link";
import { useState } from "react";
import AppSimulator, { renderScene } from "@/components/AppSimulator";
import { completeStage } from "@/lib/ruta-progress";
import { anunciarCierrePersonaje } from "@/lib/personajes";

type Phase = "quiz" | "results";

interface Option {
  id: string;
  title: string;
  correct: boolean;
}

interface Question {
  id: string;
  heuristica: string;
  caso: string;
  options: Option[];
  justification: string;
}

const QUESTIONS: Question[] = [
  {
    id: "q1",
    heuristica: "Visibilidad del estado del sistema",
    caso:
      "Un usuario pulsa el botón \"Reproducir Marimba\" en la app, pero la canción tarda 3 segundos en cargar por la congestión de red del festival.",
    justification:
      "El sistema siempre debe informar al usuario en tiempo real qué está sucediendo mediante retroalimentación inmediata, evitando que presione el botón varias veces pensando que falló.",
    options: [
      { id: "a", title: "Botón estático mientras carga", correct: false },
      { id: "b", title: "Carga visible con animación", correct: true },
      { id: "c", title: "Pantalla en blanco", correct: false }
    ]
  },
  {
    id: "q2",
    heuristica: "Contraste y accesibilidad de color (WCAG)",
    caso:
      "La presentación de las 10:00 PM acaba de iniciar en tarima y la información debe poder leerse sin esfuerzo por cualquier persona.",
    justification:
      "Un contraste alto garantiza que la información clave (horarios y artistas) sea legible tanto para personas con baja agudeza visual como bajo la luz solar directa o pantallas con poco brillo.",
    options: [
      { id: "a", title: "Amarillo sobre blanco", correct: false },
      { id: "b", title: "Blanco sobre azul petróleo", correct: true },
      { id: "c", title: "Gris claro sobre gris medio", correct: false }
    ]
  },
  {
    id: "q3",
    heuristica: "Consistencia y estándares",
    caso:
      "Diseñar los controles de reproducción de música (Play, Pausa, Siguiente) en la app del festival.",
    justification:
      "La consistencia con los estándares de la industria permite que los usuarios reconozcan y operen los controles al instante, sin tener que aprender una simbología nueva.",
    options: [
      { id: "a", title: "Iconos invertidos", correct: false },
      { id: "b", title: "Palabras extensas", correct: false },
      { id: "c", title: "Iconos universales", correct: true }
    ]
  },
  {
    id: "q4",
    heuristica: "Prevención de errores y deshacer",
    caso:
      "El usuario tiene su lista de \"Mis Canciones Favoritas del Petronio\" y toca el icono de la papelera para quitar una canción.",
    justification:
      "Prevenir acciones destructivas involuntarias y permitir revertir descuidos da seguridad al usuario y reduce la frustración al interactuar con listas personalizadas.",
    options: [
      { id: "a", title: "Borrado inmediato sin aviso", correct: false },
      { id: "b", title: "Confirmación con deshacer", correct: true },
      { id: "c", title: "Cierre de sesión automático", correct: false }
    ]
  },
  {
    id: "q5",
    heuristica: "Jerarquía visual y botones",
    caso:
      "En la pantalla de reserva para el concierto estelar hay dos acciones: \"Confirmar Reserva\" (principal) y \"Cancelar\" (secundaria).",
    justification:
      "La jerarquía visual guía la vista del usuario hacia la acción principal deseada, reduciendo la carga cognitiva y evitando clics accidentales en la opción secundaria.",
    options: [
      { id: "a", title: "Dos botones idénticos", correct: false },
      { id: "b", title: "Primaria sólida y secundaria neutra", correct: true },
      { id: "c", title: "Secundaria gigante y primaria oculta", correct: false }
    ]
  },
  {
    id: "q6",
    heuristica: "Reconocimiento antes que recuerdo",
    caso:
      "El usuario quiere buscar grupos de música tradicional por categoría de instrumentos en el festival (ej. \"Violines Caucanos\").",
    justification:
      "Es mucho más fácil para el cerebro humano reconocer opciones visibles en pantalla que recordar términos exactos de memoria.",
    options: [
      { id: "a", title: "Campo de texto vacío", correct: false },
      { id: "b", title: "Filtros visibles en chips", correct: true },
      { id: "c", title: "Manual en PDF", correct: false }
    ]
  }
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function FrontendPetronioAudit({
  showIntro
}: {
  showIntro: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("quiz");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(QUESTIONS.length).fill(null)
  );

  const current = QUESTIONS[currentIndex];
  const isLast = currentIndex === QUESTIONS.length - 1;
  const score = QUESTIONS.reduce((acc, question, index) => {
    const optionId = answers[index];
    const correct = question.options.find((option) => option.id === optionId)?.correct ?? false;
    return acc + (correct ? 1 : 0);
  }, 0);

  const handleSelect = (optionId: string) => {
    if (phase !== "quiz") return;
    setSelected(optionId);
  };

  const handleNext = () => {
    if (selected === null) return;
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = selected;
    setAnswers(nextAnswers);

    if (isLast) {
      setPhase("results");
      completeStage(3);
      anunciarCierrePersonaje("frontend", 1500);
      return;
    }
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setSelected(nextAnswers[nextIndex]);
  };

  return (
    <div className="relative">
      <div
        className={
          showIntro
            ? "select-none rounded-3xl border border-white/60 bg-white/80 p-5 shadow-2xl shadow-brand-primary/20 backdrop-blur-md blur-[3px] brightness-75 sm:p-7"
            : "animate-fade-in rounded-3xl border border-white/60 bg-white/80 p-5 shadow-2xl shadow-brand-primary/20 backdrop-blur-md sm:p-7"
        }
        aria-hidden={showIntro}
      >
        <div className="mb-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-support/70">
            App oficial &quot;Sonoridades del Pacífico&quot;
          </div>
          <h2 className="text-xl font-black text-brand-support">
            Mejora la interfaz y la usabilidad
          </h2>
        </div>

        {phase === "quiz" && (
          <>
            <div className="mb-6">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-brand-support">
                <span>Pregunta {currentIndex + 1} de {QUESTIONS.length}</span>
                <span className="rounded-full bg-brand-soft/40 px-3 py-1 text-xs uppercase tracking-widest text-brand-support">
                  {current.heuristica}
                </span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-brand-soft/30">
                <div
                  className="h-full rounded-full bg-brand-primary transition-all duration-500"
                  style={{ width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="w-full">
                <p className="text-center text-base leading-relaxed text-brand-support">{current.caso}</p>
                <p className="mt-1 text-center text-sm font-bold text-brand-support">
                  ¿Cuál opción es la correcta?
                </p>
              </div>

              <div className="w-full">
                <AppSimulator questionIndex={currentIndex} selectedOptionId={selected} />
              </div>

              <div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {current.options.map((option) => {
                    const isSelected = selected === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelect(option.id)}
                        aria-pressed={isSelected}
                        className={`flex w-full flex-col gap-2 rounded-2xl border-2 bg-white p-3 text-left transition-all ${
                          isSelected
                            ? "border-brand-primary bg-brand-primary/5 shadow-lg ring-4 ring-brand-primary/15"
                            : "border-brand-soft/60 hover:border-brand-primary/60 hover:shadow-md"
                        }`}
                      >
                        <div className="flex min-h-[112px] items-center justify-center rounded-xl bg-slate-50 px-3 py-3">
                          {renderScene(currentIndex, option.id)}
                        </div>
                        <span className="flex items-center gap-2 text-xs font-bold text-brand-support">
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                              isSelected ? "border-brand-primary bg-brand-primary" : "border-brand-soft"
                            }`}
                          >
                            {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                          </span>
                          {option.title}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-7 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={selected === null}
                    className="rounded-xl bg-brand-primary px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-brand-support disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                  >
                    {isLast ? "Finalizar" : "Siguiente"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {phase === "results" && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="inline-flex items-center rounded-full bg-amber-200/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
                Actividad completada
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-brand-support">
                {score}/6 aciertos
              </h2>
              <p className="mt-2 text-sm text-brand-support/80">
                Revisa cada decisión de interfaz y su justificación técnica.
              </p>
            </div>

            <div className="space-y-4">
              {QUESTIONS.map((question, index) => {
                const chosenId = answers[index];
                const chosen = question.options.find((option) => option.id === chosenId);
                const isCorrect = chosen?.correct ?? false;
                const correctOption = question.options.find((option) => option.correct);

                return (
                  <div
                    key={question.id}
                    className={`rounded-2xl border-2 p-4 ${
                      isCorrect ? "border-emerald-300 bg-emerald-50/70" : "border-rose-300 bg-rose-50/70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-widest text-brand-support/70">
                          Pregunta {index + 1} - {question.heuristica}
                        </div>
                        <p className="mt-1 text-sm font-semibold text-brand-support">{question.caso}</p>
                      </div>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${
                        isCorrect ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                      >
                        {isCorrect ? <CheckIcon /> : <CrossIcon />}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-2 text-xs font-semibold text-brand-support sm:grid-cols-2">
                      <div className="rounded-xl bg-white/80 px-3 py-2">
                        <span className="text-brand-support/60">Elegida: </span>
                        {chosen ? chosen.title : "Sin responder"}
                      </div>
                      {!isCorrect && correctOption && (
                        <div className="rounded-xl bg-white/80 px-3 py-2">
                          <span className="text-brand-support/60">Correcta: </span>
                          <span className="text-emerald-700">{correctOption.title}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex gap-2 rounded-xl bg-white/80 px-3 py-2 text-xs leading-relaxed text-brand-support/90">
                      <span aria-hidden="true">💡</span>
                      <span>{question.justification}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPhase("quiz");
                  setCurrentIndex(0);
                  setSelected(null);
                  setAnswers(Array(QUESTIONS.length).fill(null));
                }}
                className="rounded-xl border border-brand-soft bg-white px-6 py-3 text-sm font-bold text-brand-support transition-colors hover:bg-brand-soft/20"
              >
                Reintentar actividad
              </button>
              <Link
                href="/retos"
                className="rounded-xl bg-brand-primary px-8 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-brand-support"
              >
                Continuar
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}