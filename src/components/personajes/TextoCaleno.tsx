"use client";

import { Fragment } from "react";
import { significadoCalenol } from "@/lib/calenol";

/**
 * Muestra un texto con las expresiones caleñas marcadas entre asteriscos
 * (*ve*, *pailas*…) resaltadas. Al pasar el mouse o tocar una expresión,
 * aparece su significado del diccionario caleñol.
 */
export default function TextoCaleno({ texto }: { texto: string }) {
  const partes = texto.split(/(\*[^*]+\*)/g);

  return (
    <>
      {partes.map((parte, i) => {
        if (!(parte.startsWith("*") && parte.endsWith("*") && parte.length > 2)) {
          return <Fragment key={i}>{parte}</Fragment>;
        }
        const expresion = parte.slice(1, -1);
        const significado = significadoCalenol(expresion);

        if (!significado) {
          return (
            <strong key={i} className="font-extrabold text-amber-600">
              {expresion}
            </strong>
          );
        }

        return (
          <span key={i} className="group relative inline-block">
            <button
              type="button"
              className="cursor-help rounded-md bg-amber-100 px-1 font-extrabold text-amber-700 underline decoration-amber-400 decoration-dotted decoration-2 underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              aria-label={`${expresion}: ${significado}`}
            >
              {expresion}
            </button>
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-60 -translate-x-1/2 rounded-xl bg-slate-900 px-3 py-2 text-left text-xs font-medium leading-snug text-white opacity-0 shadow-xl transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100"
            >
              <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-amber-300">
                Diccionario caleñol
              </span>
              {significado}
            </span>
          </span>
        );
      })}
    </>
  );
}
