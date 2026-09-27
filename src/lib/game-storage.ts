import { loadPlayer } from "./player";

const getPlayerKey = (): string => {
  if (typeof window === "undefined") return "guest";
  const name = loadPlayer()?.name?.trim();
  return name || "guest";
};

export type RolKey = "arquitecto" | "fullstack";

function storageKey(rol: RolKey): string {
  return `${getPlayerKey()}_${rol}_scores`;
}

export function getActivityScores(rol: RolKey): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(storageKey(rol));
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

export function saveActivityScore(
  rol: RolKey,
  actividad: string,
  score: number,
): void {
  if (typeof window === "undefined") return;
  const prev = getActivityScores(rol);
  prev[actividad] = score;
  window.localStorage.setItem(storageKey(rol), JSON.stringify(prev));
}