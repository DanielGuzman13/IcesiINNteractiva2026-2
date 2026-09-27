import { useEffect, useState, type ReactNode } from "react";

type AppSimulatorProps = {
  questionIndex: number;
  selectedOptionId: string | null;
};

const APP_TABS = [
  { label: "En Vivo", icon: <PlayIcon className="h-3.5 w-3.5" /> },
  { label: "Agenda", icon: <CalendarIcon className="h-3.5 w-3.5" /> },
  { label: "Reproductor", icon: <MusicIcon className="h-3.5 w-3.5" /> },
  { label: "Favoritos", icon: <HeartIcon className="h-3.5 w-3.5" /> },
  { label: "Reservas", icon: <TicketIcon className="h-3.5 w-3.5" /> },
  { label: "Artistas", icon: <UserIcon className="h-3.5 w-3.5" /> },
];

function CalendarIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function HeartIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 000-7.8z" />
    </svg>
  );
}

function TicketIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4z" />
      <path d="M13 5v2M13 11v2M13 17v2" />
    </svg>
  );
}

function SignalIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M4 16h3v4H4zM9 10h3v10H9zM14 5h3v15h-3z" />
    </svg>
  );
}

function WifiIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M2 8.8C7 4.4 17 4.4 22 8.8M5 12.5c3.6-3 10.4-3 14 0M8.5 16c1.9-1.5 5.1-1.5 7 0M12 19.4l.01 0" />
    </svg>
  );
}

function BatteryIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="17" height="10" rx="2" />
      <path d="M22 10.5v3" />
      <path d="M5 10v4M8 10v4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PlayIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function NextIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6 5v14l11-7zM17 5h2v14h-2z" />
    </svg>
  );
}

function PrevIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18 5v14L7 12zM5 5h2v14H5z" />
    </svg>
  );
}

function TrashIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6" />
    </svg>
  );
}

function MusicIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function SearchIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function FilePdfIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M10 12h4M10 15h4M10 18h3" />
    </svg>
  );
}

function UserIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  );
}

