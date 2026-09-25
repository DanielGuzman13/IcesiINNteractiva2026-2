export function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function shouldShowTip(): boolean {
  return Math.random() > 0.7;
}