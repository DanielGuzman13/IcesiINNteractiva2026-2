"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { RutaStage } from "@/lib/ruta-progress";
import { unlockStage, verifyStagePassword } from "@/lib/stage-access";

/**
 * Tarjeta que pide la contraseña de una parada del mapa.
 * Se usa como ventana emergente en el mapa y como pantalla completa
 * cuando alguien entra a una actividad escribiendo la dirección.
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
  const [valor, setValor] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [intentos, setIntentos] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (verifyStagePassword(stage.index, valor)) {
      unlockStage(stage.index);
      setError(null);
      onUnlocked();
      return;
    }
    setIntentos((n) => n + 1);
    setError("Contraseña incorrecta. Pídela a tu guía cuando sea el momento de empezar.");
    setValor("");
    inputRef.current?.focus();
  }

  return (
    <motion.div
      key={intentos}
      animate={intentos > 0 ? { x: [0, -12, 12, -12, 12, -8, 8, 0] } : { scale: [0.96, 1] }}
      transition={{ duration: intentos > 0 ? 0.5 : 0.2 }}
      className="w-full max-w-md rounded-3xl border border-white/60 bg-white p-6 text-center shadow-2xl shadow-brand-primary/30 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stage-password-title"
    >
      {stage.imageSrc && (
        <div className="relative mx-auto h-24 w-24">
          <Image src={stage.imageSrc} alt="" fill sizes="96px" className="object-contain" />
        </div>
      )}
      <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-soft/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-support">
        🔒 {stage.role}
      </span>
      <h2
        id="stage-password-title"
        className="mt-3 text-2xl font-black tracking-tight text-brand-support"
      >
        {stage.title}
      </h2>
      <p className="mt-2 text-sm text-brand-support/80">
        Esta actividad está bloqueada. Escribe la contraseña que te dará tu
        guía para comenzar.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          ref={inputRef}
          type="password"
          value={valor}
          onChange={(event) => {
            setValor(event.target.value);
            setError(null);
          }}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="Contraseña"
          aria-label="Contraseña de la actividad"
          className={`w-full rounded-2xl border-2 bg-brand-light/20 px-4 py-3 text-center text-lg font-bold tracking-widest text-brand-support outline-none transition focus:border-brand-primary ${
            error ? "border-red-400" : "border-brand-soft"
          }`}
        />

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!valor.trim()}
          className={`w-full rounded-full px-8 py-3.5 text-lg font-bold shadow-xl transition-all duration-300 ${
            valor.trim()
              ? "bg-brand-primary text-white shadow-brand-primary/30 hover:bg-brand-mid"
              : "cursor-not-allowed bg-brand-light text-brand-support/60 shadow-none"
          }`}
        >
          Desbloquear
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-full border-2 border-brand-soft px-6 py-2.5 text-sm font-bold text-brand-support transition-all hover:border-brand-support"
          >
            {cancelLabel}
          </button>
        )}
      </form>
    </motion.div>
  );
}
