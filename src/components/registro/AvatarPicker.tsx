"use client";

import Image from "next/image";
import { AVATARS, type AvatarId } from "@/lib/avatars";

interface AvatarPickerProps {
  selected: AvatarId | null;
  onSelect: (id: AvatarId) => void;
}

export default function AvatarPicker({
  selected,
  onSelect,
}: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-5" role="radiogroup" aria-label="Selecciona tu avatar">
      {AVATARS.map((avatar) => {
        const isSelected = selected === avatar.id;
        return (
          <button
            key={avatar.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={avatar.label}
            onClick={() => onSelect(avatar.id)}
            className={`group relative aspect-square w-full rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-mid ${
              isSelected
                ? "ring-4 ring-brand-primary ring-offset-2 ring-offset-white scale-105 shadow-lg shadow-brand-primary/30"
                : "hover:scale-105 hover:shadow-lg hover:shadow-brand-support/25"
            }`}
          >
            <Image
              src={avatar.src}
              alt={avatar.label}
              fill
              sizes="(max-width: 640px) 22vw, 96px"
              className="rounded-full object-cover"
            />
            {isSelected && (
              <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary text-white shadow-md">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}