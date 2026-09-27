import Link from "next/link";
import Carousel from "@/components/home/Carousel";

export default function Home() {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      <Carousel />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(43,58,86,0.45) 0%, rgba(43,58,86,0.75) 100%)",
        }}
      />

      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-between px-6 py-10 sm:py-14">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm sm:text-sm">
            Cali nos une
          </span>
          <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
            Bienvenido al reto
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/90 drop-shadow sm:text-lg">
            Una experiencia interactiva donde tus ideas construyen el futuro de
            nuestra región.
          </p>
        </div>

        <div className="pb-2 sm:pb-4">
          <Link
            href="/registro"
            className="group inline-flex items-center gap-3 rounded-full bg-brand-primary px-12 py-4 text-lg font-bold text-white shadow-xl shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-mid hover:shadow-2xl hover:shadow-black/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/70 active:translate-y-0 sm:px-16 sm:py-5 sm:text-xl"
          >
            Iniciar
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
          </Link>
        </div>
      </div>
    </div>
  );
}