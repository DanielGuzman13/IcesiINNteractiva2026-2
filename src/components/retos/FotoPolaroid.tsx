import Image from "next/image";
import { Caveat } from "next/font/google";

const caveat = Caveat({ subsets: ["latin"], weight: ["600"] });

export type FotoPolaroidProps = {
  src: string;
  alt: string;
  pie: string;
  ancho: number;
  alto: number;
  proporcion?: string;
  encuadre?: string;
  giro?: number;
  anchoMarco?: string;
  cinta?: "centro" | "esquinas" | "esquina";
  className?: string;
};

export default function FotoPolaroid({
  src,
  alt,
  pie,
  ancho,
  alto,
  proporcion = `${ancho} / ${alto}`,
  encuadre = "center",
  giro = -2,
  anchoMarco = "w-56",
  cinta = "centro",
  className = "",
}: FotoPolaroidProps) {
  const giroNitido = Math.max(-3, Math.min(3, giro));

  return (
    <figure
      className={`pointer-events-none ${anchoMarco} bg-white p-2 pb-0 shadow-[4px_6px_0_rgba(0,0,0,0.14),0_10px_24px_rgba(0,0,0,0.18)] ${className}`}
      style={{ rotate: `${giroNitido}deg` }}
    >
      {cinta === "centro" && (
        <span
          className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[3deg] bg-brand-mid/60 shadow-sm"
          aria-hidden="true"
        />
      )}
      {cinta === "esquina" && (
        <span
          className="absolute -left-5 top-1 z-10 h-6 w-20 -rotate-[35deg] bg-brand-mid/60 shadow-sm"
          aria-hidden="true"
        />
      )}
      {cinta === "esquinas" && (
        <>
          <span
            className="absolute -left-4 -top-1 z-10 h-5 w-14 -rotate-[38deg] bg-brand-mid/60 shadow-sm"
            aria-hidden="true"
          />
          <span
            className="absolute -right-4 -top-1 z-10 h-5 w-14 rotate-[38deg] bg-brand-mid/60 shadow-sm"
            aria-hidden="true"
          />
        </>
      )}
      <div
        className="relative overflow-hidden bg-brand-support/10"
        style={{ aspectRatio: proporcion }}
      >
        <Image
          src={src}
          alt={alt}
          width={ancho}
          height={alto}
          sizes="224px"
          quality={90}
          priority
          className="h-full w-full object-cover"
          style={{ objectPosition: encuadre }}
        />
      </div>
      <figcaption
        className={`${caveat.className} py-1.5 text-center text-xl leading-none text-brand-support/85`}
      >
        {pie}
      </figcaption>
    </figure>
  );
}
