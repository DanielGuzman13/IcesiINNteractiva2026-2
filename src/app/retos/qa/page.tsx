import Link from "next/link";
import EncabezadoConsola from "@/components/retos/EncabezadoConsola";
import QACarreraForm from "@/components/game/qa/QACarreraForm";

export default function QaRetoPage() {
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
          ruta="CARRERA-DEL-PACIFICO / QA / FORMULARIO-INSCRIPCION"
          estado="EN PRUEBAS"
          ledClase="bg-brand-mid animate-pulse"
          titulo="QA Engineer"
          descripcion="Carrera del Pacífico: detección de bugs y auditoría."
          imagen="/personajes/qa.webp"
          anchoImagen={532}
          foto={{
            src: "/media/eventos/carrera-pacifico.jpg",
            alt: "Corredora de la Carrera del Pacífico pasando junto a una chirimía que toca en la calle",
            pie: "Carrera del Pacífico",
            ancho: 513,
            alto: 314,
            giro: -2.5,
            cinta: "centro",
          }}
          distintivo={
            <div
              className="pointer-events-none absolute right-[7.8rem] top-6 hidden rotate-[3deg] border-2 border-dashed border-brand-mid bg-black/30 px-2 py-1 font-mono text-[10px] leading-tight text-white lg:block"
              aria-hidden="true"
            >
              <div className="flex items-center gap-1 font-bold text-brand-mid">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2l1.9 1.9M16 2l-1.9 1.9M9 7.1V6a3 3 0 0 1 6 0v1.1M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6zM12 20v-9M6.5 9C4.6 8.8 3 7.2 3 5M6 13H2M3 21c0-2.1 1.7-3.8 3.8-4M20.97 5c0 2.1-1.6 3.8-3.5 4M22 13h-4M17.2 17c2.1.1 3.8 1.9 3.8 4" />
                </svg>
                BUG-01
              </div>
              <div className="text-white/70">Abierto</div>
            </div>
          }
        />

        <div className="p-4 md:p-6 lg:p-8">
          <QACarreraForm />
        </div>
      </div>
    </main>
  );
}