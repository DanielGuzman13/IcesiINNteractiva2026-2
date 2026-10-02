export const RUTA_PROGRESS_KEY = "icesi-ruta-progress";

/** Imagen de la ilustración del mapa (formato PNG transparente sin fondo) */
export const MAPA_BACKGROUND_IMAGE = "/mapa/mapa-sin-fondo.png";

/**
 * Color de fondo RGB de la pantalla de retos detrás del mapa transparente.
 * Puedes escribirlo como RGB, HEX o cualquier color CSS válido.
 * Ejemplos:
 *   "rgb(156, 216, 180)"  -> Verde menta original
 *   "rgb(30, 41, 59)"     -> Modo oscuro elegante
 *   "rgb(248, 250, 252)"  -> Blanco / gris claro
 */
export const MAPA_BACKGROUND_COLOR = "#E2ECDF"; // Verde Farallones apagado (paleta Cali nos une)

/**
 * Desplazamiento vertical del mapa para despegarlo del borde inferior.
 * Valores negativos (ej: "-4%", "-5%" o "-35px") suben el mapa hacia arriba.
 */
export const MAPA_OFFSET_Y = "-4%";

export type RutaStageIcon = "inicio" | "trofeo" | "chiva" | "marimba" | "atleta";

export interface RutaStage {
  index: number;
  title: string;
  role: string;
  event: string;
  icon: RutaStageIcon;
  imageSrc?: string;
  x: number;
  y: number;
  href: string;
}

export const RUTA_STAGES: RutaStage[] = [
  {
    index: 0,
    title: "Inicio",
    role: "Punto de partida",
    event: "Registro del equipo",
    icon: "inicio",
    x: 50.5,
    y: 95,
    href: "",
  },
  {
    index: 1,
    title: "Mundial de Salsa",
    role: "Analista de Requerimientos",
    event: "El trofeo mundial",
    icon: "trofeo",
    imageSrc: "/mapa/mundialSalsa.png",
    x: 46.5,
    y: 73,
    href: "/retos/analista",
  },
  {
    index: 2,
    title: "Feria de Cali",
    role: "Arquitecto de Software",
    event: "La chiva recorriendo el Salsódromo",
    icon: "chiva",
    imageSrc: "/mapa/feria.png",
    x: 52,
    y: 52,
    href: "/retos/arquitecto",
  },
  {
    index: 3,
    title: "Petronio Álvarez",
    role: "Full Stack Developer",
    event: "La marimba suena en el río",
    icon: "marimba",
    imageSrc: "/mapa/petronio.png",
    x: 47,
    y: 35,
    href: "/retos/backend",
  },
  {
    index: 4,
    title: "Carrera del Pacífico",
    role: "QA & Ciberseguridad",
    event: "La meta junto al río",
    icon: "atleta",
    imageSrc: "/mapa/carrera10k.png",
    x: 56,
    y: 17,
    href: "/retos/qa",
  },
];

function readMaxCompletedStage(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(RUTA_PROGRESS_KEY);
    if (!raw) return 0;
    const n = Number(raw);
    if (!Number.isFinite(n)) return 0;
    return Math.min(Math.max(0, Math.round(n)), RUTA_STAGES.length - 1);
  } catch {
    return 0;
  }
}

export function getMaxCompletedStage(): number {
  return readMaxCompletedStage();
}

export function completeStage(index: number): void {
  if (typeof window === "undefined") return;
  const current = readMaxCompletedStage();
  if (index <= current) return;
  const next = Math.min(index, RUTA_STAGES.length - 1);
  try {
    window.localStorage.setItem(RUTA_PROGRESS_KEY, String(next));
  } catch {
    return;
  }
}

export function getNextStage(): RutaStage | null {
  const nextIndex = getMaxCompletedStage() + 1;
  return RUTA_STAGES[nextIndex] ?? null;
}

export type StageStatus = "completed" | "active" | "locked";

export function getStageStatus(index: number, maxCompleted: number): StageStatus {
  if (index <= maxCompleted) return "completed";
  if (index === maxCompleted + 1) return "active";
  return "locked";
}

export function resetRutaProgress(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(RUTA_PROGRESS_KEY);
  } catch {
    return;
  }
}

export function setRutaProgress(stage: number): void {
  if (typeof window === "undefined") return;
  const clamped = Math.min(Math.max(0, Math.round(stage)), RUTA_STAGES.length - 1);
  try {
    window.localStorage.setItem(RUTA_PROGRESS_KEY, String(clamped));
  } catch {
    return;
  }
}