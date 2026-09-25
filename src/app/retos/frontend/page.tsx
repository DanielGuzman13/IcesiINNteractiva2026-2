"use client";

import Link from "next/link";
import { useState } from "react";
import FrontendPetronioAudit from "@/components/FrontendPetronioAudit";

export default function FrontendRetoPage() {
  const [showIntro, setShowIntro] = useState(true);

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
            {[1].map((i) => (
              <div
                key={i}
                className={`h-3 w-3 rounded-full border-2 border-white transition-all ${
                  i === 1 ? "bg-brand-light" : "bg-white/20"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-white/70">1/1 actividades</span>
        </div>
      </div>

      <div className="w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl 2xl:max-w-[1400px]">
        <div
          className="flex items-center justify-between gap-4 px-8 py-6 text-white"
          style={{ background: "linear-gradient(90deg, #45609B 0%, #719FC1 100%)" }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white/20 shadow-inner">
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                <path d="M8 12h.01M16 12h.01M19 9a7 7 0 0 1 0 6M5 9a7 7 0 0 0 0 6" />
                <path d="M12 3v3M12 18v3M6.5 6.5l2 2M15.5 15.5l2 2M17.5 6.5l-2 2M8.5 15.5l-2 2" />
              </svg>
            </div>
            <div>
              <div className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-white/80">
                Rol del equipo
              </div>
              <h1 className="text-3xl font-extrabold">Frontend / UX</h1>
              <div className="text-sm font-medium text-white/80">
                Mejora la app &quot;Sonoridades del Pacífico&quot;
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowIntro(true)}
            className="flex shrink-0 items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/35"
            title="Volver a ver la introducción de la actividad"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M9.2 9a2.8 2.8 0 0 1 5.5.9c0 1.9-2.4 2.2-2.7 4" />
              <circle cx="12" cy="17.2" r="0.6" fill="currentColor" stroke="none" />
            </svg>
            Ayuda
          </button>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <FrontendPetronioAudit showIntro={showIntro} />
        </div>
      </div>

      {showIntro && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-brand-primary/40 p-4 backdrop-blur-[6px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="frontend-intro-title"
        >
          <div className="relative my-auto w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div
              className="px-6 py-6 text-white"
              style={{ background: "linear-gradient(120deg, #45609B 0%, #719FC1 100%)" }}
            >
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Ruta de Ingeniería de Software · Festival Petronio Álvarez
              </div>
              <h2 id="frontend-intro-title" className="text-2xl font-black sm:text-3xl">
                Bienvenido, Frontend Engineer
              </h2>
            </div>

            <div className="space-y-4 px-6 py-6">
              <p className="text-sm leading-relaxed text-brand-support">
                La organización acaba de lanzar la app oficial{" "}
                <strong>&quot;Sonoridades del Pacífico&quot;</strong> para que el público
                consulte en vivo qué agrupación de marimba o chirimía está tocando en
                tarima y escuche adelantos de sus canciones.
              </p>
              <p className="text-sm leading-relaxed text-brand-support">
                Pero la interfaz está causando frustración: los botones no responden
                visualmente, los contrastes son ilegibles bajo el sol de Cali y la
                navegación es confusa.
              </p>
              <p className="text-sm leading-relaxed text-brand-support">
                Tu misión: revisar la app, elegir la mejor decisión de interfaz en cada
                caso y completar las <strong>6 preguntas</strong> de heurísticas de
                usabilidad, color y componentes UI.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowIntro(false)}
                className="rounded-xl bg-brand-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-mid"
              >
                Comenzar a Mejorar la App
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}