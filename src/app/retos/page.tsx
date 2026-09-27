"use client";

import Link from "next/link";
import InteractiveMap from "@/components/retos/InteractiveMap";

export default function RetosPage() {
  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-[#98d9b4] flex items-center justify-center">
      {/* Botón discreto para volver al registro/perfil */}
      <Link
        href="/registro"
        aria-label="Volver a la selección de personaje"
        title="Volver al perfil"
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/35 text-white/90 backdrop-blur-md border border-white/25 shadow-lg transition hover:bg-slate-900/60 hover:scale-105 active:scale-95"
      >
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
      </Link>

      <InteractiveMap />
    </main>
  );
}