'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EncabezadoEditor from '@/components/retos/EncabezadoEditor';
import BackendPetronioWorkspace from '@/components/BackendPetronioWorkspace';
import { continuarConCierre } from '@/lib/personajes';

export default function BackendRetoPage() {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(true);

  return (
    <main
      className="fondo-editor flex min-h-screen flex-col items-center px-4 py-8"
    >
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
      </div>

      <div
        className={
          showIntro
            ? 'w-full max-w-7xl select-none blur-[3px] brightness-75 2xl:max-w-[1400px]'
            : 'w-full max-w-7xl animate-fade-in 2xl:max-w-[1400px]'
        }
        aria-hidden={showIntro}
      >
        <div className="overflow-hidden rounded-md border-2 border-brand-support bg-white shadow-[8px_8px_0_var(--brand-support)]">
          <EncabezadoEditor
            archivo="petronio-alvarez / backend / caseta.py"
            titulo="Backend Engineer"
            descripcion="Programa con bloques la lógica de la caseta de gastronomía pacífica."
            imagen="/personajes/front-nuevo.webp"
            anchoImagen={1218}
            altoImagen={1488}
            foto={{
              src: "/media/eventos/petronio-cocina.jpg",
              alt: "Cocineras sirviendo arroz y platos típicos del Pacífico en una caseta del Festival Petronio Álvarez",
              pie: "Petronio Álvarez",
              ancho: 1280,
              alto: 720,
              giro: -1.5,
              cinta: "esquinas",
            }}
            distintivo={
              <div
                className="pointer-events-none absolute right-[6.5rem] top-6 hidden rotate-[3deg] rounded-md bg-brand-support px-2 py-1 font-mono text-[10px] leading-tight text-white shadow-[2px_3px_0_rgba(0,0,0,0.18)] lg:block"
                aria-hidden="true"
              >
                <div className="text-white/70">POST /pedido</div>
                <div className="flex items-center gap-1 font-bold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  201 Created
                </div>
              </div>
            }
          />
          <div className="p-4 md:p-6 lg:p-8">
            <BackendPetronioWorkspace
              onHelp={() => setShowIntro(true)}
              onContinue={() => continuarConCierre('backend', router.push)}
            />
          </div>
        </div>
      </div>

      {showIntro && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/25 p-4 backdrop-blur-[6px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="intro-title"
        >
          <div className="relative my-auto w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div
              className="px-6 py-6 text-white"
              style={{ background: 'linear-gradient(120deg, var(--brand-primary) 0%, var(--brand-fin) 100%)' }}
            >
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Ruta de Ingeniería de Software - Festival Petronio Álvarez
              </div>
              <h2 id="intro-title" className="text-2xl font-black sm:text-3xl">
                Bienvenido, Backend Engineer
              </h2>
            </div>

            <div className="space-y-4 px-6 py-6">
              <p className="text-sm leading-relaxed text-brand-support">
                Eres la persona encargada de la parte <strong>Backend</strong> de una caseta de{" "}
                <strong>gastronomía pacífica</strong> durante el <strong>Festival Petronio
                Álvarez</strong>, en plena noche de concierto.
              </p>
              <p className="text-sm leading-relaxed text-brand-support">
                Cuando un comensal pide un plato típico (como la <strong>Cazuela de Mariscos</strong>{" "}
                o el <strong>Arroz de Coco</strong>), tú debes decidir si se puede preparar o no,
                dependiendo de los ingredientes que queden en la despensa, y responderle al visitante.
              </p>
              <p className="text-sm leading-relaxed text-brand-support">
                Para lograrlo armarás la lógica de cada pedido con bloques: preguntar cuánto hay de un
                ingrediente, validar que alcance, descontar lo usado y comunicar la respuesta.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowIntro(false)}
                className="rounded-xl bg-brand-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-support"
              >
                ¡Entendido, a programar!
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}