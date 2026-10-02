"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  EVENTO_CIERRE,
  PERSONAJES,
  escenaVista,
  marcarEscenaVista,
  type RolActividad,
} from "@/lib/personajes";
import EscenaPersonaje from "./EscenaPersonaje";

/**
 * Escucha el aviso de "actividad terminada" (anunciarCierrePersonaje),
 * muestra el mensaje final del personaje encima de la actividad y al
 * terminar lleva al estudiante al mapa (o a la siguiente actividad de la
 * misma parada: Backend → Frontend, QA → Ciberseguridad).
 */
export default function CierrePersonajeHost() {
  const router = useRouter();
  const [rol, setRol] = useState<RolActividad | null>(null);

  useEffect(() => {
    function handle(event: Event) {
      const detalle = (event as CustomEvent<RolActividad>).detail;
      if (!detalle || escenaVista(detalle, "cierre")) return;
      setRol(detalle);
    }
    window.addEventListener(EVENTO_CIERRE, handle);
    return () => window.removeEventListener(EVENTO_CIERRE, handle);
  }, []);

  if (!rol) return null;

  return (
    <EscenaPersonaje
      rol={rol}
      tipo="cierre"
      onTerminar={() => {
        marcarEscenaVista(rol, "cierre");
        router.push(PERSONAJES[rol].destinoCierre);
      }}
    />
  );
}
