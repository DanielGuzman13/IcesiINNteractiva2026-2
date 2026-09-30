"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ROLES_EQUIPO, type RolEquipo } from "@/lib/roles-equipo";
import { getMaxCompletedStage, RUTA_STAGES } from "@/lib/ruta-progress";
import { loadPlayer } from "@/lib/player";
import { useHasHydrated } from "@/lib/use-has-hydrated";
import TextoCaleno from "@/components/personajes/TextoCaleno";

/**
 * Pantalla final de la ruta: el equipo de ingeniería de software con el que
 * trabajó el estudiante. Cada rol se presenta sobre la foto y el escudo de
 * su evento; al tocarlo se abre la descripción de lo que hace.
 */
export default function EquipoRoles() {
  const hasHydrated = useHasHydrated();
  const [abierto, setAbierto] = useState<number | null>(null);
  const [vistos, setVistos] = useState<string[]>([]);

  const nombre = hasHydrated ? loadPlayer()?.name ?? null : null;
  const rutaCompleta = hasHydrated && getMaxCompletedStage() >= RUTA_STAGES.length - 1;

  const abrir = useCallback((indice: number) => {
    const total = ROLES_EQUIPO.length;
    const normalizado = ((indice % total) + total) % total;
    setAbierto(normalizado);
    const id = ROLES_EQUIPO[normalizado].id;
    setVistos((actual) => (actual.includes(id) ? actual : [...actual, id]));
  }, []);

  useEffect(() => {
    if (abierto === null) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setAbierto(null);
      if (event.key === "ArrowRight") abrir(abierto! + 1);
      if (event.key === "ArrowLeft") abrir(abierto! - 1);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [abierto, abrir]);

  if (!hasHydrated) {
    return <div className="min-h-dvh bg-gradient-to-br from-cali-marfil to-cali-farallones" />;
  }

  if (!rutaCompleta) {
    return (
      <main
        data-tema="general"
        className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-cali-marfil to-cali-farallones px-4"
      >
        <div className="max-w-md rounded-3xl border border-white/70 bg-white p-8 text-center shadow-2xl">
          <p className="text-4xl" aria-hidden="true">🗺️</p>
          <h1 className="mt-3 text-2xl font-black text-brand-support">
            Primero completa la ruta
          </h1>
          <p className="mt-2 text-sm text-brand-support/80">
            Aquí conocerás a todo el equipo cuando termines las cuatro paradas
            del mapa.
          </p>
          <Link
            href="/retos"
            className="mt-6 inline-flex rounded-full bg-brand-primary px-8 py-3 font-bold text-white shadow-lg transition hover:bg-brand-support"
          >
            Ir al mapa
          </Link>
        </div>
      </main>
    );
  }

  const rol = abierto !== null ? ROLES_EQUIPO[abierto] : null;

  return (
    <main
      data-tema="general"
      className="min-h-dvh bg-gradient-to-br from-cali-marfil to-cali-farallones px-4 py-10 sm:px-8"
    >
      <header className="mx-auto max-w-6xl text-center">
        <span className="etiqueta">Ruta completada · Cali nos une</span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-brand-support sm:text-5xl">
          {nombre ? `¡Lo lograste, ${nombre}!` : "¡Lo lograste!"}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-brand-support/80 sm:text-lg">
          Este es el equipo de ingeniería de software con el que recorriste
          Cali. Cada rol es una pieza distinta del mismo proyecto.
        </p>
        <motion.p
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-primary/30 sm:text-base"
        >
          <span aria-hidden="true">👆</span>
          Toca un rol para ver qué hace dentro de un proyecto de software
        </motion.p>
      </header>

      <ul className="mx-auto mt-10 flex max-w-6xl flex-wrap justify-center gap-6">
        {ROLES_EQUIPO.map((r, indice) => (
          <li
            key={r.id}
            data-tema={r.tema}
            className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <TarjetaRol rol={r} visto={vistos.includes(r.id)} onAbrir={() => abrir(indice)} />
          </li>
        ))}
      </ul>

      <footer className="mx-auto mt-12 flex max-w-6xl flex-col items-center gap-4 text-center">
        <p className="text-sm font-semibold text-brand-support/70">
          Conociste {vistos.length} de {ROLES_EQUIPO.length} roles
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/retos"
            className="rounded-full border-2 border-brand-support/30 bg-white px-6 py-3 font-bold text-brand-support transition hover:border-brand-support"
          >
            Volver al mapa
          </Link>
          <Link
            href="/"
            className="rounded-full bg-brand-primary px-8 py-3 font-bold text-white shadow-lg shadow-brand-primary/30 transition hover:bg-brand-support"
          >
            Finalizar
          </Link>
        </div>
      </footer>

      <AnimatePresence>
        {rol && abierto !== null && (
          <DetalleRol
            key="detalle"
            rol={rol}
            indice={abierto}
            onCerrar={() => setAbierto(null)}
            onNavegar={(delta) => abrir(abierto + delta)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

/* ------------------------------------------------------------------ */

function TarjetaRol({
  rol,
  visto,
  onAbrir,
}: {
  rol: RolEquipo;
  visto: boolean;
  onAbrir: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onAbrir}
      aria-label={`Ver qué hace: ${rol.titulo}`}
      className="group relative block h-[26rem] w-full overflow-hidden rounded-3xl border-4 border-white text-left shadow-xl shadow-brand-support/20 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary"
    >
      <Image
        src={rol.foto.src}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 400px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--brand-primary) 35%, transparent) 0%, color-mix(in srgb, var(--brand-support) 55%, transparent) 55%, var(--brand-support) 100%)",
        }}
      />

      <Image
        src={rol.escudo}
        alt={`Escudo del ${rol.evento}`}
        width={96}
        height={80}
        className="absolute right-3 top-3 h-auto w-20 -rotate-6 drop-shadow-lg transition-transform duration-300 group-hover:rotate-0"
      />

      {visto && (
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-brand-support shadow">
          ✓ Visto
        </span>
      )}

      <Image
        src={rol.imagen}
        alt={rol.titulo}
        width={rol.anchoImagen}
        height={rol.altoImagen}
        sizes="320px"
        className="absolute bottom-20 left-1/2 h-64 w-auto -translate-x-1/2 drop-shadow-[0_14px_20px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/75">
          {rol.evento}
        </div>
        <div className="text-xl font-black leading-tight">{rol.titulo}</div>
        <div className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-white/90">
          Ver qué hace
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */

function DetalleRol({
  rol,
  indice,
  onCerrar,
  onNavegar,
}: {
  rol: RolEquipo;
  indice: number;
  onCerrar: () => void;
  onNavegar: (delta: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-brand-support/75 p-4 backdrop-blur-md"
      onClick={onCerrar}
    >
      <motion.div
        key={rol.id}
        data-tema={rol.tema}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rol-titulo"
        onClick={(event) => event.stopPropagation()}
        className="relative my-auto grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-[2fr_3fr]"
      >
        <div className="relative min-h-72 overflow-hidden md:min-h-full">
          <Image src={rol.foto.src} alt={rol.foto.alt} fill sizes="400px" className="object-cover" />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, var(--brand-support) 0%, color-mix(in srgb, var(--brand-primary) 40%, transparent) 60%, transparent 100%)",
            }}
          />
          <Image
            src={rol.escudo}
            alt={`Escudo del ${rol.evento}`}
            width={96}
            height={80}
            className="absolute left-4 top-4 h-auto w-20 -rotate-6 drop-shadow-lg"
          />
          <Image
            src={rol.imagen}
            alt={rol.titulo}
            width={rol.anchoImagen}
            height={rol.altoImagen}
            sizes="400px"
            className="absolute bottom-0 left-1/2 h-[85%] w-auto max-w-none -translate-x-1/2 drop-shadow-[0_18px_28px_rgba(0,0,0,0.5)]"
          />
        </div>

        <div className="max-h-[85vh] overflow-y-auto p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="etiqueta">{rol.evento} · Etapa de {rol.etapa}</span>
              <h2 id="rol-titulo" className="mt-3 text-3xl font-black leading-tight text-brand-support">
                {rol.titulo}
              </h2>
              {rol.tambien && (
                <p className="text-sm font-semibold text-brand-support/60">También: {rol.tambien}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-brand-support/20 text-lg font-bold text-brand-support transition hover:border-brand-primary hover:text-brand-primary"
            >
              ✕
            </button>
          </div>

          <h3 className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-brand-primary">
            ¿Qué hace?
          </h3>
          <p className="mt-2 text-base leading-relaxed text-brand-support">{rol.queHace}</p>

          <h3 className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-brand-primary">
            En un proyecto de software
          </h3>
          <ul className="mt-2 space-y-2">
            {rol.tareas.map((tarea) => (
              <li key={tarea} className="flex gap-2 text-sm leading-relaxed text-brand-support">
                <span aria-hidden="true" className="mt-0.5 font-black text-brand-primary">▸</span>
                <span>{tarea}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border-2 border-brand-soft/60 bg-brand-light p-4">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-brand-support/70">
              Lo que hiciste en la ruta
            </div>
            <p className="mt-1 text-sm leading-relaxed text-brand-support">{rol.enLaRuta}</p>
          </div>

          <blockquote className="mt-5 border-l-4 border-brand-primary pl-4 text-lg font-semibold italic leading-relaxed text-brand-support">
            «<TextoCaleno texto={rol.frase} />»
          </blockquote>

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-brand-support/10 pt-5">
            <button
              type="button"
              onClick={() => onNavegar(-1)}
              className="rounded-full border-2 border-brand-support/20 px-4 py-2 text-sm font-bold text-brand-support transition hover:border-brand-support"
            >
              ← Anterior
            </button>
            <span className="text-xs font-semibold text-brand-support/60">
              {indice + 1} de {ROLES_EQUIPO.length}
            </span>
            <button
              type="button"
              onClick={() => onNavegar(1)}
              className="rounded-full bg-brand-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-support"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
