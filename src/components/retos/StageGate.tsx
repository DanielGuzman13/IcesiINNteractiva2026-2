"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { RUTA_STAGES } from "@/lib/ruta-progress";
import { isStageUnlocked } from "@/lib/stage-access";
import { escenaVista, marcarEscenaVista, type RolActividad } from "@/lib/personajes";
import { useHasHydrated } from "@/lib/use-has-hydrated";
import StagePasswordPrompt from "./StagePasswordPrompt";
import EscenaPersonaje from "@/components/personajes/EscenaPersonaje";
import CierrePersonajeHost from "@/components/personajes/CierrePersonajeHost";

const TEMAS: Record<number, string> = {
  1: "salsa",
  2: "feria",
  3: "petronio",
  4: "carrera",
};

const FONDO = "min-h-dvh bg-gradient-to-br from-cali-marfil to-cali-farallones";

/**
 * Envuelve cada actividad:
 *  1. si la parada no se ha desbloqueado (por ejemplo, porque alguien escribió
 *     la dirección a mano), pide la contraseña;
 *  2. la primera vez, el personaje del rol presenta el reto;
 *  3. deja escuchando el mensaje final del personaje para cuando termine.
 */
export default function StageGate({
  stage,
  rol,
  children,
}: {
  stage: number;
  rol: RolActividad;
  children: ReactNode;
}) {
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const [desbloqueadaAhora, setDesbloqueadaAhora] = useState(false);
  const [introTerminada, setIntroTerminada] = useState(false);

  const info = RUTA_STAGES.find((s) => s.index === stage);

  if (!hasHydrated) {
    return <div className={FONDO} />;
  }

  if (info && !desbloqueadaAhora && !isStageUnlocked(stage)) {
    return (
      <div className={`${FONDO} flex items-center justify-center px-4 py-8`}>
        <StagePasswordPrompt
          stage={info}
          onUnlocked={() => setDesbloqueadaAhora(true)}
          onCancel={() => router.push("/retos")}
          cancelLabel="Volver al mapa"
        />
      </div>
    );
  }

  if (!introTerminada && !escenaVista(rol, "intro")) {
    return (
      <div className={FONDO}>
        <EscenaPersonaje
          rol={rol}
          tipo="intro"
          onTerminar={() => {
            marcarEscenaVista(rol, "intro");
            setIntroTerminada(true);
          }}
        />
      </div>
    );
  }

  return (
    <>
      <div data-tema={TEMAS[stage]} className="contents">
        {children}
      </div>
      <CierrePersonajeHost />
    </>
  );
}
