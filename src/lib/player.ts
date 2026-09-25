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