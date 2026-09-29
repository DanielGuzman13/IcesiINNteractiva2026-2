import Image from "next/image";
import Link from "next/link";
import AnalistaSalsaChallenge from "@/components/AnalistaSalsaChallenge";

export default function AnalistaRetoPage() {
  return (
    <main className="fondo-papel-rayado flex min-h-screen flex-col items-center px-4 py-8">
      <div className="mb-6 flex w-full max-w-7xl items-center justify-between">
        <Link
          href="/retos"
          className="flex items-center gap-1 text-sm font-semibold text-brand-support/80 transition-colors hover:text-brand-primary"
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
                className={`h-3 w-3 rounded-full border-2 border-brand-primary transition-all ${
                  i === 1 ? "bg-brand-primary" : "bg-transparent"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-brand-support/70">1/1 actividades</span>
        </div>
      </div>

      <div className="w-full max-w-7xl border-2 border-brand-support bg-white shadow-[8px_8px_0_var(--brand-support)] 2xl:max-w-[1400px]">
        <div className="flex items-center justify-between bg-brand-support px-5 py-2 font-mono text-[11px] tracking-wider text-brand-light/80">
          <span>REQ-001 / MUNDIAL-SALSA</span>
          <span className="hidden sm:inline">ESTADO: EN ANÁLISIS</span>
        </div>

        <div className="relative flex flex-col justify-center border-b-2 border-brand-support bg-brand-light/50 px-6 py-7 sm:px-8 md:min-h-[14rem] md:pr-72">
          <h1 className="text-3xl font-black leading-tight text-brand-support sm:text-4xl">
            Analista de Requerimientos
          </h1>

          <div className="mt-5 max-w-md -rotate-1 bg-brand-mid px-4 py-3 text-sm font-medium leading-snug text-brand-support shadow-[3px_4px_0_rgba(0,0,0,0.18)]">
            Mundial de Salsa de Cali: votación en vivo y requerimientos BDD.
          </div>

          <span className="absolute right-6 top-5 hidden rotate-[7deg] border-2 border-double border-brand-primary/70 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-brand-primary/70 md:right-64 md:block">
            Prioridad alta
          </span>

          <Image
            src="/personajes/analista.webp"
            alt="Analista de Requerimientos"
            width={527}
            height={560}
            priority
            className="pointer-events-none absolute bottom-0 right-4 hidden h-52 w-auto drop-shadow-[4px_6px_0_rgba(0,0,0,0.12)] md:block"
          />
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <AnalistaSalsaChallenge />
        </div>
      </div>
    </main>
  );
}
