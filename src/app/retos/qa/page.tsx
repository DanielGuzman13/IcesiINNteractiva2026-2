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
        />

        <div className="p-4 md:p-6 lg:p-8">
          <QACarreraForm />
        </div>
      </div>
    </main>
  );
}