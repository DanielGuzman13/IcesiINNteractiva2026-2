"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";

const EXPRESIONES: string[] = [
  "CHOLADOHELADO",
  "LULADAFRIA",
  "MANGOVICHE",
  "CHONTADURO",
  "PANADADECALI",
  "MYACADJELO",
  "CHORIPAN",
  "MYACADGAO",
  "ZILOLISDA",
  "BRISASDECALI",
  "POLLOCONPAPA",
  "CHOLADOFRIO",
  "FRITOCALENO",
  "BULEVARDELRIO",
  "ISLITADELRIO",
  "GAOCONPAPA",
  "LULADARICA",
  "MANGOENLIMON",
  "CHOLADODULCE",
  "MALBONITO",
  "PAPAFRITA",
  "LULADAGORDA",
  "MYACACONPAPA",
  "POLLOCALENO",
  "CALENOFRIO",
  "CHORICALENO",
  "LULADAFRESCA",
  "MANGOVITO",
  "BUFFOCALENO",
  "POLLAGOTO",
  "MYACACONFRIO",
  "PAPAFRITA",
  "FRITORICO",
  "POLLORICO",
  "CALENOAMOR",
];

function cifrarCesar(texto: string, posiciones: number) {
  const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return texto
    .split("")
    .map((letra) => {
      const indice = abecedario.indexOf(letra);
      return indice === -1
        ? letra
        : abecedario[(indice + posiciones + 26) % 26];
    })
    .join("");
}

const GANADORES = [
  { posicion: 1, corredor: "Juliana Rodríguez", categoria: "Elite Femenina", tiempo: "1:12:48" },
  { posicion: 2, corredor: "Andrés Felipe Mina", categoria: "Elite Masculina", tiempo: "1:10:22" },
  { posicion: 3, corredor: "María Camila Torres", categoria: "Master 40+", tiempo: "1:25:03" },
  { posicion: 4, corredor: "Diego Andrés Caicedo", categoria: "Elite Masculina", tiempo: "1:11:57" },
  { posicion: 5, corredor: "Laura Valentina Paz", categoria: "Junior 18-21", tiempo: "1:08:34" },
];

const COLORES_CONFETI = [
  "#F53E3E",
  "#FB8F3C",
  "#FBC02D",
  "#43A047",
  "#1E88E5",
  "#6A1B9A",
  "#D81B60",
];

