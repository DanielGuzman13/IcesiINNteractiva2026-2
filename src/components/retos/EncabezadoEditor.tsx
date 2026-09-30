import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import FotoPolaroid, { type FotoPolaroidProps } from "./FotoPolaroid";

export default function EncabezadoEditor({
  archivo,
  titulo,
  descripcion,
  imagen,
  anchoImagen,
  accion,
  foto,
  fotoDerecha = 14,
  distintivo,
}: {
  archivo: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  anchoImagen: number;
  accion?: ReactNode;
  foto?: Omit<FotoPolaroidProps, "className">;
  fotoDerecha?: number;
  distintivo?: ReactNode;
}) {
  return (
    <>
      <div className="flex items-center gap-3 bg-brand-support px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-brand-primary" />
          <span className="h-3 w-3 rounded-full bg-brand-soft" />
          <span className="h-3 w-3 rounded-full bg-brand-mid" />
        </div>
        <span className="truncate rounded-t bg-white/10 px-3 py-1 font-mono text-xs text-white/80">
          {archivo}
        </span>
      </div>

      <div className={`relative flex flex-col justify-center border-b-2 border-brand-support bg-brand-light/60 px-6 py-7 sm:px-8 md:min-h-[14rem] md:pr-72 ${foto ? "lg:pr-[calc(var(--foto-derecha)+15rem)]" : ""}`}
        style={{ "--foto-derecha": `${fotoDerecha}rem` } as CSSProperties}
      >
        <h1 className="text-3xl font-black leading-tight text-brand-support sm:text-4xl">{titulo}</h1>
        <p className="mt-3 max-w-xl border-l-4 border-brand-soft pl-3 text-sm font-medium leading-snug text-brand-support/85">
          {descripcion}
        </p>
        {accion && <div className="mt-5">{accion}</div>}

        {foto && (
          <FotoPolaroid
            {...foto}
            className="absolute right-[var(--foto-derecha)] top-1/2 hidden -translate-y-1/2 lg:block"
          />
        )}
        {distintivo}

        <Image
          src={imagen}
          alt={titulo}
          width={anchoImagen}
          height={560}
          priority
          className="pointer-events-none absolute bottom-0 right-4 hidden h-52 w-auto drop-shadow-[4px_6px_0_rgba(0,0,0,0.12)] md:block"
        />
      </div>
    </>
  );
}
