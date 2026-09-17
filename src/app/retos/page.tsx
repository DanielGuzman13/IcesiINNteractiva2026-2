"use client";

import Link from "next/link";
import Image from "next/image";
import { ROLES } from "@/lib/roles";
import { loadPlayer } from "@/lib/player";
import { getAvatarSrc } from "@/lib/avatars";
import { useHasHydrated } from "@/lib/use-has-hydrated";
import RoleCard from "@/components/retos/RoleCard";

export default function RetosPage() {
  const hasHydrated = useHasHydrated();
  const player = hasHydrated ? loadPlayer() : null;
  const playerName = player?.name ?? null;
  const avatar = player ? getAvatarSrc(player.avatar) : null;

  return (
    <div
      className="flex min-h-dvh flex-col px-4 py-10 sm:px-8 sm:py-14"
      style={{
        background:
          "linear-gradient(160deg, #B2BCCC 0%, #91A4BC 45%, #6E7FA2 100%)",
      }}
    >
      <header className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-support backdrop-blur">
          Paso 3 de 3
        </span>

        <div className="mt-6 flex items-center gap-4">
          {avatar && (
            <div className="relative h-16 w-16 overflow-hidden rounded-full ring-4 ring-white/70 shadow-lg">
              <Image src={avatar} alt="Tu avatar" fill sizes="64px" className="object-cover" />
            </div>
          )}
          <div className="text-left">
            {playerName && (
              <h2 className="text-lg font-bold text-brand-support sm:text-xl">
                ¡Hola, {playerName}!
              </h2>
            )}
            <h1 className="text-3xl font-black tracking-tight text-brand-support drop-shadow sm:text-5xl">
              Elige tu reto
            </h1>
          </div>
        </div>

        <p className="mt-4 max-w-2xl text-center text-sm text-brand-support/90 sm:text-base">
          Selecciona el rol con el que quieres vivir el reto &quot;Cali nos
          une&quot;. Cada rol te lleva a un desafío diferente.
        </p>
      </header>

      <main className="mx-auto mt-10 grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-2 sm:gap-8">
        {ROLES.map((role) => (
          <RoleCard key={role.slug} role={role} />
        ))}
      </main>

      <Link
        href="/registro"
        className="mx-auto mt-10 inline-flex items-center gap-2 rounded-full bg-white/60 px-5 py-2.5 text-sm font-semibold text-brand-support backdrop-blur transition hover:bg-white/90 hover:text-brand-primary"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver a tu perfil
      </Link>
    </div>
  );
}