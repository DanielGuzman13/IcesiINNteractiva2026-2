"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { loadPlayer } from "@/lib/player";
import { PERSONAJES, textoConNombre, type RolActividad } from "@/lib/personajes";
import TextoCaleno from "./TextoCaleno";

/**
 * Escena a pantalla completa: el personaje a un lado y su globo de diálogo
 * al otro. El estudiante avanza mensaje por mensaje.
 */
export default function EscenaPersonaje({
  rol,
  tipo,
  onTerminar,
}: {
  rol: RolActividad;
  tipo: "intro" | "cierre";
  onTerminar: () => void;
}) {
  const personaje = PERSONAJES[rol];
  const mensajes = tipo === "intro" ? personaje.intro : personaje.cierre;
  const [paso, setPaso] = useState(0);
  const [nombre] = useState(() => loadPlayer()?.name ?? null);

  const esUltimo = paso === mensajes.length - 1;
  const textoBoton = esUltimo
    ? tipo === "intro"
      ? personaje.botonIntro
      : personaje.botonCierre
    : "Siguiente";

  function avanzar() {
    if (esUltimo) onTerminar();
    else setPaso((p) => p + 1);
  }

  function retroceder() {
    setPaso((p) => Math.max(p - 1, 0));
  }

  return (
    <div
      data-tema="general"
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-brand-support/75 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`${personaje.titulo} te habla`}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="my-auto flex w-full max-w-6xl flex-col items-center gap-2 md:flex-row md:items-end md:gap-0"
      >
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="relative h-72 w-72 shrink-0 sm:h-96 sm:w-96 md:h-[min(40rem,78vh)] md:w-[min(36rem,70vh)]"
        >
          <Image
            src={personaje.imagen}
            alt={personaje.titulo}
            fill
            priority
            sizes="(max-width: 768px) 384px, 576px"
            className="object-contain object-bottom drop-shadow-[0_18px_30px_rgba(0,0,0,0.35)]"
          />
        </motion.div>

        <div className="relative w-full md:mb-24 md:flex-1">
          {/* Colita del globo apuntando al personaje */}
          <span
            aria-hidden="true"
            className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rotate-45 border-l-2 border-t-2 border-brand-mid bg-white md:-left-3 md:top-12 md:translate-x-0 md:-rotate-45"
          />
          <div className="relative rounded-3xl border-2 border-brand-mid bg-white p-6 shadow-2xl sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white">
              {personaje.titulo}
            </span>

            <div className="mt-4 min-h-[7.5rem]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={paso}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="text-lg leading-relaxed text-brand-support sm:text-xl"
                >
                  <TextoCaleno texto={textoConNombre(mensajes[paso], nombre)} />
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex gap-1.5" aria-label={`Mensaje ${paso + 1} de ${mensajes.length}`}>
                {mensajes.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2.5 rounded-full transition-all ${
                      i === paso ? "w-7 bg-brand-primary" : i < paso ? "w-2.5 bg-brand-mid" : "w-2.5 bg-brand-primary/20"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                {paso > 0 && (
                  <button
                    type="button"
                    onClick={retroceder}
                    aria-label="Mensaje anterior"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand-primary/30 bg-white text-brand-primary transition-all hover:bg-brand-primary/10 active:scale-95"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={avanzar}
                  autoFocus
                  className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-7 py-3 text-base font-bold text-white shadow-lg shadow-brand-primary/30 transition-all hover:bg-brand-mid active:scale-95"
                >
                  {textoBoton}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
