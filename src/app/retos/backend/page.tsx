'use client';

import Link from 'next/link';
import BackendPetronioWorkspace from '@/components/BackendPetronioWorkspace';

export default function BackendRetoPage() {
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
      </div>

      <div className="w-full max-w-7xl 2xl:max-w-[1400px]">
        <BackendPetronioWorkspace />
      </div>
    </main>
  );
}