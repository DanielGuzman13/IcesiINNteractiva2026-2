import Link from "next/link";
import CyberCarreraChallenge from "@/components/game/ciberseguridad/CyberCarreraChallenge";

export default function CiberseguridadRetoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-br from-brand-primary via-brand-support to-brand-mid px-4 py-8">
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
                  i === 1 ? "bg-brand-light" : "bg-white/20"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-white/70">1/1 actividades</span>
        </div>
      </div>

      <div className="w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl 2xl:max-w-[1400px]">
        <div
          className="px-8 py-6 text-white"
          style={{ background: "linear-gradient(90deg, #45609B 0%, #6E7FA2 100%)" }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white/20 shadow-inner">
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <div className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-white/80">
                Rol del equipo
              </div>
              <h1 className="text-3xl font-extrabold">Ciberseguridad</h1>
              <div className="text-sm font-medium text-white/80">
                Incident Response · Restauración del Servidor de la Carrera del
                Pacífico
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <CyberCarreraChallenge />
        </div>
      </div>
    </main>
  );
}