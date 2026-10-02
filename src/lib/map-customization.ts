export interface StageCustomization {
  iconUrl?: string | null;
  x: number;
  y: number;
}

export interface MapCustomization {
  backgroundImageUrl: string | null;
  fillScreen: boolean;
  aspectRatio: string;
  stages: Record<number, StageCustomization>;
}

export const STORAGE_CUSTOM_MAP_KEY = "icesi-custom-map-config-v3";

export const DEFAULT_STAGES_POSITIONS: Record<number, { x: number; y: number }> = {
  0: { x: 48.5, y: 88 },
  1: { x: 47.5, y: 73 },
  2: { x: 52, y: 52 },
  3: { x: 47, y: 35 },
  4: { x: 54, y: 19 },
};

export const DEFAULT_MAP_CUSTOMIZATION: MapCustomization = {
  backgroundImageUrl: "/mapa/4.jpeg",
  fillScreen: true,
  aspectRatio: "2752 / 1536",
  stages: {
    0: { x: 48.5, y: 88, iconUrl: null },
    1: { x: 47.5, y: 73, iconUrl: "/mapa/mundialSalsa.png" },
    2: { x: 52, y: 52, iconUrl: "/mapa/feria.png" },
    3: { x: 47, y: 35, iconUrl: "/mapa/petronio.png" },
    4: { x: 54, y: 19, iconUrl: "/mapa/carrera10k.png" },
  },
};

export function loadMapCustomization(): MapCustomization {
  if (typeof window === "undefined") return DEFAULT_MAP_CUSTOMIZATION;
  try {
    const raw = window.localStorage.getItem(STORAGE_CUSTOM_MAP_KEY);
    if (!raw) return DEFAULT_MAP_CUSTOMIZATION;
    const parsed = JSON.parse(raw) as Partial<MapCustomization>;
    return {
      backgroundImageUrl: parsed.backgroundImageUrl ?? null,
      fillScreen: Boolean(parsed.fillScreen),
      aspectRatio: parsed.aspectRatio || "577 / 709",
      stages: {
        0: { ...DEFAULT_MAP_CUSTOMIZATION.stages[0], ...parsed.stages?.[0] },
        1: { ...DEFAULT_MAP_CUSTOMIZATION.stages[1], ...parsed.stages?.[1] },
        2: { ...DEFAULT_MAP_CUSTOMIZATION.stages[2], ...parsed.stages?.[2] },
        3: { ...DEFAULT_MAP_CUSTOMIZATION.stages[3], ...parsed.stages?.[3] },
        4: { ...DEFAULT_MAP_CUSTOMIZATION.stages[4], ...parsed.stages?.[4] },
      },
    };
  } catch {
    return DEFAULT_MAP_CUSTOMIZATION;
  }
}

export function saveMapCustomization(config: MapCustomization): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_CUSTOM_MAP_KEY, JSON.stringify(config));
  } catch (err) {
    console.error("Error saving map customization to localStorage:", err);
  }
}

export function resetMapCustomization(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_CUSTOM_MAP_KEY);
  } catch {
    return;
  }
}

/**
 * Convierte un archivo de imagen en Data URL optimizado para no desbordar localStorage.
 */
export function processImageFile(file: File, maxDim = 1920): Promise<{ dataUrl: string; width: number; height: number; aspectRatio: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({
            dataUrl: event.target?.result as string,
            width,
            height,
            aspectRatio: `${width} / ${height}`,
          });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/webp", 0.88) || canvas.toDataURL("image/jpeg", 0.88);
        resolve({
          dataUrl,
          width,
          height,
          aspectRatio: `${width} / ${height}`,
        });
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
