"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { RutaStage } from "@/lib/ruta-progress";
import { unlockStage, verifyStagePassword } from "@/lib/stage-access";
import { PERSONAJES, PERSONAJE_POR_PARADA } from "@/lib/personajes";
import TextoCaleno from "@/components/personajes/TextoCaleno";

const MENSAJES_ERROR = [
  "¡*Pailas*! Esa no es la contraseña. Pedísela a tu guía cuando sea el momento de empezar.",
  "¡*Oís*! Todavía no es esa. Revisá bien con tu guía, ¡ya casi arrancamos!",
  "Esa tampoco es, *ve*. Acordate: la contraseña la tiene tu guía.",
];

/**
 * El personaje de la parada pide la contraseña. Se usa como ventana
 * emergente en el mapa y como pantalla completa cuando alguien entra a una
 * actividad escribiendo la dirección.
 */
export default function StagePasswordPrompt({
  stage,
  onUnlocked,
  onCancel,
  cancelLabel = "Cancelar",
}: {
  stage: RutaStage;
  onUnlocked: () => void;
  onCancel?: () => void;
  cancelLabel?: string;
}) {
  const personaje = PERSONAJES[PERSONAJE_POR_PARADA[stage.index] ?? "analista"];
  const [valor, setValor] = useState("");
  const [intentos, setIntentos] = useState(0);
  const [correcta, setCorrecta] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const mensaje = correcta
    ? `¡*Eso, ve*! Contraseña correcta. ¡*Vamos pues* a ${stage.title}!`
    : intentos > 0
      ? MENSAJES_ERROR[(intentos - 1) % MENSAJES_ERROR.length]
      : `¡*Mirá ve*! Soy ${personaje.presentacion}. Para abrir ${stage.title} necesito la contraseña que te dará tu guía.`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (correcta) return;
    if (verifyStagePassword(stage.index, valor)) {
      unlockStage(stage.index);
      setCorrecta(true);
      window.setTimeout(onUnlocked, 1100);
      return;
    }
    setIntentos((n) => n + 1);
    setValor("");
    inputRef.current?.focus();
  }

  const error = intentos > 0 && !correcta;

  return (
    <div
      data-tema="general"
      className="flex w-full max-w-5xl flex-col items-center gap-2 md:flex-row md:items-end md:gap-0"
      role="dialog"
      aria-modal="true"
      aria-label={`${stage.title}: contraseña de la actividad`}
    >
      <motion.div
        initial={{ x: -30, opacity: 0 }}
        animate={correcta ? { x: 0, opacity: 1, y: [0, -14, 0] } : { x: 0, opacity: 1 }}
        transition={{ duration: correcta ? 0.5 : 0.4, ease: "easeOut" }}
        className="relative h-60 w-60 shrink-0 sm:h-80 sm:w-80 md:h-[min(34rem,72vh)] md:w-[min(30rem,64vh)]"
      >
        <Image
          src={personaje.imagen}
          alt={personaje.titulo}
          fill
          priority
          sizes="(max-width: 768px) 320px, 480px"
          className="object-contain object-bottom drop-shadow-[0_18px_30px_rgba(0,0,0,0.35)]"
        />
      </motion.div>

      <motion.div
        key={intentos}
        animate={error ? { x: [0, -12, 12, -12, 12, -8, 8, 0] } : { scale: [0.97, 1] }}
        transition={{ duration: error ? 0.5 : 0.2 }}
        className="relative w-full md:mb-16 md:flex-1"
      >
        <span
          aria-hidden="true"
          className={`absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rotate-45 border-l-2 border-t-2 bg-white md:-left-3 md:top-12 md:translate-x-0 md:-rotate-45 ${
            error ? "border-red-300" : correcta ? "border-emerald-300" : "border-brand-mid"
          }`}
        />
        <div
          className={`relative rounded-3xl border-2 bg-white p-6 shadow-2xl sm:p-7 ${
            error ? "border-red-300" : correcta ? "border-emerald-300" : "border-brand-mid"
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-brand-primary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
              {personaje.titulo}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-support">
              {correcta ? "🔓" : "🔒"} {stage.title}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={`${intentos}-${correcta}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              role={error ? "alert" : undefined}
              className={`mt-4 min-h-[3.5rem] text-base font-medium leading-relaxed sm:text-lg ${
                error ? "text-red-600" : correcta ? "text-emerald-700" : "text-brand-support"
              }`}
            >
              <TextoCaleno texto={mensaje} />
            </motion.p>
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <input
              ref={inputRef}
              type="password"
              value={valor}
              onChange={(event) => setValor(event.target.value)}
              disabled={correcta}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="Contraseña"
              aria-label="Contraseña de la actividad"
              className={`w-full rounded-2xl border-2 bg-brand-light/20 px-4 py-3 text-center text-lg font-bold tracking-widest text-brand-support outline-none transition focus:border-brand-primary ${
                error ? "border-red-400" : "border-brand-soft"
              }`}
            />
            <div className="flex flex-col gap-2 sm:flex-row-reverse">
              <button
                type="submit"
                disabled={!valor.trim() || correcta}
                className={`flex-1 rounded-full px-8 py-3 text-lg font-bold shadow-xl transition-all duration-300 ${
                  valor.trim() && !correcta
                    ? "bg-brand-primary text-white shadow-brand-primary/30 hover:bg-brand-mid"
                    : "cursor-not-allowed bg-brand-primary/15 text-brand-support/60 shadow-none"
                }`}
              >
                Desbloquear
              </button>
              {onCancel && !correcta && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-full border-2 border-brand-soft px-6 py-2.5 text-sm font-bold text-brand-support transition-all hover:border-brand-support"
                >
                  {cancelLabel}
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
