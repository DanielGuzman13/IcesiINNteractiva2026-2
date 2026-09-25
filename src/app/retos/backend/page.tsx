'use client';

import Link from 'next/link';
import { useState } from 'react';
import BackendPetronioWorkspace from '@/components/BackendPetronioWorkspace';

export default function BackendRetoPage() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <main
      className="flex min-h-screen flex-col items-center px-4 py-8"
      style={{
        background: 'linear-gradient(160deg, #719FC1 0%, #6E7FA2 60%, #45609B 100%)'
      }}
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
        <button
          type="button"
          onClick={() => setShowIntro(true)}
          className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/35"
          title="Volver a ver la introducción de la actividad"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.2 9a2.8 2.8 0 0 1 5.5.9c0 1.9-2.4 2.2-2.7 4" />
            <circle cx="12" cy="17.2" r="0.6" fill="currentColor" stroke="none" />
          </svg>
          Ayuda
        </button>
      </div>

      <div
        className={
          showIntro
            ? 'w-full max-w-7xl select-none blur-[3px] brightness-75 2xl:max-w-[1400px]'
            : 'w-full max-w-7xl animate-fade-in 2xl:max-w-[1400px]'
        }
        aria-hidden={showIntro}
      >
        <BackendPetronioWorkspace />
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
              style={{ background: 'linear-gradient(120deg, #45609B 0%, #719FC1 100%)' }}
            >
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Ruta de Ingeniería de Software · Festival Petronio Álvarez
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
                o el <strong>Arroz Guacho</strong>), tú debes decidir si se puede preparar o no,
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
                className="rounded-xl bg-brand-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-mid"
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