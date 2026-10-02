import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import FotoPolaroid, { type FotoPolaroidProps } from "./FotoPolaroid";

export default function EncabezadoConsola({
  ruta,
  estado,
  ledClase,
  titulo,
  descripcion,
  imagen,
  anchoImagen,
  altoImagen = 1488,
  foto,
  fotoDerecha = 15,
  distintivo,
}: {
  ruta: string;
  estado: string;
  ledClase: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  anchoImagen: number;
  altoImagen?: number;
  foto?: Omit<FotoPolaroidProps, "className">;
  fotoDerecha?: number;
  distintivo?: ReactNode;
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-3 bg-black/40 px-5 py-2 font-mono text-[11px] tracking-wider text-white/70">
        <span className="truncate">{ruta}</span>
        <span className="flex shrink-0 items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${ledClase}`} aria-hidden="true" />
          {estado}
        </span>
      </div>

      <div
        className={`relative flex flex-col justify-center bg-brand-support px-6 py-7 text-white sm:px-8 md:min-h-[14rem] md:pr-72 ${foto ? "lg:pr-[calc(var(--foto-derecha)+15rem)]" : ""}`}
        style={{ "--foto-derecha": `${fotoDerecha}rem` } as CSSProperties}
      >
        <h1 className="text-3xl font-black leading-tight sm:text-4xl">{titulo}</h1>
        <p className="mt-3 max-w-xl font-mono text-sm leading-snug text-white/75">
          <span className="text-brand-mid">&gt;</span> {descripcion}
        </p>

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
          height={altoImagen}
          priority
          className="pointer-events-none absolute bottom-0 right-4 hidden h-52 w-auto drop-shadow-[0_0_18px_rgba(255,255,255,0.18)] md:block"
        />
      </div>
      <div className="cinta-precaucion h-2.5" aria-hidden="true" />
    </>
  );
}
