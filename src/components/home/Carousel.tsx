"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export interface MediaSlide {
  type: "image" | "video";
  src: string;
  alt?: string;
  poster?: string;
}

interface CarouselProps {
  slides?: MediaSlide[];
  autoAdvanceMs?: number;
  onPrevLabel?: string;
  onNextLabel?: string;
}

const DEFAULT_SLIDES: MediaSlide[] = [
  {
    type: "image",
    src: "/media/cali-skyline.svg",
    alt: "Skyline de Cali con colores de la marca",
  },
  {
    type: "video",
    src: "/media/cali-demo.mp4",
    alt: "Video de bienvenida Cali nos une",
    poster: "/media/cali-unite.svg",
  },
  {
    type: "image",
    src: "/media/cali-sunrise.svg",
    alt: "Amanecer en Cali",
  },
  {
    type: "image",
    src: "/media/cali-unite.svg",
    alt: "Cali nos une",
  },
];

export default function Carousel({
  slides = DEFAULT_SLIDES,
  autoAdvanceMs = 6000,
  onPrevLabel = "Anterior",
  onNextLabel = "Siguiente",
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = window.setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, autoAdvanceMs);
    return () => window.clearInterval(id);
  }, [paused, slides.length, autoAdvanceMs]);

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Galería de Cali nos une"
      className="absolute inset-0 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={`${slide.src}-${index}`}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
          >
            {slide.type === "image" ? (
              <Image
                src={slide.src}
                alt={slide.alt ?? ""}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <div className="relative h-full w-full">
                {isActive ? (
                  <video
                    src={slide.src}
                    poster={slide.poster}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-label={slide.alt}
                  />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{
                      background:
                        "linear-gradient(135deg,#45609B,#719FC1,#91A4BC,#B2BCCC)",
                    }}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label={onPrevLabel}
            className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition hover:bg-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:left-5"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={onNextLabel}
            className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition hover:bg-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:right-5"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/25 px-3 py-2 backdrop-blur-sm sm:bottom-8">
            {slides.map((slide, index) => (
              <button
                key={`${slide.src}-${index}`}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Ir a la diapositiva ${index + 1}`}
                aria-current={index === current}
                className={`h-2.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                  index === current
                    ? "w-7 bg-white"
                    : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}