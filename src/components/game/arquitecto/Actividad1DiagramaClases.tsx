"use client";

import { useState, type DragEvent } from "react";
import CanchaBackground from "./CanchaBackground";

interface Clase {
  id: string;
  nombre: string;
  posicion: { x: number; y: number };
  esCorrecta: boolean;
  pista: string;
}

interface Relacion {
  desde: string;
  hacia: string;
  nombre: string;
  tipo: "asociacion" | "dependencia" | "composicion";
}

interface PalabraOpcion {
  id: string;
  texto: string;
  usada: boolean;
}

interface Actividad1Props {
  onComplete: (score: number) => void;
}

const BRAND_LINE = "#45609B";
const BRAND_TEXT = "#6E7FA2";

const RESPONSES: Record<string, string> = {
  equipo: "Equipo",
  jugador: "Jugador",
  partido: "Partido",
  estadistica: "Estadistica",
  tactica: "Tactica",
};

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export default function Actividad1DiagramaClases({ onComplete }: Actividad1Props) {
  const [clases, setClases] = useState<Clase[]>([
    {
      id: "equipo",
      nombre: "",
      posicion: { x: 50, y: 8 },
      esCorrecta: false,
      pista: "Representa al grupo completo que compite...",
    },
    {
      id: "jugador",
      nombre: "",
      posicion: { x: 15, y: 30 },
      esCorrecta: false,
      pista: "Cada persona que juega en el campo...",
    },
    {
      id: "partido",
      nombre: "",
      posicion: { x: 85, y: 30 },
      esCorrecta: false,
      pista: "El evento completo donde se enfrentan dos equipos...",
    },
    {
      id: "estadistica",
      nombre: "",
      posicion: { x: 25, y: 70 },
      esCorrecta: false,
      pista: "Los números y datos que miden el rendimiento...",
    },
    {
      id: "tactica",
      nombre: "",
      posicion: { x: 75, y: 70 },
      esCorrecta: false,
      pista: "El plan estratégico para ganar el juego...",
    },
  ]);

  const relaciones: Relacion[] = [
    { desde: "equipo", hacia: "jugador", nombre: "contiene", tipo: "composicion" },
    { desde: "equipo", hacia: "partido", nombre: "participa", tipo: "asociacion" },
    { desde: "jugador", hacia: "estadistica", nombre: "genera", tipo: "asociacion" },
    { desde: "partido", hacia: "tactica", nombre: "usa", tipo: "dependencia" },
    { desde: "partido", hacia: "estadistica", nombre: "produce", tipo: "asociacion" },
    { desde: "estadistica", hacia: "tactica", nombre: "informa", tipo: "dependencia" },
  ];

  const [palabras, setPalabras] = useState<PalabraOpcion[]>([
    { id: "p1", texto: "Equipo", usada: false },
    { id: "p2", texto: "Jugador", usada: false },
    { id: "p3", texto: "Partido", usada: false },
    { id: "p4", texto: "Estadistica", usada: false },
    { id: "p5", texto: "Tactica", usada: false },
    { id: "d1", texto: "Campo", usada: false },
    { id: "d2", texto: "Balon", usada: false },
    { id: "d3", texto: "Arbitro", usada: false },
    { id: "d4", texto: "Gol", usada: false },
    { id: "d5", texto: "Tiempo", usada: false },
  ]);

  const [draggedWord, setDraggedWord] = useState<string | null>(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const handleDragStart = (e: DragEvent, palabraId: string) => {
    setDraggedWord(palabraId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent, claseId: string) => {
    e.preventDefault();
    if (!draggedWord) return;

    const palabra = palabras.find((p) => p.id === draggedWord);
    if (!palabra || palabra.usada) return;

    setClases((prev) =>
      prev.map((clase) =>
        clase.id === claseId
          ? {
              ...clase,
              nombre: palabra.texto,
              esCorrecta: palabra.texto === RESPONSES[clase.id],
            }
          : clase,
      ),
    );

    setPalabras((prev) =>
      prev.map((p) => (p.id === draggedWord ? { ...p, usada: true } : p)),
    );

    setDraggedWord(null);
  };

  const handleRemoveWord = (claseId: string) => {
    const clase = clases.find((c) => c.id === claseId);
    if (!clase || !clase.nombre) return;

    setPalabras((prev) =>
      prev.map((p) => (p.texto === clase.nombre ? { ...p, usada: false } : p)),
    );

    setClases((prev) =>
      prev.map((c) =>
        c.id === claseId ? { ...c, nombre: "", esCorrecta: false } : c,
      ),
    );
  };

  const calcularScore = () => {
    const correctas = clases.filter((c) => c.esCorrecta).length;
    const incorrectas = clases.filter((c) => c.nombre && !c.esCorrecta).length;
    return Math.min(200, Math.max(0, correctas * 50 - incorrectas * 10));
  };

  const handleSubmit = () => {
    setMostrarResultado(true);
    const score = calcularScore();
    setTimeout(() => onComplete(score), 2000);
  };

  const resetActivity = () => {
    setClases((prev) => prev.map((c) => ({ ...c, nombre: "", esCorrecta: false })));
    setPalabras((prev) => prev.map((p) => ({ ...p, usada: false })));
    setMostrarResultado(false);
    setDraggedWord(null);
  };

  const todasCompletas = clases.every((c) => c.nombre !== "");

  const getPos = (id: string) => {
    const clase = clases.find((c) => c.id === id);
    return clase ? clase.posicion : { x: 0, y: 0 };
  };

  return (
    <CanchaBackground>
      <div className="flex h-full w-full min-h-0 flex-col">
        <div className="mb-3 flex-shrink-0">
          <h3 className="mb-1 text-lg font-bold text-brand-support">
            Actividad 1: Diseño Estructural del Sistema
          </h3>
          <p className="text-xs text-brand-support/80">
            Arrastra los nombres correctos a cada clase del diagrama. Analiza
            las relaciones para identificar cada componente.
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
          <div className="flex-shrink-0 lg:w-72">
            <div className="flex h-full flex-col rounded-xl border-2 border-brand-soft bg-white/70 p-3">
              <h4 className="mb-2 text-xs font-semibold text-brand-support">
                Nombres Disponibles:
              </h4>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {palabras.filter((p) => !p.usada).map((palabra) => (
                  <div
                    key={palabra.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, palabra.id)}
                    className="cursor-move rounded-md border border-brand-mid bg-brand-soft/40 px-2 py-1 text-xs shadow-sm transition-colors select-none hover:bg-brand-soft/70"
                  >
                    <span className="font-semibold text-brand-support">
                      {palabra.texto}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mb-3 flex-shrink-0 rounded-lg border border-brand-mid/50 bg-brand-soft/30 p-2 text-xs text-brand-support">
                <strong>Analiza las relaciones:</strong> Las líneas muestran cómo
                se conectan las clases.
              </div>

              <div className="mt-auto flex flex-col gap-2">
                <button
                  type="button"
                  onClick={resetActivity}
                  className="rounded-full border border-brand-soft px-4 py-1.5 text-sm font-semibold text-brand-support transition-all hover:border-brand-support"
                >
                  Reiniciar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!todasCompletas || mostrarResultado}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                    todasCompletas && !mostrarResultado
                      ? "bg-brand-primary text-white hover:bg-brand-mid"
                      : "cursor-not-allowed bg-brand-light text-brand-support/50"
                  }`}
                >
                  {mostrarResultado ? `Score: ${calcularScore()} pts` : "Validar Diagrama"}
                </button>
              </div>

              {mostrarResultado && (
                <div className="mt-3 text-center">
                  <div
                    className={`text-sm font-semibold ${
                      calcularScore() >= 200
                        ? "text-green-600"
                        : calcularScore() >= 100
                          ? "text-brand-primary"
                          : "text-orange-500"
                    }`}
                  >
                    {calcularScore() >= 200
                      ? "¡Perfecto! Dominaste el diseño estructural"
                      : calcularScore() >= 100
                        ? "¡Buen trabajo! La mayoría son correctas"
                        : "Sigue practicando el análisis arquitectónico"}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="min-h-0 flex-1 lg:min-h-[500px]">
            <div
              className="relative h-full rounded-xl border-2 border-brand-soft bg-gray-50/60 p-4"
              style={{ minHeight: "450px" }}
            >
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {relaciones.map((rel) => {
                  const a = getPos(rel.desde);
                  const b = getPos(rel.hacia);
                  return (
                    <g key={rel.nombre}>
                      <line
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke={BRAND_LINE}
                        strokeWidth="0.3"
                        strokeDasharray={rel.tipo === "dependencia" ? "2,1" : undefined}
                        vectorEffect="non-scaling-stroke"
                      />
                      <text
                        x={(a.x + b.x) / 2}
                        y={(a.y + b.y) / 2 - 1}
                        fill={BRAND_TEXT}
                        fontSize="2.4"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {rel.nombre}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {clases.map((clase) => (
                <div
                  key={clase.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, clase.id)}
                  className={`absolute rounded-lg border-2 p-2 shadow-sm transition-all ${
                    mostrarResultado
                      ? clase.esCorrecta
                        ? "border-green-400 bg-green-100"
                        : "border-red-400 bg-red-100"
                      : "border-brand-soft bg-white/90 hover:border-brand-primary"
                  }`}
                  style={{
                    left: `${clase.posicion.x}%`,
                    top: `${clase.posicion.y}%`,
                    transform: "translate(-50%, -50%)",
                    width: "130px",
                    minHeight: "75px",
                    zIndex: 10,
                  }}
                >
                  <div className="text-center">
                    <h5 className="mb-1 text-sm font-bold text-brand-support">
                      {clase.nombre || "?"}
                    </h5>
                    {clase.nombre ? (
                      <div>
                        <span
                          className={`text-sm ${
                            mostrarResultado && !clase.esCorrecta
                              ? "text-red-600"
                              : "text-brand-support"
                          }`}
                        >
                          {clase.esCorrecta
                            ? "✓ Correcto"
                            : mostrarResultado
                              ? "✗ Incorrecto"
                              : clase.nombre}
                        </span>
                        {!mostrarResultado && (
                          <button
                            type="button"
                            onClick={() => handleRemoveWord(clase.id)}
                            className="ml-1 text-xs text-red-500 hover:text-red-700"
                            title="Quitar"
                            aria-label="Quitar palabra"
                          >
                            <TrashIcon />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="px-1 text-xs leading-tight text-brand-support/70 italic">
                          {clase.pista}
                        </div>
                        <div className="mt-1 text-sm text-brand-support/50">
                          Arrastra aquí
                        </div>
                      </div>
                    )}
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