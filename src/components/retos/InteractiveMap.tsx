"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  RUTA_STAGES,
  MAPA_BACKGROUND_IMAGE,
  MAPA_BACKGROUND_COLOR,
  getMaxCompletedStage,
  getStageStatus,
  type RutaStage,
  type StageStatus,
} from "@/lib/ruta-progress";
import { loadPlayer } from "@/lib/player";
import { getAvatarSrc } from "@/lib/avatars";
import { useHasHydrated } from "@/lib/use-has-hydrated";
import { isStageUnlocked } from "@/lib/stage-access";
import StagePasswordPrompt from "./StagePasswordPrompt";

interface Point {
  x: number;
  y: number;
}

interface BezierSegment {
  p0: Point;
  p1: Point;
  p2: Point;
  p3: Point;
}

const DEFAULT_BEZIER_SEGMENTS: BezierSegment[] = [
  { p0: { x: 48.5, y: 88 }, p1: { x: 48, y: 83 }, p2: { x: 47, y: 78 }, p3: { x: 47.5, y: 73 } },
  { p0: { x: 47.5, y: 73 }, p1: { x: 49, y: 66 }, p2: { x: 53.5, y: 60 }, p3: { x: 52, y: 52 } },
  { p0: { x: 52, y: 52 }, p1: { x: 50, y: 46 }, p2: { x: 45.5, y: 41 }, p3: { x: 47, y: 35 } },
  { p0: { x: 47, y: 35 }, p1: { x: 49, y: 29 }, p2: { x: 53, y: 24 }, p3: { x: 54, y: 19 } },
];

/**
 * Calcula los segmentos Bézier dinámicamente según las posiciones de las paradas.
 */
function computeDynamicSegments(positions: Record<number, Point>): BezierSegment[] {
  const isDefault =
    positions[0]?.x === 48.5 && positions[0]?.y === 88 &&
    positions[1]?.x === 47.5 && positions[1]?.y === 73 &&
    positions[2]?.x === 52 && positions[2]?.y === 52 &&
    positions[3]?.x === 47 && positions[3]?.y === 35 &&
    positions[4]?.x === 54 && positions[4]?.y === 19;

  if (isDefault) {
    return DEFAULT_BEZIER_SEGMENTS;
  }

  const segments: BezierSegment[] = [];
  for (let i = 0; i < 4; i++) {
    const pA = positions[i] ?? { x: 50, y: 50 };
    const pB = positions[i + 1] ?? { x: 50, y: 50 };
    const dx = pB.x - pA.x;
    const dy = pB.y - pA.y;
    const sign = i % 2 === 0 ? 1 : -1;
    segments.push({
      p0: { x: pA.x, y: pA.y },
      p1: {
        x: Number((pA.x + dx * 0.33 + sign * dy * 0.15).toFixed(2)),
        y: Number((pA.y + dy * 0.33 - sign * dx * 0.15).toFixed(2)),
      },
      p2: {
        x: Number((pA.x + dx * 0.67 - sign * dy * 0.15).toFixed(2)),
        y: Number((pA.y + dy * 0.67 + sign * dx * 0.15).toFixed(2)),
      },
      p3: { x: pB.x, y: pB.y },
    });
  }
  return segments;
}

function buildSvgPathD(segments: BezierSegment[]): string {
  if (segments.length === 0) return "";
  let d = `M ${segments[0].p0.x} ${segments[0].p0.y}`;
  for (const seg of segments) {
    d += ` C ${seg.p1.x} ${seg.p1.y}, ${seg.p2.x} ${seg.p2.y}, ${seg.p3.x} ${seg.p3.y}`;
  }
  return d;
}

function getTraversedPathD(stage: number, segments: BezierSegment[]): string | null {
  if (stage <= 0 || segments.length === 0) return null;
  let d = `M ${segments[0].p0.x} ${segments[0].p0.y}`;
  const count = Math.min(stage, segments.length);
  for (let i = 0; i < count; i++) {
    const seg = segments[i];
    d += ` C ${seg.p1.x} ${seg.p1.y}, ${seg.p2.x} ${seg.p2.y}, ${seg.p3.x} ${seg.p3.y}`;
  }
  return d;
}

