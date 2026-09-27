"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { RUTA_STAGES } from "@/lib/ruta-progress";
import { isStageUnlocked } from "@/lib/stage-access";
import { useHasHydrated } from "@/lib/use-has-hydrated";
import StagePasswordPrompt from "./StagePasswordPrompt";

/**
 * Protege una actividad: si la parada no se ha desbloqueado con su
 * contraseña (por ejemplo, porque alguien escribió la dirección a mano),
 * muestra la solicitud de contraseña en lugar de la actividad.
 */
export default function StageGate({ stage, children }: { stage: number; children: ReactNode }) {
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const [desbloqueadaAhora, setDesbloqueadaAhora] = useState(false);

  const info = RUTA_STAGES.find((s) => s.index === stage);

  if (!hasHydrated) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-brand-primary via-brand-support to-brand-mid" />
    );
  }

  if (!info || desbloqueadaAhora || isStageUnlocked(stage)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-brand-primary via-brand-support to-brand-mid px-4 py-8">
      <StagePasswordPrompt
        stage={info}
        onUnlocked={() => setDesbloqueadaAhora(true)}
        onCancel={() => router.push("/retos")}
        cancelLabel="Volver al mapa"
      />
    </div>
  );
}