export default function CyberCarreraChallenge() {
  const [estado, setEstado] = useState<"bloqueado" | "restaurado">("bloqueado");
  const [clave, setClave] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [intentoFallido, setIntentoFallido] = useState(0);
  const [expresionIndex] = useState(() =>
    typeof window === "undefined"
      ? 0
      : Math.floor(Math.random() * EXPRESIONES.length),
  );

  const expresion = EXPRESIONES[expresionIndex];
  const encriptado = cifrarCesar(expresion, 3);

  function handleRestaurar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (clave.trim().toLowerCase() === expresion.toLowerCase()) {
      setError(null);
      setEstado("restaurado");
      return;
    }
    setError(
      "⚠️ Clave de acceso no válida. Recuerda resolver el acertijo (21K ÷ 7 = 3) y retroceder 3 posiciones en el abecedario para cada letra.",
    );
    setIntentoFallido((current) => current + 1);
  }

  return (
    <div className="w-full">
      {estado === "bloqueado" ? (
        <motion.div
          key={intentoFallido}
          animate={intentoFallido > 0 ? { x: [0, -12, 12, -12, 12, -8, 8, 0] } : undefined}
          transition={{ duration: 0.55 }}
          className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2"
        >
          <div className="space-y-6">
            <div className="rounded-3xl border-2 border-red-400 bg-red-50 p-6 text-center shadow-xl shadow-red-500/10">
              <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-red-600">
                Estado del servidor
              </span>
              <p className="mt-3 animate-pulse text-2xl font-black tracking-tight text-red-600 sm:text-3xl">
                ⚠️ SERVIDOR BLOQUEADO / ATAQUE DETECTADO
              </p>
              <p className="mt-2 text-sm text-red-500/90">
                Un atacante bloqueó la puerta de enlace del servidor de
                resultados del Bulevar del Río con un algoritmo de Cifrado
                César dinámico.
              </p>
            </div>

            <div className="rounded-3xl border border-brand-soft bg-brand-light/30 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-brand-support">
                Código Encriptado
              </h3>
              <p
                suppressHydrationWarning
                className="mt-2 rounded-xl bg-white/70 p-4 font-mono text-xl tracking-widest text-brand-primary"
              >
                {encriptado}
              </p>
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
                <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                  Pista: clave de desplazamiento
                </p>
                <p className="mt-1 text-xs leading-relaxed text-amber-800/90">
                  &ldquo;La clave de desplazamiento es igual al número de kilómetros
                  oficiales de la Media Maratón de Cali (21K) dividida entre 7&rdquo;
                  (21 ÷ 7 = 3, Desplazamiento = 3 posiciones hacia atrás en el
                  abecedario).
                </p>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-brand-support/80">
                Paso 1: Resuelve el acertijo numérico en tu hoja para hallar el
                desplazamiento y descifra el código usando la tabla de Cifrado
                César.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl shadow-brand-primary/20 backdrop-blur-md sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand-support" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              <div>
                <h2 className="text-lg font-black text-brand-support">
                  Recuperación de emergencia
                </h2>
                <p className="text-xs text-brand-support/70">
                  Restaura el acceso a la tabla oficial de tiempos.
                </p>
              </div>
            </div>

            <form onSubmit={handleRestaurar} noValidate className="text-left">
              <label className="block" htmlFor="cyber-clave">
                <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-brand-support">
                  Clave Descifrada
                </span>
                <input
                  id="cyber-clave"
                  type="text"
                  value={clave}
                  onChange={(event) => {
                    setClave(event.target.value);
                    setError(null);
                  }}
                  placeholder="Ingresa la clave descifrada"
                  autoComplete="off"
                  aria-invalid={Boolean(error)}
                  className={`w-full rounded-2xl border-2 bg-white/80 px-5 py-3.5 font-mono text-base text-brand-support shadow-sm outline-none transition placeholder:font-sans placeholder:text-brand-support/50 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 ${
                    error ? "border-red-400" : "border-brand-soft"
                  }`}
                />
              </label>

              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-red-500/30 transition-all duration-300 hover:bg-red-600"
              >
                Restaurar Servidor
              </button>

              {error && (
                <p className="mt-4 animate-fade-in rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-600">
                  {error}
                </p>
              )}
            </form>

            <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brand-soft bg-brand-light/30 p-5">
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-brand-support" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 21v-6M16 21v-6M8 5V3M16 5V3" />
              </svg>
              <p className="text-sm font-semibold text-brand-support">
                Tabla oficial de tiempos bloqueada
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="relative w-full overflow-hidden rounded-3xl">
          <Confetti />

          <div className="rounded-3xl border-2 border-emerald-300 bg-emerald-50 p-6 text-center shadow-xl shadow-emerald-500/10 sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Estado del servidor
            </span>
            <p className="mt-3 text-2xl font-black tracking-tight text-emerald-700 sm:text-3xl">
              ✅ SISTEMA RESTAURADO
            </p>
            <div className="mx-auto mt-4 max-w-lg rounded-xl border border-emerald-300 bg-[#0d1117] p-4 text-left font-mono text-xs text-emerald-400 sm:text-sm">
              <p>
                <span className="text-emerald-300">&gt;</span> Restaurando
                gateway del Bulevar del Río...
              </p>
              <p className="mt-1">
                <span className="text-emerald-300">&gt;</span> [SUCCESS] Clave
                Cifrado César verificada. Desbloqueando tabla de tiempos...
              </p>
              <p className="mt-1">
                <span className="text-emerald-300">&gt;</span>{" "}
                <span className="text-emerald-200">
                  Acceso restaurado. Bienvenido, Analista de Ciberseguridad.
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-2xl shadow-brand-primary/20 backdrop-blur-md">
            <div className="border-b border-brand-soft bg-brand-light/40 px-6 py-4">
              <h3 className="text-lg font-black text-brand-support">
                Tabla oficial de ganadores · Carrera del Pacífico
              </h3>
              <p className="text-xs text-brand-support/70">
                Resultados Bulevar del Río, Cali — Colombia
              </p>
            </div>
            <div className="overflow-x-auto p-4 sm:p-6">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-brand-soft text-xs font-bold uppercase tracking-wide text-brand-support">
                    <th className="px-3 py-2">Posición</th>
                    <th className="px-3 py-2">Corredor</th>
                    <th className="px-3 py-2">Categoría</th>
                    <th className="px-3 py-2 text-right">Tiempo</th>
                  </tr>
                </thead>
                <tbody>
                  {GANADORES.map((ganador) => (
                    <tr
                      key={ganador.posicion}
                      className="border-b border-brand-soft/40 text-brand-support last:border-0"
                    >
                      <td className="px-3 py-3 font-black text-brand-primary">
                        {ganador.posicion}°
                      </td>
                      <td className="px-3 py-3 font-semibold">
                        {ganador.corredor}
                      </td>
                      <td className="px-3 py-3">{ganador.categoria}</td>
                      <td className="px-3 py-3 text-right font-mono">
                        {ganador.tiempo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/retos"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-8 py-3.5 text-lg font-bold text-white shadow-xl shadow-brand-primary/30 transition-all duration-300 hover:bg-brand-mid"
            >
              Siguiente actividad del taller
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
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
      )}
    </div>
  );
}

function Confetti() {
  const piezas = Array.from({ length: 90 }, (_, index) => ({
    id: index,
    color: COLORES_CONFETI[index % COLORES_CONFETI.length],
    left: `${(index % 10) * 11}%`,
    delay: (index % 12) * 0.06,
    rotation: (index % 7) * 90,
  }));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-3xl"
    >
      {piezas.map((pieza) => (
        <motion.div
          key={pieza.id}
          initial={{ y: -16, opacity: 1 }}
          animate={{ y: "110vh", opacity: 0, rotate: pieza.rotation }}
          transition={{ duration: 2.6, delay: pieza.delay, ease: "easeIn" }}
          className="absolute h-3 w-2 rounded-sm"
          style={{ left: pieza.left, backgroundColor: pieza.color }}
        />
      ))}
    </div>
  );
}