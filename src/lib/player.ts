import type { AvatarId } from "./avatars";

export interface Player {
  name: string;
  avatar: AvatarId;
}

const PLAYER_KEY = "icesi-player";

export function savePlayer(player: Player): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
}

export function loadPlayer(): Player | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PLAYER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Player;
    if (!parsed.name || !parsed.avatar) return null;
    return parsed;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Nombres ya usados en este computador                                 */
/* ------------------------------------------------------------------ */

const USED_NAMES_KEY = "icesi-nombres-usados";

/** "  Juán  Pérez " -> "juan perez": ignora mayúsculas, tildes y espacios extra. */
export function normalizarNombre(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function leerNombresUsados(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USED_NAMES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((n): n is string => typeof n === "string") : [];
  } catch {
    return [];
  }
}

/** true si alguien ya se registró con ese nombre en este computador. */
export function nombreYaUsado(nombre: string): boolean {
  return leerNombresUsados().includes(normalizarNombre(nombre));
}

export function registrarNombreUsado(nombre: string): void {
  if (typeof window === "undefined") return;
  const normalizado = normalizarNombre(nombre);
  const usados = leerNombresUsados();
  if (usados.includes(normalizado)) return;
  try {
    window.localStorage.setItem(USED_NAMES_KEY, JSON.stringify([...usados, normalizado]));
  } catch {
    return;
  }
}
