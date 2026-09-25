"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { savePlayer } from "@/lib/player";
import { AVATARS, type AvatarId } from "@/lib/avatars";
import AvatarPicker from "./AvatarPicker";

interface Errors {
  name?: string;
  avatar?: string;
}

export default function RegistrationForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<AvatarId | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Errors = {};

    if (!name.trim()) {
      nextErrors.name = "Escribe tu nombre para continuar.";
    }
    if (!avatar) {
      nextErrors.avatar = "Elige un avatar para tu perfil.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (!avatar) return;

    savePlayer({ name: name.trim(), avatar });
    router.push("/retos");
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl shadow-brand-primary/20 backdrop-blur-md sm:p-10"
    >
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-support">
          Paso 2 de 3
        </span>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-brand-support sm:text-4xl">
          Crea tu perfil
        </h2>
        <p className="mt-2 text-sm text-brand-support/80 sm:text-base">
          Cuéntanos tu nombre y elige un avatar para el reto.
        </p>
      </div>

      <label className="block text-left" htmlFor="player-name">
        <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-brand-support">
          Tu nombre
        </span>
        <input
          id="player-name"
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (errors.name) setErrors((current) => ({ ...current, name: undefined }));
          }}
          placeholder="Ej. Valeria Ospina"
          autoComplete="given-name"
          maxLength={40}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={`w-full rounded-2xl border-2 bg-white/80 px-5 py-3.5 text-base text-brand-support shadow-sm outline-none transition placeholder:text-brand-support/50 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 ${
            errors.name ? "border-red-400" : "border-brand-soft"
          }`}
        />
        {errors.name && (
          <p id="name-error" role="alert" className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-500">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor">
              <path d="M12 2 1 21h22L12 2Zm1 14h-2v2h2v-2Zm0-7h-2v5h2V9Z" />
            </svg>
            {errors.name}
          </p>
        )}
      </label>

      <fieldset className="mt-8 text-left">
        <legend className="mb-3 block text-sm font-bold uppercase tracking-wide text-brand-support">
          Elige tu avatar
        </legend>
        <AvatarPicker selected={avatar} onSelect={(id) => {
          setAvatar(id);
          if (errors.avatar) setErrors((current) => ({ ...current, avatar: undefined }));
        }} />
        {errors.avatar && (
          <p role="alert" className="mt-3 flex items-center gap-1.5 text-sm font-medium text-red-500">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor">
              <path d="M12 2 1 21h22L12 2Zm1 14h-2v2h2v-2Zm0-7h-2v5h2V9Z" />
            </svg>
            {errors.avatar}
          </p>
        )}
      </fieldset>

      <button
        type="submit"
        className="group mt-10 inline-flex w-full items-center justify-center gap-3 rounded-full bg-brand-primary px-10 py-4 text-lg font-bold text-white shadow-xl shadow-brand-primary/30 transition-all duration-300 hover:bg-brand-mid hover:shadow-2xl hover:shadow-brand-primary/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-mid active:translate-y-0.5 sm:text-xl"
      >
        Continuar
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      {avatar && name.trim() && (
        <p className="mt-4 text-center text-sm text-brand-support/70">
          Jugando como <strong className="text-brand-primary">{name.trim()}</strong>
          {" · "}
          {AVATARS.find((item) => item.id === avatar)?.label}
        </p>
      )}
    </form>
  );
}