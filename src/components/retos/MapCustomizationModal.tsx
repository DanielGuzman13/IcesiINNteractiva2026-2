"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  type MapCustomization,
  processImageFile,
  resetMapCustomization,
  DEFAULT_MAP_CUSTOMIZATION,
} from "@/lib/map-customization";
import { RUTA_STAGES } from "@/lib/ruta-progress";

interface MapCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: MapCustomization;
  onUpdateConfig: (updated: MapCustomization) => void;
  isDragMode: boolean;
  onToggleDragMode: (enabled: boolean) => void;
}

export default function MapCustomizationModal({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  isDragMode,
  onToggleDragMode,
}: MapCustomizationModalProps) {
  const [activeTab, setActiveTab] = useState<"background" | "stations">("background");
  const [isProcessing, setIsProcessing] = useState(false);
  const bgInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Manejo de carga de nueva imagen de fondo
  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const { dataUrl, aspectRatio } = await processImageFile(file, 2560);
      onUpdateConfig({
        ...config,
        backgroundImageUrl: dataUrl,
        aspectRatio,
        fillScreen: true, // Por defecto al subir un mapa ancho, llenar pantalla
      });
    } catch (err) {
      console.error("Error al procesar imagen de fondo:", err);
      alert("No se pudo procesar la imagen seleccionada.");
    } finally {
      setIsProcessing(false);
      if (bgInputRef.current) bgInputRef.current.value = "";
    }
  };

  // Manejo de carga de icono personalizado para una estación
  const handleStationIconUpload = async (stageIndex: number, file: File) => {
    try {
      setIsProcessing(true);
      const { dataUrl } = await processImageFile(file, 256);
      onUpdateConfig({
        ...config,
        stages: {
          ...config.stages,
          [stageIndex]: {
            ...config.stages[stageIndex],
            iconUrl: dataUrl,
          },
        },
      });
    } catch (err) {
      console.error("Error al procesar icono de parada:", err);
      alert("No se pudo procesar el icono.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Remover icono personalizado de una estación
  const handleRemoveStationIcon = (stageIndex: number) => {
    onUpdateConfig({
      ...config,
      stages: {
        ...config.stages,
        [stageIndex]: {
          ...config.stages[stageIndex],
          iconUrl: null,
        },
      },
    });
  };

  // Actualizar coordenadas de una estación
  const handleCoordinateChange = (stageIndex: number, axis: "x" | "y", value: number) => {
    const clamped = Math.min(100, Math.max(0, value));
    onUpdateConfig({
      ...config,
      stages: {
        ...config.stages,
        [stageIndex]: {
          ...config.stages[stageIndex],
          [axis]: clamped,
        },
      },
    });
  };

  // Restaurar todo a valores por defecto
  const handleResetAll = () => {
    if (confirm("¿Deseas restaurar el mapa, paradas e iconos a sus valores originales?")) {
      resetMapCustomization();
      onUpdateConfig(DEFAULT_MAP_CUSTOMIZATION);
      onToggleDragMode(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl bg-slate-900 border border-white/15 text-white shadow-2xl overflow-hidden">
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-lg">
              ⚙️
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                Personalizar Mapa y Paradas
              </h2>
              <p className="text-xs text-white/60">
                Cambia el fondo para pantallas anchas y personaliza los iconos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition"
          >
            ✕
          </button>
        </div>

        {/* Pestañas de navegación */}
        <div className="flex border-b border-white/10 bg-slate-950/40 px-6">
          <button
            type="button"
            onClick={() => setActiveTab("background")}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition ${
              activeTab === "background"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            🖼️ Imagen de Fondo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("stations")}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition ${
              activeTab === "stations"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            📍 Iconos y Posiciones ({RUTA_STAGES.length})
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "background" ? (
            <div className="space-y-6">
              {/* Previsualización del fondo actual */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
                  Fondo Actual del Mapa
                </label>
                <div className="relative h-44 w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 flex items-center justify-center">
                  <Image
                    src={config.backgroundImageUrl || "/mapa/4.jpeg"}
                    alt="Previsualización mapa"
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-contain"
                  />
                  <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-mono text-white/80 backdrop-blur">
                    {config.backgroundImageUrl ? "Imagen personalizada" : "Mapa panorámico de Cali"}
                  </span>
                </div>
              </div>

              {/* Botones de acción para fondo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    ref={bgInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundUpload}
                    className="hidden"
                    id="map-bg-upload"
                  />
                  <label
                    htmlFor="map-bg-upload"
                    className={`flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-3 text-xs sm:text-sm font-bold text-slate-950 cursor-pointer shadow-lg transition active:scale-98 ${
                      isProcessing ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <span>📁 Subir nueva imagen de mapa</span>
                  </label>
                  <p className="mt-1.5 text-[11px] text-white/50 text-center sm:text-left">
                    Sube una ilustración panorámica (16:9, etc.) para abarcar toda la pantalla.
                  </p>
                </div>

                {config.backgroundImageUrl && (
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateConfig({
                          ...config,
                          backgroundImageUrl: null,
                          aspectRatio: "577 / 709",
                          fillScreen: false,
                        })
                      }
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-3 text-xs sm:text-sm font-bold text-white border border-white/15 transition"
                    >
                      <span>↺ Volver al mapa original</span>
                    </button>
                    <p className="mt-1.5 text-[11px] text-white/50 text-center sm:text-left">
                      Restaura la ilustración base de Cali con río y monumentos.
                    </p>
                  </div>
                )}
              </div>

              {/* Opciones de escala y ajuste de pantalla */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  Ajuste de Pantalla (Eliminar Espacio Vacío)
                </span>
                <label className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                      Expandir al 100% de la pantalla (Sin bandas laterales)
                    </p>
                    <p className="text-xs text-white/50">
                      Hace que el mapa cubra todo el ancho y alto disponible en el navegador.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.fillScreen}
                    onChange={(e) =>
                      onUpdateConfig({
                        ...config,
                        fillScreen: e.target.checked,
                      })
                    }
                    className="h-5 w-5 rounded border-white/20 bg-slate-800 text-amber-500 focus:ring-amber-400"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Botón para activar modo arrastre interactivo en el mapa */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-amber-300">
                    Modo Interactivo: Mover paradas en pantalla
                  </p>
                  <p className="text-xs text-white/70">
                    Al activarlo, puedes arrastrar las paradas directamente sobre el mapa con el cursor.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleDragMode(!isDragMode)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold shadow-md transition ${
                    isDragMode
                      ? "bg-amber-400 text-slate-950 ring-2 ring-white"
                      : "bg-white/15 text-white hover:bg-white/25"
                  }`}
                >
                  {isDragMode ? "✓ Modo Arrastre Activo" : "Activar Arrastre"}
                </button>
              </div>

              {/* Lista de las 5 estaciones */}
              <div className="space-y-3">
                {RUTA_STAGES.map((stage) => {
                  const stageCustom = config.stages[stage.index] ?? {
                    x: stage.x,
                    y: stage.y,
                    iconUrl: null,
                  };
                  const inputId = `stage-icon-input-${stage.index}`;

                  return (
                    <div
                      key={stage.index}
                      className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Miniatura del icono actual */}
                          <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-400 bg-slate-900 overflow-hidden shadow">
                            {stageCustom.iconUrl ? (
                              <Image
                                src={stageCustom.iconUrl}
                                alt={stage.title}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : stage.index === 0 ? (
                              <span className="text-rose-500 font-black text-sm">✖</span>
                            ) : (
                              <span className="text-xs font-black text-amber-300">
                                {stage.index}
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-white">
                              {stage.index}. {stage.title}
                            </h4>
                            <p className="text-[11px] text-white/50">{stage.role}</p>
                          </div>
                        </div>

                        {/* Botones para subir o quitar icono */}
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            id={inputId}
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleStationIconUpload(stage.index, f);
                              e.target.value = "";
                            }}
                          />
                          <label
                            htmlFor={inputId}
                            className="rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1.5 text-[11px] font-bold text-white cursor-pointer transition"
                          >
                            {stageCustom.iconUrl ? "Cambiar icono" : "Subir icono"}
                          </label>

                          {stageCustom.iconUrl && (
                            <button
                              type="button"
                              onClick={() => handleRemoveStationIcon(stage.index)}
                              className="rounded-lg bg-rose-500/20 hover:bg-rose-500/30 px-2 py-1.5 text-[11px] font-bold text-rose-300 transition"
                              title="Restaurar icono por defecto"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Sliders de posición X% e Y% */}
                      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/5">
                        <div>
                          <div className="flex justify-between text-[11px] font-semibold text-white/60 mb-1">
                            <span>Posición X (Horizontal):</span>
                            <span className="font-mono text-amber-300 font-bold">
                              {stageCustom.x.toFixed(1)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.5"
                            value={stageCustom.x}
                            onChange={(e) =>
                              handleCoordinateChange(stage.index, "x", parseFloat(e.target.value))
                            }
                            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] font-semibold text-white/60 mb-1">
                            <span>Posición Y (Vertical):</span>
                            <span className="font-mono text-amber-300 font-bold">
                              {stageCustom.y.toFixed(1)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.5"
                            value={stageCustom.y}
                            onChange={(e) =>
                              handleCoordinateChange(stage.index, "y", parseFloat(e.target.value))
                            }
                            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Pie del modal */}
        <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 bg-slate-950/80">
          <button
            type="button"
            onClick={handleResetAll}
            className="text-xs font-bold text-rose-400 hover:text-rose-300 transition"
          >
            ↺ Restaurar todo por defecto
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-amber-500 hover:bg-amber-400 px-5 py-2.5 text-xs sm:text-sm font-black text-slate-950 shadow-lg transition active:scale-95"
          >
            Listo y Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
