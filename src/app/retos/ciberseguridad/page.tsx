import Link from "next/link";
import EncabezadoConsola from "@/components/retos/EncabezadoConsola";
import CyberCarreraChallenge from "@/components/game/ciberseguridad/CyberCarreraChallenge";

export default function CiberseguridadRetoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center fondo-consola px-4 py-8">
      <div className="mb-6 flex w-full max-w-7xl items-center justify-between">
        <Link
          href="/retos"
          className="flex items-center gap-1 text-sm font-semibold text-white/80 transition-colors hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver a los retos
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {[1].map((i) => (
              <div
                key={i}
                className={`h-3 w-3 rounded-full border-2 border-white transition-all ${
                  i === 1 ? "bg-white" : "bg-transparent"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-white/70">1/1 actividades</span>
        </div>
      </div>

      <div className="w-full max-w-7xl border-2 border-brand-mid bg-white shadow-[8px_8px_0_var(--brand-mid)] 2xl:max-w-[1400px]">
        <EncabezadoConsola
          ruta="CARRERA-DEL-PACIFICO / INCIDENTE-004 / SERVIDOR"
          estado="SERVIDOR BLOQUEADO"
          ledClase="bg-brand-alerta animate-pulse"
          titulo="Ciberseguridad"
          descripcion="Incident Response: restauración del servidor de la Carrera del Pacífico."
          imagen="/personajes/qa-nuevo.webp"
          anchoImagen={1405}
          altoImagen={1458}
          foto={{
            src: "/media/eventos/carrera-pacifico.jpg",
            alt: "Corredora de la Carrera del Pacífico pasando junto a una chirimía que toca en la calle",
            pie: "Carrera del Pacífico",
            ancho: 513,
            alto: 314,
            giro: 1.5,
            cinta: "esquinas",
          }}
          distintivo={
            <div
              className="pointer-events-none absolute right-[7.8rem] top-6 hidden -rotate-[3deg] rounded border border-brand-alerta bg-black/40 px-2 py-1 font-mono text-[10px] font-bold leading-tight text-red-300 lg:block"
              aria-hidden="true"
            >
              <div className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="11" width="16" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                ACCESO
              </div>
              <div>DENEGADO</div>
            </div>
          }
        />

        <div className="p-4 md:p-6 lg:p-8">
          <CyberCarreraChallenge />
        </div>
      </div>
    </main>
  );
}