function getPathKeyframes(
  fromStage: number,
  toStage: number,
  segments: BezierSegment[],
  positions: Record<number, Point>
): { x: number[]; y: number[] } {
  const clampedFrom = Math.min(Math.max(0, fromStage), 4);
  const clampedTo = Math.min(Math.max(0, toStage), 4);

  if (clampedFrom === clampedTo) {
    const pt = positions[clampedTo] ?? { x: 50, y: 50 };
    return { x: [pt.x], y: [pt.y] };
  }

  const STEPS = 16;
  const points: Point[] = [];

  if (clampedFrom < clampedTo) {
    for (let segIdx = clampedFrom; segIdx < clampedTo; segIdx++) {
      const seg = segments[segIdx] ?? DEFAULT_BEZIER_SEGMENTS[0];
      const startI = segIdx === clampedFrom ? 0 : 1;
      for (let i = startI; i <= STEPS; i++) {
        const t = i / STEPS;
        const mt = 1 - t;
        const x =
          mt * mt * mt * seg.p0.x +
          3 * mt * mt * t * seg.p1.x +
          3 * mt * t * t * seg.p2.x +
          t * t * t * seg.p3.x;
        const y =
          mt * mt * mt * seg.p0.y +
          3 * mt * mt * t * seg.p1.y +
          3 * mt * t * t * seg.p2.y +
          t * t * t * seg.p3.y;
        points.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
      }
    }
  } else {
    for (let segIdx = clampedFrom - 1; segIdx >= clampedTo; segIdx--) {
      const seg = segments[segIdx] ?? DEFAULT_BEZIER_SEGMENTS[0];
      const startI = segIdx === clampedFrom - 1 ? STEPS : STEPS - 1;
      for (let i = startI; i >= 0; i--) {
        const t = i / STEPS;
        const mt = 1 - t;
        const x =
          mt * mt * mt * seg.p0.x +
          3 * mt * mt * t * seg.p1.x +
          3 * mt * t * t * seg.p2.x +
          t * t * t * seg.p3.x;
        const y =
          mt * mt * mt * seg.p0.y +
          3 * mt * mt * t * seg.p1.y +
          3 * mt * t * t * seg.p2.y +
          t * t * t * seg.p3.y;
        points.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
      }
    }
  }

  return {
    x: points.map((p) => p.x),
    y: points.map((p) => p.y),
  };
}

/** Marcador de Punto 0 (Inicio) */
function RedXMarker({
  x,
  y,
  customIconUrl,
  isCompleted,
  isCurrent,
  onClick,
}: {
  x: number;
  y: number;
  customIconUrl?: string | null;
  isCompleted: boolean;
  isCurrent: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Punto 0: Inicio de la ruta"
      className="group absolute z-15 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center cursor-pointer focus:outline-none"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="relative flex items-center justify-center">
        {isCurrent && (
          <span className="absolute -inset-2 rounded-full bg-rose-500/25 animate-ping pointer-events-none" />
        )}

        {customIconUrl ? (
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center">
            <Image
              src={customIconUrl}
              alt="Inicio"
              fill
              sizes="56px"
              className="object-contain drop-shadow-md select-none pointer-events-none"
            />
          </div>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-rose-600 transition-transform duration-200 group-hover:scale-115 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            aria-hidden="true"
          >
            <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        )}
      </div>

      <span className="mt-0.5 rounded-full bg-slate-950/85 px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-rose-200 shadow-md backdrop-blur whitespace-nowrap">
        {isCompleted ? "✓ Inicio" : "Partida"}
      </span>
    </button>
  );
}

