"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

type Phase = "intro" | "quiz" | "results";

interface Option {
  id: string;
  title: string;
  correct: boolean;
  render: () => ReactNode;
}

interface Question {
  id: string;
  heuristica: string;
  caso: string;
  options: Option[];
  justification: string;
}

const SPINNER = (
  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
);

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M5 5l11 7-11 7zM18 5h2v14h-2z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

const QUESTIONS: Question[] = [
  {
    id: "q1",
    heuristica: "Visibilidad del estado del sistema",
    caso:
      "Un usuario pulsa el botón \"Reproducir Marimba de Chonta\" en la app, pero la canción tarda 3 segundos en cargar por la congestión de red del festival.",
    justification:
      "El sistema siempre debe informar al usuario en tiempo real qué está sucediendo mediante retroalimentación inmediata, evitando que presione el botón varias veces pensando que falló.",
    options: [
      {
        id: "a",
        title: "Botón estático mientras carga",
        correct: false,
        render: () => (
          <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm">
            <PlayIcon />
            Reproducir Marimba de Chonta
          </div>
        )
      },
      {
        id: "b",
        title: "Carga visible con animación",
        correct: true,
        render: () => (
          <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white opacity-90">
            {SPINNER} Cargando audio...
          </div>
        )
      },
      {
        id: "c",
        title: "Pantalla en blanco",
        correct: false,
        render: () => (
          <div className="flex h-12 w-full items-center justify-center rounded-xl bg-white text-xs text-slate-300">
            (pantalla vacía)
          </div>
        )
      }
    ]
  },
  {
    id: "q2",
    heuristica: "Contraste y accesibilidad de color (WCAG)",
    caso:
      "Diseñar la tarjeta del horario de la noche para la tarima principal, visible bajo el brillo de las luces del escenario.",
    justification:
      "Un contraste alto garantiza que la información clave (horarios y artistas) sea legible tanto para personas con baja agudeza visual como bajo la luz solar directa o pantallas con poco brillo.",
    options: [
      {
        id: "a",
        title: "Amarillo sobre blanco",
        correct: false,
        render: () => (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#FFFF00" }}>
              8:00 PM · Tarima Principal
            </div>
            <div className="text-sm font-bold" style={{ color: "#FFFF00" }}>
              Marimba de Chonta
            </div>
          </div>
        )
      },
      {
        id: "b",
        title: "Blanco sobre azul petróleo",
        correct: true,
        render: () => (
          <div
            className="rounded-xl px-4 py-3 text-left shadow-sm"
            style={{ backgroundColor: "#0F172A" }}
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-white">
              8:00 PM · Tarima Principal
            </div>
            <div className="text-sm font-bold text-white">
              Marimba de Chonta
            </div>
          </div>
        )
      },
      {
        id: "c",
        title: "Gris claro sobre gris medio",
        correct: false,
        render: () => (
          <div
            className="rounded-xl px-4 py-3 text-left"
            style={{ backgroundColor: "#737373" }}
          >
            <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#A3A3A3" }}>
              8:00 PM · Tarima Principal
            </div>
            <div className="text-sm font-bold" style={{ color: "#A3A3A3" }}>
              Marimba de Chonta
            </div>
          </div>
        )
      }
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
      {
        id: "a",
        title: "Iconos invertidos",
        correct: false,
        render: () => (
          <div className="flex items-center justify-center gap-3 py-1">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white">
              <PlayIcon />
            </span>
            <span className="text-xs font-semibold text-slate-600">Pausa</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-800 text-transparent">
              <PlayIcon />
            </span>
            <span className="text-xs font-semibold text-slate-600">Play</span>
          </div>
        )
      },
      {
        id: "b",
        title: "Palabras extensas",
        correct: false,
        render: () => (
          <div className="flex flex-col items-center gap-1.5 py-1">
            <span className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
              Iniciar audición musical
            </span>
            <span className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
              Suspender audición musical
            </span>
          </div>
        )
      },
      {
        id: "c",
        title: "Iconos universales",
        correct: true,
        render: () => (
          <div className="flex items-center justify-center gap-3 py-1">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
              <PlayIcon />
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
              <PauseIcon />
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
              <NextIcon />
            </span>
          </div>
        )
      }
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
      {
        id: "a",
        title: "Borrado inmediato sin aviso",
        correct: false,
        render: () => (
          <div className="space-y-1.5 py-1">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 line-through">
              Son de Mazo · Grupo Bahía
              <span className="text-slate-300"><TrashIcon /></span>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-400">
              Son de Mazo · Grupo Bahía
            </div>
          </div>
        )
      },
      {
        id: "b",
        title: "Confirmación con deshacer",
        correct: true,
        render: () => (
          <div className="space-y-1.5 py-1">
            <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
              <span className="truncate">Son de Mazo · Grupo Bahía</span>
              <span className="shrink-0 text-slate-400"><TrashIcon /></span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-medium text-white">
              <span>¿Eliminar de favoritos?</span>
              <span className="shrink-0 rounded-md bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm">
                Deshacer
              </span>
            </div>
          </div>
        )
      },
      {
        id: "c",
        title: "Cierre de sesión automático",
        correct: false,
        render: () => (
          <div className="rounded-xl bg-red-600 px-3 py-4 text-center text-sm font-bold text-white">
            Tu sesión se cerró por seguridad
          </div>
        )
      }
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
      {
        id: "a",
        title: "Dos botones idénticos",
        correct: false,
        render: () => (
          <div className="grid grid-cols-1 gap-2 py-1">
            <div className="w-full rounded-xl bg-red-600 px-4 py-3 text-center text-sm font-bold text-white">
              Confirmar Reserva
            </div>
            <div className="w-full rounded-xl bg-red-600 px-4 py-3 text-center text-sm font-bold text-white">
              Cancelar
            </div>
          </div>
        )
      },
      {
        id: "b",
        title: "Primaria sólida y secundaria neutra",
        correct: true,
        render: () => (
          <div className="flex flex-col gap-2 py-1">
            <div className="w-full rounded-xl bg-brand-primary px-4 py-3 text-center text-sm font-bold text-white shadow-lg">
              Confirmar Reserva
            </div>
            <div className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-600">
              Cancelar
            </div>
          </div>
        )
      },
      {
        id: "c",
        title: "Secundaria gigante y primaria oculta",
        correct: false,
        render: () => (
          <div className="flex flex-col items-center gap-2 py-1">
            <div className="w-full rounded-xl bg-red-600 px-4 py-3 text-center text-base font-black text-white">
              Cancelar
            </div>
            <div className="rounded-md bg-slate-200 px-3 py-1 text-[10px] font-semibold text-slate-400">
              Confirmar Reserva
            </div>
          </div>
        )
      }
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
      {
        id: "a",
        title: "Campo de texto vacío",
        correct: false,
        render: () => (
          <div className="py-1">
            <div className="rounded-xl border-2 border-slate-300 bg-white px-3 py-3 text-xs font-semibold text-slate-400">
              Escribe el nombre exacto de la modalidad (ej. Violines Caucanos)...
            </div>
          </div>
        )
      },
      {
        id: "b",
        title: "Filtros visibles en chips",
        correct: true,
        render: () => (
          <div className="flex flex-wrap gap-1.5 py-1">
            {["Marimba", "Chirimía", "Cantos Tradicionales", "Violines Caucanos"].map((chip) => (
              <span key={chip} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
                <MusicIcon />
                {chip}
              </span>
            ))}
          </div>
        )
      },
      {
        id: "c",
        title: "Manual en PDF",
        correct: false,
        render: () => (
          <div className="mx-auto w-4/5 py-1">
            <div className="rounded-xl border-2 border-slate-300 bg-slate-100 p-2">
              <div className="mx-auto h-16 w-4/5 rounded-sm bg-white shadow" />
              <div className="mt-2 h-1.5 w-full rounded bg-slate-300" />
              <div className="mt-1 h-1.5 w-3/4 rounded bg-slate-300" />
              <div className="mt-2 rounded bg-red-600 px-2 py-1 text-center text-xs font-bold text-white">
                Manual de categorías · 20 páginas
              </div>
            </div>
          </div>
        )
      }
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

function renderOptionPreview(option: Option) {
  return <div className="flex min-h-[88px] items-center justify-center rounded-xl bg-slate-50 px-3 py-3">{option.render()}</div>;
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
            Auditoría de interfaz y usabilidad
          </h2>
        </div>

        {phase === "quiz" && (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm font-bold text-brand-support">
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

            <p className="text-base leading-relaxed text-brand-support">{current.caso}</p>
            <p className="mt-1 text-sm font-semibold text-brand-support/70">
              ¿Cuál opción es la correcta?
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              {current.options.map((option) => {
                const isSelected = selected === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option.id)}
                    aria-pressed={isSelected}
                    className={`flex flex-col gap-2 rounded-2xl border-2 bg-white p-3 text-left transition-all ${
                      isSelected
                        ? "border-brand-primary bg-brand-primary/5 shadow-lg ring-4 ring-brand-primary/15"
                        : "border-brand-soft/60 hover:border-brand-primary/60 hover:shadow-md"
                    }`}
                  >
                    {renderOptionPreview(option)}
                    <span className="flex items-center gap-2 text-xs font-bold text-brand-support">
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 text-[10px] font-black ${
                        isSelected ? "border-brand-primary bg-brand-primary text-white" : "border-brand-soft text-transparent"
                      }`}
                      >
                        ✓
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
                className="rounded-xl bg-brand-primary px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-brand-mid disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {isLast ? "Finalizar Auditoría" : "Siguiente Pregunta"}
              </button>
            </div>
          </>
        )}

        {phase === "results" && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="inline-flex items-center rounded-full bg-amber-200/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
                Auditoría finalizada
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
                          Pregunta {index + 1} · {question.heuristica}
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
                Reintentar auditoría
              </button>
              <Link
                href="/retos"
                className="rounded-xl bg-brand-primary px-8 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-brand-mid"
              >
                Volver a los retos →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}