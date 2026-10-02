"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import InteractiveMap from "@/components/retos/InteractiveMap";
import { RUTA_STAGES, getMaxCompletedStage } from "@/lib/ruta-progress";

const claseBoton =
  "fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/35 text-white/90 backdrop-blur-md border border-white/25 shadow-lg transition";

function suscribir(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function rutaCompletada() {
  return getMaxCompletedStage() >= RUTA_STAGES.length - 1;
}

function FlechaAtras() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

export default function RetosPage() {
  const completada = useSyncExternalStore(suscribir, rutaCompletada, () => false);

  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-cali-farallones flex items-center justify-center">
      {completada ? (
        <Link
          href="/registro"
          aria-label="Volver a la selección de personaje"
          title="Volver al perfil"
          className={`${claseBoton} hover:bg-slate-900/60 hover:scale-105 active:scale-95`}
        >
          <FlechaAtras />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          aria-label="Volver a la selección de personaje (disponible al terminar la ruta)"
          title="Disponible al terminar la Carrera del Pacífico"
          className={`${claseBoton} cursor-not-allowed opacity-40`}
        >
          <FlechaAtras />
        </button>
      )}

      <InteractiveMap />

      {completada && (
        <Link
          href="/equipo"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-brand-primary px-7 py-3 text-base font-bold text-white shadow-xl shadow-black/25 transition hover:-translate-y-0.5 hover:bg-brand-support"
        >
          🎉 Conocer al equipo
        </Link>
      )}
    </main>
  );
}