/** Marcador interactivo para las paradas 1 a 4 con soporte de icono transparente y círculo parpadeante en activa */
function StationInteractiveHotspot({
  stage,
  x,
  y,
  status,
  onNavigate,
}: {
  stage: RutaStage;
  x: number;
  y: number;
  status: StageStatus;
  onNavigate: () => void;
}) {
  const isActive = status === "active";
  const isLocked = status === "locked";
  const iconSrc = stage.imageSrc;

  if (isLocked) {
    return (
      <div
        className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none"
        style={{ left: `${x}%`, top: `${y}%` }}
        aria-hidden="true"
      >
        <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 items-center justify-center">
          {iconSrc && (
            <Image
              src={iconSrc}
              alt={stage.title}
              fill
              sizes="112px"
              className="object-contain p-0.5 select-none pointer-events-none opacity-40 grayscale-[40%]"
              draggable={false}
            />
          )}
          {/* Candado en el centro */}
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-slate-950/80 text-white/90 shadow-md z-10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
            >
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (isActive) {
    return (
      <button
        type="button"
        onClick={onNavigate}
        aria-label={`Estación activa: ${stage.title} - ${stage.role}. Toca para comenzar reto.`}
        title={`${stage.title} (${stage.role}) - ¡Toca para ingresar!`}
        className="group absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
        style={{ left: `${x}%`, top: `${y}%` }}
      >
        <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 items-center justify-center">
          {/* Círculo parpadeante y expansivo de la siguiente actividad activa */}
          <span className="absolute inset-1 rounded-full bg-amber-400/25 animate-ping pointer-events-none -z-10" />
          <span className="absolute -inset-1 rounded-full border-2 border-amber-400/70 animate-pulse pointer-events-none -z-10" />

          {/* Icono flotante con fondo transparente */}
          {iconSrc ? (
            <Image
              src={iconSrc}
              alt={stage.title}
              fill
              sizes="112px"
              className="object-contain p-0.5 select-none pointer-events-none drop-shadow-[0_0_16px_rgba(251,191,36,0.9)] scale-110 transition-transform duration-200 group-hover:scale-125"
              draggable={false}
            />
          ) : (
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-md">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 ml-0.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          )}
        </div>

        {/* Tooltip flotante con título */}
        <div className="absolute left-1/2 top-[calc(100%+4px)] -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-950/90 px-3 py-1 text-[11px] sm:text-xs font-black text-amber-300 shadow-2xl backdrop-blur flex items-center gap-1.5 transition-transform group-hover:scale-105">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          <span>{stage.title}</span>
        </div>
      </button>
    );
  }

  // Parada completada
  return (
    <button
      type="button"
      onClick={onNavigate}
      aria-label={`Estación completada: ${stage.title} - ${stage.role}. Clic para repasar.`}
      title={`${stage.title} (${stage.role}) - Completada. Clic para repasar.`}
      className="group absolute z-15 -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 items-center justify-center">
        {/* Icono transparente completado */}
        {iconSrc && (
          <Image
            src={iconSrc}
            alt={stage.title}
            fill
            sizes="112px"
            className="object-contain p-0.5 select-none pointer-events-none drop-shadow-[0_0_10px_rgba(34,197,94,0.6)] transition-all duration-200 group-hover:scale-115"
            draggable={false}
          />
        )}

        {/* Checkmark verde en la esquina superior del logo */}
        <span className="absolute -right-1 -top-1 sm:-right-2 sm:-top-2 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg z-10 font-bold">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3 w-3 sm:h-3.5 sm:w-3.5"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>
      </div>

      <div className="absolute left-1/2 top-[calc(100%+3px)] -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900/85 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-emerald-300 shadow backdrop-blur opacity-90 group-hover:opacity-100">
        ✓ {stage.title}
      </div>
    </button>
  );
}

export default function InteractiveMap() {
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Progreso del juego
  const [maxCompleted, setMaxCompleted] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<number>(0);

  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [isLanding, setIsLanding] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  // Parada que espera contraseña antes de abrirse
  const [stagePendiente, setStagePendiente] = useState<RutaStage | null>(null);

  // Posiciones efectivas de cada estación directamente desde src/lib/ruta-progress.ts
  const stagePositions = useMemo(() => {
    const res: Record<number, Point> = {};
    for (let i = 0; i <= 4; i++) {
      const stage = RUTA_STAGES[i];
      res[i] = {
        x: stage?.x ?? 50,
        y: stage?.y ?? 50,
      };
    }
    return res;
  }, []);

  // Segmentos y trazado Bézier dinámicos
  const segments = useMemo(() => computeDynamicSegments(stagePositions), [stagePositions]);
  const pathD = useMemo(() => buildSvgPathD(segments), [segments]);
  const traversedPathD = useMemo(() => getTraversedPathD(maxCompleted, segments), [maxCompleted, segments]);

  // Keyframes de animación
  const [animKeyframes, setAnimKeyframes] = useState<{ x: number[]; y: number[] }>({
    x: [RUTA_STAGES[0]?.x ?? 48.5],
    y: [RUTA_STAGES[0]?.y ?? 88],
  });

  // Carga inicial de progreso
  useEffect(() => {
    if (!hasHydrated) return;

    const animId = requestAnimationFrame(() => {
      const storedProgress = getMaxCompletedStage();
      setMaxCompleted(storedProgress);

      const sessionKey = "icesi-last-stage-animated";
      const lastAnimatedRaw = typeof window !== "undefined" ? window.sessionStorage.getItem(sessionKey) : null;
      const lastAnimated = lastAnimatedRaw !== null ? Number(lastAnimatedRaw) : null;

      const currentPts: Record<number, Point> = {};
      for (let i = 0; i <= 4; i++) {
        const d = RUTA_STAGES[i];
        currentPts[i] = { x: d?.x ?? 50, y: d?.y ?? 50 };
      }
      const dynSegs = computeDynamicSegments(currentPts);

      if (lastAnimated !== null && lastAnimated < storedProgress) {
        setCurrentStage(storedProgress);
        const kf = getPathKeyframes(lastAnimated, storedProgress, dynSegs, currentPts);
        setAnimKeyframes(kf);
        setIsMoving(true);
        window.sessionStorage.setItem(sessionKey, String(storedProgress));
      } else {
        setCurrentStage(storedProgress);
        const pt = currentPts[storedProgress] ?? currentPts[0];
        setAnimKeyframes({ x: [pt.x], y: [pt.y] });
        window.sessionStorage.setItem(sessionKey, String(storedProgress));
      }

      setHasMounted(true);
    });

    return () => cancelAnimationFrame(animId);
  }, [hasHydrated]);

  const moveAvatarToStage = (targetStage: number) => {
    if (targetStage === currentStage || isMoving) return;
    const kf = getPathKeyframes(currentStage, targetStage, segments, stagePositions);
    setAnimKeyframes(kf);
    setIsMoving(true);
    setCurrentStage(targetStage);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("icesi-last-stage-animated", String(targetStage));
    }
  };

  const irAParadaActiva = (stage: RutaStage) => {
    if (currentStage !== stage.index) {
      moveAvatarToStage(stage.index);
      setTimeout(() => {
        router.push(stage.href);
      }, 1200);
    } else {
      router.push(stage.href);
    }
  };

  const handleStageClick = (stage: RutaStage, status: StageStatus) => {
    if (status === "locked") return;

    if (status === "active") {
      // Cada parada nueva pide la contraseña que entregan los guías
      if (!isStageUnlocked(stage.index)) {
        setStagePendiente(stage);
        return;
      }
      irAParadaActiva(stage);
      return;
    }

    if (status === "completed") {
      router.push(stage.href);
    }
  };

  const player = hasHydrated ? loadPlayer() : null;
  const avatarSrc = player ? getAvatarSrc(player.avatar) : "/media/avatars/av-companion.svg";
  const playerName = player?.name ?? null;

  return (
    <div
      ref={mapContainerRef}
      className="relative overflow-hidden select-none flex items-center justify-center h-dvh w-screen transition-colors duration-300"
      style={{ backgroundColor: MAPA_BACKGROUND_COLOR }}
    >
      {/* Imagen del mapa a pantalla completa */}
      <Image
        src={MAPA_BACKGROUND_IMAGE}
        alt="Mapa de retos de Cali"
        fill
        priority
        sizes="100vw"
        draggable={false}
        className="object-cover select-none pointer-events-none"
      />

      {/* Camino estilo mapa del tesoro */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d={pathD}
          fill="none"
          stroke="#4a2c11"
          strokeOpacity="0.48"
          strokeWidth="1.1"
          strokeDasharray="1.8 2.4"
          strokeLinecap="round"
        />
        {traversedPathD && (
          <>
            <path
              d={traversedPathD}
              fill="none"
              stroke="#EC6449"
              strokeWidth="1.7"
              strokeDasharray="1.8 2.2"
              strokeLinecap="round"
            />
            <path
              d={traversedPathD}
              fill="none"
              stroke="#C63254"
              strokeWidth="0.9"
              strokeDasharray="1.8 2.2"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>

      {/* Punto 0: Inicio */}
      <RedXMarker
        x={stagePositions[0].x}
        y={stagePositions[0].y}
        customIconUrl={RUTA_STAGES[0]?.imageSrc}
        isCompleted={maxCompleted >= 0}
        isCurrent={currentStage === 0}
        onClick={() => moveAvatarToStage(0)}
      />

      {/* Puntos 1 a 4: Estaciones culturales y retos */}
      {RUTA_STAGES.slice(1).map((stage) => {
        const status = getStageStatus(stage.index, maxCompleted);
        const pos = stagePositions[stage.index];

        return (
          <StationInteractiveHotspot
            key={stage.index}
            stage={stage}
            x={pos.x}
            y={pos.y}
            status={status}
            onNavigate={() => handleStageClick(stage, status)}
          />
        );
      })}

      {/* Avatar flotante */}
      {hasHydrated && hasMounted && (
        <motion.div
          initial={false}
          animate={{
            left: animKeyframes.x.map((x) => `${x}%`),
            top: animKeyframes.y.map((y) => `${y}%`),
          }}
          transition={{
            duration: isMoving ? 1.8 : 0,
            ease: [0.4, 0, 0.2, 1],
          }}
          onAnimationStart={() => setIsMoving(true)}
          onAnimationComplete={() => {
            setIsMoving(false);
            setIsLanding(true);
            setTimeout(() => setIsLanding(false), 900);
          }}
          style={{
            position: "absolute",
            transform: "translate(-50%, -50%)",
            zIndex: 35,
          }}
          className="pointer-events-none"
        >
          <motion.div
            animate={
              isLanding
                ? {
                    scale: [1, 1.32, 0.9, 1.1, 1],
                    y: [0, -16, 2, -6, 0],
                  }
                : isMoving
                ? { scale: 1.15 }
                : { y: [0, -4, 0] }
            }
            transition={
              isLanding
                ? { duration: 0.85, ease: "easeOut" }
                : isMoving
                ? { duration: 0.3 }
                : { repeat: Infinity, duration: 2.4, ease: "easeInOut" }
            }
            className="relative flex flex-col items-center"
          >
            <div className="relative h-13 w-13 sm:h-16 sm:w-16 md:h-20 md:w-20 overflow-hidden rounded-full border-3 sm:border-4 border-white bg-slate-900 shadow-2xl ring-4 ring-amber-400">
              <Image
                src={avatarSrc}
                alt={playerName || "Tu avatar"}
                fill
                sizes="(max-width: 640px) 64px, 80px"
                className="object-cover select-none"
                draggable={false}
              />
            </div>

            <div className="mt-1 whitespace-nowrap rounded-full bg-slate-950/90 px-2.5 py-0.5 text-[10px] sm:text-xs font-black text-amber-300 shadow-lg border border-amber-400/40 backdrop-blur">
              {playerName || "Explorador"}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Contraseña de la parada */}
      {stagePendiente && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
          onClick={() => setStagePendiente(null)}
        >
          <div className="flex w-full max-w-5xl justify-center" onClick={(event) => event.stopPropagation()}>
            <StagePasswordPrompt
              stage={stagePendiente}
              onUnlocked={() => {
                const stage = stagePendiente;
                setStagePendiente(null);
                irAParadaActiva(stage);
              }}
              onCancel={() => setStagePendiente(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