function SPINNER({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`animate-spin ${className}`} fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function ZonePlaceholder() {
  return (
    <div className="flex min-h-[96px] w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 bg-white/70 px-4 py-3 text-center">
      <p className="text-xs font-bold text-slate-400">Zona de vista previa</p>
      <p className="text-[10px] text-slate-400/80">Selecciona una opción para previsualizarla aquí.</p>
    </div>
  );
}

function renderAudioZone(selected: string | null) {
  if (selected === null) {
    return <ZonePlaceholder />;
  }
  if (selected === "a") {
    return (
      <div className="mx-auto w-full max-w-sm">
        <div className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-emerald-500 text-white shadow-lg">
          <PlayIcon />
          <span className="text-xs font-extrabold">Reproducir Marimba de Chonta</span>
        </div>
      </div>
    );
  }
  if (selected === "b") {
    return (
      <div className="mx-auto w-full max-w-sm">
        <div className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-white shadow-lg">
          <SPINNER />
          <span className="text-xs font-extrabold">Cargando audio...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto w-full max-w-sm rounded-xl bg-white p-4 text-center shadow">
      <p className="text-xs font-bold text-red-500">Ocurrió un error de reproducción</p>
      <p className="mt-1 text-[10px] text-slate-400">Vuelve a intentarlo en unos minutos</p>
    </div>
  );
}

function renderConcertCard(selected: string | null) {
  if (selected === null) {
    return <ZonePlaceholder />;
  }
  if (selected === "a") {
    return (
      <div className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <p className="text-[10px] font-black text-yellow-400">10:00 PM · Marimba de Chonta</p>
        <p className="text-[10px] font-medium text-yellow-400/80">Tarima principal</p>
      </div>
    );
  }
  if (selected === "b") {
    return (
      <div className="w-full rounded-xl bg-[#0F172A] px-4 py-3 shadow-lg">
        <p className="text-[10px] font-black text-white">10:00 PM · Marimba de Chonta</p>
        <p className="text-[10px] font-medium text-white/80">Tarima principal</p>
      </div>
    );
  }
  return (
    <div className="w-full rounded-xl bg-slate-400 px-4 py-3 shadow-sm">
      <p className="text-[10px] font-black text-slate-500">10:00 PM · Marimba de Chonta</p>
      <p className="text-[10px] font-medium text-slate-500/80">Tarima principal</p>
    </div>
  );
}

function renderControlCluster(selected: string | null) {
  if (selected === null) {
    return <ZonePlaceholder />;
  }
  const btn = "flex h-12 w-12 items-center justify-center rounded-full";
  if (selected === "a") {
    return (
      <div className="flex items-center justify-center gap-3">
        <span className={`${btn} bg-slate-200 text-slate-500`}>
          <NextIcon />
        </span>
        <span className={`${btn} h-14 w-14 bg-rose-500 text-white`}>
          <span className="block rotate-180">
            <NextIcon />
          </span>
        </span>
        <span className={`${btn} bg-slate-200 text-slate-500`}>
          <PauseIcon />
        </span>
      </div>
    );
  }
  if (selected === "b") {
    return (
      <div className="w-full space-y-2">
        {["Anterior canción de la lista de reproducción actual", "Reproducir y pausar la canción que está sonando ahora mismo", "Siguiente canción de la lista de reproducción"].map(
          (label) => (
            <div key={label} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2">
              <span className="block truncate text-[10px] font-bold text-rose-600">{label}</span>
            </div>
          )
        )}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-3">
      <span className={`${btn} bg-emerald-100 text-emerald-700`}>
        <PrevIcon />
      </span>
      <span className={`${btn} h-14 w-14 bg-emerald-500 text-white shadow-lg`}>
        <PlayIcon />
      </span>
      <span className={`${btn} bg-emerald-100 text-emerald-700`}>
        <NextIcon />
      </span>
    </div>
  );
}

const FAVORITE_SONGS = [
  { title: "Marimba de Chonta", artist: "Grupo Bahía" },
  { title: "Palo de agua", artist: "Gualajo" },
  { title: "Cosecha", artist: "Herencia de Timbiquí" },
  { title: "Mi Buenaventura", artist: "Nidia Góngora" },
];

function FavoriteRow({
  song,
  removed = false,
}: {
  song: { title: string; artist: string };
  removed?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-2 ${removed ? "opacity-40" : ""}`}>
      <div>
        <p
          className={`text-[10px] ${
            removed ? "font-bold text-slate-300 line-through" : "font-semibold text-slate-600"
          }`}
        >
          {song.title}
        </p>
        <p className={`text-[9px] ${removed ? "text-slate-300" : "text-slate-400"}`}>{song.artist}</p>
      </div>
      {removed ? (
        <span className="text-slate-300">
          <TrashIcon />
        </span>
      ) : (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-rose-400">
          <TrashIcon className="h-3 w-3" />
        </span>
      )}
    </div>
  );
}

function renderFavoritesZone(selected: string | null) {
  if (selected === null) {
    return <ZonePlaceholder />;
  }
  const header = (
    <div className="flex items-center justify-between px-1 pb-2">
      <p className="text-[10px] font-black uppercase tracking-widest text-brand-mid">Mis Canciones Favoritas</p>
      <span className="text-[9px] font-semibold text-slate-400">12 temas</span>
    </div>
  );
  if (selected === "a") {
    return (
      <div className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm">
        {header}
        <div className="space-y-2.5">
          {FAVORITE_SONGS.map((song, i) => (
            <FavoriteRow key={song.title} song={song} removed={i === 0} />
          ))}
        </div>
        <p className="mt-3 text-center text-[9px] font-medium text-slate-300">
          La canción se eliminó sin ninguna confirmación ni aviso
        </p>
      </div>
    );
  }
  if (selected === "b") {
    return (
      <div className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm">
        {header}
        <div className="space-y-2.5">
          {FAVORITE_SONGS.map((song, i) => (
            <FavoriteRow key={song.title} song={song} removed={i === 0} />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-slate-900 px-3 py-2.5 text-white shadow-lg">
          <span className="text-[10px] font-semibold">Tema eliminado de tus favoritos</span>
          <span className="rounded-md bg-white/15 px-2.5 py-1 text-[9px] font-bold text-amber-300">Deshacer</span>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full rounded-xl border border-rose-300 bg-rose-50 p-4 text-center">
      <p className="text-xs font-bold text-rose-600">Tu sesión se cerró por inactividad</p>
      <p className="mt-1 text-[10px] text-rose-400">La vista parpadeó y perdiste tus cambios</p>
    </div>
  );
}

function renderActionsRow(selected: string | null) {
  if (selected === null) {
    return <ZonePlaceholder />;
  }
  if (selected === "a") {
    return (
      <div className="flex w-full gap-3">
        <span className="h-11 w-1/2 rounded-lg bg-rose-500 text-center text-[11px] font-extrabold leading-[44px] text-white">Confirmar</span>
        <span className="h-11 w-1/2 rounded-lg bg-rose-500 text-center text-[11px] font-extrabold leading-[44px] text-white">Cancelar</span>
      </div>
    );
  }
  if (selected === "b") {
    return (
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-3">
        <span className="h-11 flex-1 rounded-lg bg-emerald-600 text-center text-[11px] font-extrabold leading-[44px] text-white shadow-lg">Confirmar reserva</span>
        <span className="h-11 flex-1 rounded-lg border-2 border-slate-200 bg-white text-center text-[11px] font-bold leading-[40px] text-slate-500">Cancelar</span>
      </div>
    );
  }
  return (
    <div className="w-full">
      <span className="block h-14 w-full rounded-lg bg-slate-700 text-center text-xs font-extrabold leading-[56px] text-white">Cancelar</span>
      <span className="mt-2 block w-full text-center text-[9px] font-medium text-slate-300 underline">Confirmar reserva</span>
    </div>
  );
}

function renderSearchZone(selected: string | null) {
  if (selected === null) {
    return <ZonePlaceholder />;
  }
  if (selected === "a") {
    return (
      <div className="flex w-full items-center gap-2 rounded-lg bg-white px-3 py-2.5 ring-1 ring-slate-200">
        <span className="text-slate-300">
          <SearchIcon />
        </span>
        <span className="truncate text-[11px] font-medium text-slate-300">Marimba, chirimía, violines...</span>
      </div>
    );
  }
  if (selected === "b") {
    return (
      <div className="space-y-2">
        <div className="flex w-full items-center gap-2 rounded-lg bg-white px-3 py-2.5 ring-1 ring-slate-200">
          <span className="text-slate-400">
            <SearchIcon />
          </span>
          <span className="text-[11px] font-medium text-slate-400">Buscar agrupación...</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "Marimba", icon: <MusicIcon className="h-3 w-3" /> },
            { label: "Chirimía", icon: <MusicIcon className="h-3 w-3" /> },
            { label: "Violines", icon: <MusicIcon className="h-3 w-3" /> },
          ].map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-1 rounded-full bg-brand-primary/10 px-2.5 py-1 text-[10px] font-bold text-brand-mid ring-1 ring-brand-primary/30"
            >
              {chip.icon}
              {chip.label}
            </span>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-full items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
      <span className="text-amber-600">
        <FilePdfIcon />
      </span>
      <div>
        <p className="text-[10px] font-bold text-amber-700">Consulta el manual de artistas en PDF</p>
        <p className="text-[9px] text-amber-600/70">Descarga el directorio completo para buscar por sonora</p>
      </div>
      <span className="ml-auto rounded-md bg-amber-500 px-2.5 py-1 text-[9px] font-bold text-white">PDF</span>
    </div>
  );
}

function renderZone(index: number, optionId: string): ReactNode {
  switch (index) {
    case 0:
      return renderAudioZone(optionId);
    case 1:
      return renderConcertCard(optionId);
    case 2:
      return renderControlCluster(optionId);
    case 3:
      return renderFavoritesZone(optionId);
    case 4:
      return renderActionsRow(optionId);
    default:
      return renderSearchZone(optionId);
  }
}

export function renderScene(questionIndex: number, optionId: string): ReactNode {
  return <div className="w-full max-w-xs">{renderZone(questionIndex, optionId)}</div>;
}

function LiveStreamView({ selected }: { selected: string | null }) {
  return (
    <div className="flex min-h-[460px] flex-col bg-slate-950 text-white">
      <div className="flex items-center justify-center gap-2 bg-slate-900 px-4 py-2.5">
        <span className="flex items-center gap-1.5 rounded-md bg-red-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          EN VIVO
        </span>
        <span className="text-[11px] font-extrabold">Festival Petronio Álvarez</span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-gradient-to-b from-slate-900 via-slate-950 to-black px-6 py-10">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-mid text-white ring-4 ring-white/10">
          <MusicIcon className="h-9 w-9" />
        </div>
        <p className="text-sm font-black">Herencia de Timbiquí</p>
        <p className="text-[11px] font-medium text-white/60">Marimba de chonta · Transmisión oficial</p>
      </div>
      <div className="border-t border-white/10 bg-slate-900 px-4 py-4">{renderAudioZone(selected)}</div>
    </div>
  );
}

function AgendaView({ selected }: { selected: string | null }) {
  return (
    <div className="flex min-h-[460px] flex-col bg-slate-50">
      <div className="flex items-center justify-between bg-brand-primary px-4 py-2.5 text-white">
        <span className="text-xs font-extrabold">Agenda Nocturna · Tarima Principal</span>
        <span className="text-[10px] font-semibold text-white/80">Sábado</span>
      </div>
      <div className="flex-1 space-y-2.5 px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-2.5 shadow-sm">
          <span className="w-16 text-[10px] font-black text-brand-mid">8:00 PM</span>
          <div>
            <p className="text-[11px] font-bold text-slate-700">Grupo Bahía</p>
            <p className="text-[9px] text-slate-400">Sonora bonaverense</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-2.5 shadow-sm">
          <span className="w-16 text-[10px] font-black text-brand-mid">9:00 PM</span>
          <div>
            <p className="text-[11px] font-bold text-slate-700">Gualajo</p>
            <p className="text-[9px] text-slate-400">Marimba</p>
          </div>
        </div>
        {renderConcertCard(selected)}
        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-2.5 shadow-sm">
          <span className="w-16 text-[10px] font-black text-brand-mid">11:30 PM</span>
          <div>
            <p className="text-[11px] font-bold text-slate-700">Estrellas del Pacífico</p>
            <p className="text-[9px] text-slate-400">Cierre</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerView({ selected }: { selected: string | null }) {
  return (
    <div className="flex min-h-[460px] flex-col bg-gradient-to-b from-amber-50 via-emerald-50 to-slate-100">
      <div className="flex items-center justify-between bg-emerald-800 px-4 py-2.5 text-white">
        <span className="text-xs font-extrabold">Mini Reproductor</span>
        <span className="text-[10px] font-semibold text-white/80">Marimba de Chonta</span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-8">
        <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-emerald-900 text-white shadow-lg">
          <MusicIcon className="h-10 w-10" />
        </div>
        <div className="w-full max-w-md">
          <p className="text-center text-sm font-black text-slate-800">Marimba de Chonta</p>
          <p className="text-center text-[10px] text-slate-500">Grupo Bahía · Álbum “Fuga”</p>
          <div className="mt-4 h-1.5 w-full rounded-full bg-slate-300">
            <div className="h-full w-1/3 rounded-full bg-brand-primary" />
          </div>
          <div className="mt-1 flex justify-between text-[9px] font-semibold text-slate-500">
            <span>1:32</span>
            <span>4:05</span>
          </div>
          <div className="mt-4">{renderControlCluster(selected)}</div>
        </div>
      </div>
    </div>
  );
}

function FavoritesView({ selected }: { selected: string | null }) {
  return (
    <div className="flex min-h-[460px] flex-col bg-slate-50">
      <div className="flex items-center justify-between bg-brand-primary px-4 py-2.5 text-white">
        <span className="text-xs font-extrabold">Mis Favoritos</span>
        <span className="text-[10px] font-semibold text-white/80">12 temas</span>
      </div>
      <div className="mt-2 flex-1 px-4 py-2">{renderFavoritesZone(selected)}</div>
    </div>
  );
}

function CheckoutView({ selected }: { selected: string | null }) {
  return (
    <div className="flex min-h-[460px] flex-col bg-slate-50">
      <div className="bg-brand-primary px-4 py-2.5 text-xs font-extrabold text-white">Confirmar reserva</div>
      <div className="flex flex-1 flex-col gap-4 px-4 py-5">
        <div className="rounded-2xl border-2 border-dashed border-brand-primary/50 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-mid">Gradas Norte</p>
          <p className="mt-1 text-sm font-black text-slate-800">2 entradas · Sección B</p>
          <p className="text-[11px] text-slate-500">Noche 1 · Festival Petronio</p>
          <div className="mt-2 flex items-center justify-between border-t border-dashed border-slate-200 pt-2">
            <span className="text-[10px] font-bold text-slate-500">Total</span>
            <span className="text-sm font-black text-emerald-600">$120.000</span>
          </div>
        </div>
        {renderActionsRow(selected)}
      </div>
    </div>
  );
}

function DirectoryView({ selected }: { selected: string | null }) {
  return (
    <div className="flex min-h-[460px] flex-col bg-slate-50">
      <div className="bg-brand-primary px-4 py-2.5 text-xs font-extrabold text-white">Directorio de Agrupaciones</div>
      <div className="flex-1 px-4 py-4">
        {renderSearchZone(selected)}
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {[
            { name: "Grupo Bahía", genre: "Bonaverense" },
            { name: "Gualajo", genre: "Marimba" },
            { name: "Nidia Góngora", genre: "Cantora" },
          ].map((artist) => (
            <div key={artist.name} className="flex items-center gap-3 rounded-xl bg-white px-4 py-2.5 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary/15 text-brand-mid">
                <UserIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-700">{artist.name}</p>
                <p className="text-[9px] text-slate-400">{artist.genre}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function renderView(index: number, selected: string | null): ReactNode {
  switch (index) {
    case 0:
      return <LiveStreamView selected={selected} />;
    case 1:
      return <AgendaView selected={selected} />;
    case 2:
      return <PlayerView selected={selected} />;
    case 3:
      return <FavoritesView selected={selected} />;
    case 4:
      return <CheckoutView selected={selected} />;
    default:
      return <DirectoryView selected={selected} />;
  }
}

function FadeBlock({ index, children }: { index: number; children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className={`transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>{children}</div>
  );
}

export default function AppSimulator({ questionIndex, selectedOptionId }: AppSimulatorProps) {
  return (
    <div className="overflow-hidden rounded-[2rem] border-4 border-slate-800/90 bg-slate-100 shadow-2xl">
      <div className="flex items-center justify-between bg-slate-900 px-5 py-1.5 text-white">
        <span className="text-[10px] font-bold tracking-wide">9:41</span>
        <div className="flex items-center gap-1.5">
          <SignalIcon />
          <WifiIcon />
          <BatteryIcon />
        </div>
      </div>

      <FadeBlock key={questionIndex} index={questionIndex}>
        {renderView(questionIndex, selectedOptionId)}
      </FadeBlock>

      <div className="border-t border-slate-200 bg-white px-2 py-1.5">
        <div className="grid grid-cols-6 gap-1">
          {APP_TABS.map((tab, i) => {
            const active = i === questionIndex;
            return (
              <div
                key={tab.label}
                className={`flex flex-col items-center gap-0.5 rounded-lg py-1 ${
                  active ? "text-brand-primary" : "text-slate-400"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="text-[8px] font-bold leading-none">{tab.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-amber-200 bg-amber-50 px-4 py-2 text-[11px] font-semibold text-amber-800">
        Vista previa en vivo: elige una opción y observa el cambio aquí.
      </div>
    </div>
  );
}