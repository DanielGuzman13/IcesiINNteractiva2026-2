"use client";

import { useState, type DragEvent } from "react";
import CanchaBackground from "./CanchaBackground";
import { pickRandom, shouldShowTip } from "@/lib/random";

interface Atributo {
  id: string;
  nombre: string;
  tipo: string;
  claseId: string | null;
  esCorrecto: boolean;
}

interface Clase {
  id: string;
  nombre: string;
  atributosAsignados: Atributo[];
}

interface Actividad2Props {
  onComplete: (score: number) => void;
}

const RESPONSES: Record<string, string[]> = {
  equipo: ["Nombre Del Equipo", "Integrantes", "Puntos Totales"],
  jugador: [
    "Nombre Jugador",
    "Posicion Campo",
    "Goles Marcados",
    "Asistencias Realizadas",
    "Minutos Jugados",
    "Amonestaciones",
    "Expulsiones",
  ],
  partido: ["Fecha Partido", "Marcador Final", "Estadio", "Arbitro"],
  estadistica: ["Goles Marcados", "Asistencias Realizadas", "Minutos Jugados"],
  tactica: ["Formacion Tactica", "Estrategia Juego"],
};

const CLASE_NOMBRES: Record<string, string> = {
  equipo: "Equipo",
  jugador: "Jugador",
  partido: "Partido",
  estadistica: "Estadistica",
  tactica: "Tactica",
};

const PREDEFINED_MAP: Record<string, string> = {
  a3: "equipo",
  a7: "partido",
  a9: "estadistica",
  a12: "jugador",
  a11: "tactica",
  a13: "jugador",
  a14: "jugador",
};

const PREDEFINED_IDS = Object.keys(PREDEFINED_MAP);

const ATRIBUTOS_BASE: Array<{ id: string; nombre: string; tipo: string }> = [
  { id: "a1", nombre: "Nombre Del Equipo", tipo: "string" },
  { id: "a2", nombre: "Integrantes", tipo: "number" },
  { id: "a3", nombre: "Puntos Totales", tipo: "number" },
  { id: "a4", nombre: "Nombre Jugador", tipo: "string" },
  { id: "a5", nombre: "Posicion Campo", tipo: "string" },
  { id: "a6", nombre: "Fecha Partido", tipo: "string" },
  { id: "a7", nombre: "Marcador Final", tipo: "string" },
  { id: "a8", nombre: "Goles Marcados", tipo: "number" },
  { id: "a9", nombre: "Asistencias Realizadas", tipo: "number" },
  { id: "a10", nombre: "Formacion Tactica", tipo: "string" },
  { id: "a11", nombre: "Estrategia Juego", tipo: "string" },
  { id: "a12", nombre: "Minutos Jugados", tipo: "number" },
  { id: "a13", nombre: "Amonestaciones", tipo: "number" },
  { id: "a14", nombre: "Expulsiones", tipo: "number" },
];

function buildAtributos(): Atributo[] {
  return ATRIBUTOS_BASE.map((a) => {
    const claseId = PREDEFINED_MAP[a.id] ?? null;
    return {
      id: a.id,
      nombre: a.nombre,
      tipo: a.tipo,
      claseId,
      esCorrecto: claseId ? RESPONSES[claseId].includes(a.nombre) : false,
    };
  });
}

function buildClases(atributos: Atributo[]): Clase[] {
  return Object.keys(CLASE_NOMBRES).map((id) => ({
    id,
    nombre: CLASE_NOMBRES[id],
    atributosAsignados: atributos.filter((a) => a.claseId === id),
  }));
}

const MENSAJES_ARQUITECTO = [
  "El arquitecto diseña las clases como un técnico define la formación del equipo.",
  "Cada atributo es como una habilidad específica que necesita un jugador.",
  "La estructura del sistema es como el esquema táctico de un partido.",
  "Los atributos correctos en cada clase son como poner al jugador en su posición ideal.",
  "Un buen diseño es como una estrategia bien ejecutada en el campo.",
  "La arquitectura de software es el plan de juego que guía al equipo de desarrollo.",
  "Las relaciones entre clases son como los pases entre jugadores.",
  "Un atributo mal ubicado es como un jugador fuera de posición.",
];

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export default function Actividad2AsignarAtributos({ onComplete }: Actividad2Props) {
  const [atributosDisponibles, setAtributosDisponibles] = useState<Atributo[]>(
    buildAtributos,
  );
  const [clases, setClases] = useState<Clase[]>(() =>
    buildClases(atributosDisponibles),
  );

  const [draggedAttribute, setDraggedAttribute] = useState<string | null>(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [mensajeEmergente, setMensajeEmergente] = useState<string | null>(null);

  const mostrarMensajeAleatorio = () => {
    const texto = pickRandom(MENSAJES_ARQUITECTO);
    setMensajeEmergente(texto);
    setTimeout(() => setMensajeEmergente(null), 4000);
  };

  const handleDragStart = (e: DragEvent, atributoId: string) => {
    setDraggedAttribute(atributoId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent, claseId: string) => {
    e.preventDefault();
    if (!draggedAttribute) return;

    const atributo = atributosDisponibles.find((a) => a.id === draggedAttribute);
    if (!atributo || atributo.claseId) return;

    const atributoActualizado: Atributo = {
      ...atributo,
      claseId,
      esCorrecto: RESPONSES[claseId].includes(atributo.nombre),
    };

    setAtributosDisponibles((prev) =>
      prev.map((a) => (a.id === draggedAttribute ? atributoActualizado : a)),
    );

    setClases((prev) =>
      prev.map((clase) =>
        clase.id === claseId
          ? {
              ...clase,
              atributosAsignados: [...clase.atributosAsignados, atributoActualizado],
            }
          : clase,
      ),
    );

    setDraggedAttribute(null);

    if (shouldShowTip()) {
      mostrarMensajeAleatorio();
    }
  };

  const handleRemoveAttribute = (claseId: string, atributoId: string) => {
    setAtributosDisponibles((prev) =>
      prev.map((a) =>
        a.id === atributoId ? { ...a, claseId: null, esCorrecto: false } : a,
      ),
    );

    setClases((prev) =>
      prev.map((clase) =>
        clase.id === claseId
          ? {
              ...clase,
              atributosAsignados: clase.atributosAsignados.filter(
                (a) => a.id !== atributoId,
              ),
            }
          : clase,
      ),
    );
  };

  const calcularScore = () => {
    let correctas = 0;
    let incorrectas = 0;

    clases.forEach((clase) => {
      clase.atributosAsignados.forEach((atributo) => {
        if (atributo.esCorrecto) correctas++;
        else incorrectas++;
      });
    });

    return Math.max(0, correctas * 10 - incorrectas * 5);
  };

  const handleSubmit = () => {
    setMostrarResultado(true);

    const correctos = clases.reduce(
      (acc, clase) =>
        acc + clase.atributosAsignados.filter((a) => a.esCorrecto).length,
      0,
    );
    const total = clases.reduce(
      (acc, clase) => acc + clase.atributosAsignados.length,
      0,
    );

    setMensajeEmergente(
      correctos === 14 && total === 14
        ? "¡Excelente! Dominaste la asignación de atributos. Atributos correctos: 14/14"
        : "¡Como un arquitecto que finaliza su diseño, ha organizado la estructura del sistema!",
    );
  };

  const handleContinue = () => {
    onComplete(calcularScore());
  };

  const resetActivity = () => {
    setAtributosDisponibles((prev) =>
      prev.map((a) =>
        PREDEFINED_IDS.includes(a.id)
          ? a
          : { ...a, claseId: null, esCorrecto: false },
      ),
    );

    setClases((prev) =>
      prev.map((clase) => ({
        ...clase,
        atributosAsignados: clase.atributosAsignados.filter((a) =>
          PREDEFINED_IDS.includes(a.id),
        ),
      })),
    );

    setMostrarResultado(false);
    setDraggedAttribute(null);
  };

  const todosAsignados =
    atributosDisponibles.filter((a) => a.claseId).length >= 9;

  const atributosPorOrganizar = atributosDisponibles.filter((a) => !a.claseId);

  return (
    <CanchaBackground>
      <div className="flex h-full w-full flex-col">
        {mensajeEmergente && (
          <div className="fixed right-4 top-4 z-50 max-w-sm animate-pulse rounded-lg bg-brand-primary px-6 py-3 text-white shadow-lg">
            <p className="text-sm font-medium">{mensajeEmergente}</p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="mb-2 text-xl font-bold text-brand-support">
            Actividad 2: Asignación de Atributos
          </h3>
          <p className="text-sm text-brand-support/80">
            La mayoría de los atributos ya están organizados. Solo necesitas
            asignar los 7 atributos restantes en las clases correctas según su
            responsabilidad en el sistema.
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-x-auto lg:flex-row">
          <div className="w-full lg:w-80">
            <div className="flex h-full flex-col rounded-xl border-2 border-brand-soft bg-white/70 p-6">
              <div className="mb-6">
                <h4 className="mb-4 text-sm font-semibold text-brand-support">
                  Atributos por Organizar:
                </h4>
                <div className="flex flex-col gap-2 rounded-lg bg-brand-light/40 p-3">
                  {atributosPorOrganizar.map((atributo) => (
                    <div
                      key={atributo.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, atributo.id)}
                      className="cursor-move rounded-lg border border-brand-mid bg-brand-soft/40 px-3 py-2 text-left transition-colors select-none hover:bg-brand-soft/70"
                    >
                      <span className="text-sm font-medium text-brand-support">
                        {atributo.nombre}
                      </span>
                    </div>
                  ))}
                  {atributosPorOrganizar.length === 0 && (
                    <div className="px-3 py-2 text-sm text-brand-support/60 italic">
                      Todos los atributos fueron asignados.
                    </div>
                  )}
                </div>
                <div className="mt-2 text-xs text-brand-support/70">
                  {atributosPorOrganizar.length} atributos por organizar
                </div>
              </div>

              <div className="mb-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={resetActivity}
                  className="rounded-full border-2 border-brand-soft px-8 py-3 font-bold text-brand-support transition-all hover:border-brand-support"
                >
                  Reiniciar
                </button>
                {!mostrarResultado ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!todosAsignados}
                    className={`rounded-full px-10 py-3 font-bold transition-all ${
                      todosAsignados
                        ? "bg-brand-primary text-white hover:bg-brand-mid"
                        : "cursor-not-allowed bg-brand-light text-brand-support/50"
                    }`}
                  >
                    Validar Asignación
                  </button>
                ) : (
                  <div className="text-center">
                    <div className="mb-2 text-lg font-semibold text-brand-support">
                      Score: {calcularScore()} pts
                    </div>
                    <div className="mb-4 text-sm text-brand-support/80">
                      Revisa los atributos incorrectos antes de continuar.
                    </div>
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="rounded-full bg-brand-primary px-8 py-3 font-bold text-white transition-all hover:bg-brand-mid"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </div>

              {mostrarResultado && (
                <div className="mb-6 text-center">
                  <div
                    className={`text-lg font-semibold ${
                      calcularScore() >= 100
                        ? "text-green-600"
                        : calcularScore() >= 50
                          ? "text-brand-primary"
                          : "text-orange-500"
                    }`}
                  >
                    {calcularScore() >= 100
                      ? "¡Excelente! Dominaste la asignación de atributos"
                      : calcularScore() >= 50
                        ? "¡Buen trabajo! La mayoría son correctas"
                        : "Sigue practicando el diseño de atributos"}
                  </div>
                  <div className="mt-2 text-sm text-brand-support/80">
                    Atributos correctos:{" "}
                    {clases.reduce(
                      (acc, clase) =>
                        acc +
                        clase.atributosAsignados.filter((a) => a.esCorrecto).length,
                      0,
                    )}
                    /
                    {clases.reduce(
                      (acc, clase) => acc + clase.atributosAsignados.length,
                      0,
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-1 items-start justify-start gap-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3">
              {clases.map((clase) => (
                <div key={clase.id} className="col-span-1">
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, clase.id)}
                    className={`rounded-lg border-2 p-1 transition-all ${
                      mostrarResultado
                        ? "border-brand-soft bg-white/60"
                        : "border-brand-soft bg-white/70 hover:border-brand-primary"
                    }`}
                  >
                    <h5 className="mb-0.5 text-center text-xs font-bold text-brand-support">
                      {clase.nombre}
                    </h5>
                    <div className="min-h-[60px] space-y-0.5">
                      <div className="mb-1 text-center text-xs text-brand-support/70">
                        Faltan:{" "}
                        {Math.max(
                          0,
                          RESPONSES[clase.id].length - clase.atributosAsignados.length,
                        )}{" "}
                        atributos
                      </div>
                      {clase.atributosAsignados.length === 0 ? (
                        <div className="rounded-md border-2 border-dashed border-brand-soft py-2 text-center text-xs text-brand-support/60">
                          Arrastra atributos aquí
                        </div>
                      ) : (
                        clase.atributosAsignados.map((atributo) => (
                          <div
                            key={atributo.id}
                            className={`flex items-center justify-between rounded-md p-1.5 text-xs ${
                              mostrarResultado
                                ? atributo.esCorrecto
                                  ? "border border-green-300 bg-green-100/60"
                                  : "border border-red-300 bg-red-100/60"
                                : PREDEFINED_IDS.includes(atributo.id)
                                  ? "border border-brand-mid/50 bg-brand-soft/30"
                                  : "border border-brand-mid bg-brand-soft/40"
                            }`}
                          >
                            <div>
                              <span
                                className={`font-medium ${
                                  mostrarResultado && !atributo.esCorrecto
                                    ? "text-red-600"
                                    : "text-brand-support"
                                }`}
                              >
                                {atributo.nombre}
                              </span>
                            </div>
                            {!mostrarResultado &&
                              !PREDEFINED_IDS.includes(atributo.id) && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveAttribute(clase.id, atributo.id)
                                  }
                                  className="text-sm font-bold text-red-500 hover:text-red-700"
                                  title="Quitar"
                                  aria-label="Quitar atributo"
                                >
                                  <TrashIcon />
                                </button>
                              )}
                            {PREDEFINED_IDS.includes(atributo.id) && (
                              <span className="font-medium text-brand-support/70">
                                Ejemplo
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CanchaBackground>
  );
}