"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";

type Categoria = "infantil" | "juvenil" | "adulto";
type Distancia = "5k" | "10k" | "21k" | "42k";

interface Registrado {
  nombre: string;
  categoria: Categoria;
  distancia: Distancia;
}

const CATEGORIAS: { id: Categoria; label: string }[] = [
  { id: "infantil", label: "Infantil" },
  { id: "juvenil", label: "Juvenil" },
  { id: "adulto", label: "Adulto" },
];

const DISTANCIAS: { id: Distancia; label: string }[] = [
  { id: "5k", label: "5K Familiar" },
  { id: "10k", label: "10K" },
  { id: "21k", label: "21K Media Maratón" },
  { id: "42k", label: "42K Maratón Completa" },
];

const DISTANCIAS_POR_CATEGORIA: Record<Categoria, Distancia[]> = {
  infantil: ["5k", "10k", "21k", "42k"], // BUG-3: La categoría "Infantil" habilita equivocadamente "42K Maratón Completa".
  juvenil: ["5k", "10k", "21k"],
  adulto: ["5k", "10k", "21k", "42k"],
};

const COLORES_CONFETI = [
  "#F53E3E",
  "#FB8F3C",
  "#FBC02D",
  "#43A047",
  "#1E88E5",
  "#6A1B9A",
  "#D81B60",
];

export default function QACarreraForm() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [edad, setEdad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [categoria, setCategoria] = useState<Categoria>("adulto");
  const [distancia, setDistancia] = useState<Distancia>("10k");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [registrado, setRegistrado] = useState<Registrado | null>(null);

  const [respuestaAuditoria, setRespuestaAuditoria] = useState("");
  const [estadoAuditoria, setEstadoAuditoria] = useState<
    "idle" | "correcto" | "incorrecto"
  >("idle");

  function handleCategoriaChange(id: Categoria) {
    setCategoria(id);
    const disponibles = DISTANCIAS_POR_CATEGORIA[id];
    if (!disponibles.includes(distancia)) {
      setDistancia(disponibles[0] ?? "5k");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // BUG-7: El formulario se envía exitosamente aunque el checkbox de
    // "Términos y Condiciones" esté desmarcado (no se valida).
    setRegistrado({ nombre: nombre.trim(), categoria, distancia });
  }

  function handleValidarReporte() {
    // BUG-1 a BUG-7 están presentes en este formulario; el total esperado es 7.
    if (respuestaAuditoria.trim() === "7") {
      setEstadoAuditoria("correcto");
    } else {
      setEstadoAuditoria("incorrecto");
    }
  }

  const distanciasDisponibles = DISTANCIAS_POR_CATEGORIA[categoria];

  return (
    <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl shadow-brand-primary/20 backdrop-blur-md sm:p-8"
      >
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-support">
            Registro y Tiempos · Carrera del Pacífico
          </span>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-brand-support sm:text-3xl">
            Inscripción de corredor
          </h2>
          <p className="mt-2 text-sm text-brand-support/80">
            Completa los datos del participante para la carrera en Cali,
            Colombia.
          </p>
        </div>

        <label className="block text-left" htmlFor="qa-nombre">
          <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-brand-support">
            Nombre Completo
          </span>
          <input
            id="qa-nombre"
            type="text"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            placeholder="Ej. Santiago Pérez Caicedo"
            autoComplete="name"
            className="w-full rounded-2xl border-2 border-brand-soft bg-white/80 px-5 py-3.5 text-base text-brand-support shadow-sm outline-none transition placeholder:text-brand-support/50 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20"
          />
          {/* BUG-2: El campo "Nombre Completo" no valida el formato, por lo que
              acepta números y caracteres especiales. */}
        </label>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <label className="block text-left" htmlFor="qa-documento">
            <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-brand-support">
              Número de Documento
            </span>
            <input
              id="qa-documento"
              type="text"
              value={documento}
              onChange={(event) => setDocumento(event.target.value)}
              placeholder="Ej. 1144012345"
              autoComplete="off"
              className="w-full rounded-2xl border-2 border-brand-soft bg-white/80 px-5 py-3.5 text-base text-brand-support shadow-sm outline-none transition placeholder:text-brand-support/50 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20"
            />
            {/* BUG-4: El campo "Número de Documento" no restringe la entrada a
                dígitos, por lo que acepta letras. */}
          </label>

          <label className="block text-left" htmlFor="qa-edad">
            <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-brand-support">
              Edad
            </span>
            <input
              id="qa-edad"
              type="number"
              value={edad}
              onChange={(event) => setEdad(event.target.value)}
              placeholder="Ej. 25"
              min={1}
              max={120}
              className="w-full rounded-2xl border-2 border-brand-soft bg-white/80 px-5 py-3.5 text-base text-brand-support shadow-sm outline-none transition placeholder:text-brand-support/50 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20"
            />
            {/* BUG-1: El campo "Edad" no se valida al enviar el formulario, por
                lo que permite valores negativos o irreales (ej. -5 o 200). */}
          </label>
        </div>

        <label className="mt-6 block text-left" htmlFor="qa-telefono">
          <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-brand-support">
            Teléfono
          </span>
          <input
            id="qa-telefono"
            type="tel"
            value={telefono}
            onChange={(event) => setTelefono(event.target.value)}
            placeholder="Ej. 3001234567"
            autoComplete="tel"
            className="w-full rounded-2xl border-2 border-brand-soft bg-white/80 px-5 py-3.5 text-base text-brand-support shadow-sm outline-none transition placeholder:text-brand-support/50 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20"
          />
          {/* BUG-6: El mensaje de ayuda está escrito en inglés en lugar de
              español. */}
          <span className="mt-2 block text-xs text-brand-support/70">
            Enter a valid phone number
          </span>
        </label>

        <fieldset className="mt-6 text-left">
          <legend className="mb-3 block text-sm font-bold uppercase tracking-wide text-brand-support">
            Categoría
          </legend>
          <div className="flex flex-wrap gap-3">
            {CATEGORIAS.map((item) => (
              <label
                key={item.id}
                htmlFor={`qa-categoria-${item.id}`}
                className={`flex cursor-pointer items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${
                  categoria === item.id
                    ? "border-brand-primary bg-brand-primary text-white"
                    : "border-brand-soft bg-white/70 text-brand-support hover:border-brand-mid"
                }`}
              >
                <input
                  id={`qa-categoria-${item.id}`}
                  type="radio"
                  name="categoria"
                  value={item.id}
                  checked={categoria === item.id}
                  onChange={() => handleCategoriaChange(item.id)}
                  className="sr-only"
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6 text-left">
          <legend className="mb-3 block text-sm font-bold uppercase tracking-wide text-brand-support">
            Distancia
          </legend>
          <div className="flex flex-wrap gap-3">
            {DISTANCIAS.filter((item) =>
              distanciasDisponibles.includes(item.id),
            ).map((item) => (
              <label
                key={item.id}
                htmlFor={`qa-distancia-${item.id}`}
                className={`flex cursor-pointer items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${
                  distancia === item.id
                    ? "border-brand-mid bg-brand-mid text-white"
                    : "border-brand-soft bg-white/70 text-brand-support hover:border-brand-mid"
                }`}
              >
                <input
                  id={`qa-distancia-${item.id}`}
                  type="radio"
                  name="distancia"
                  value={item.id}
                  checked={distancia === item.id}
                  onChange={() => setDistancia(item.id)}
                  className="sr-only"
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>

        <label
          className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-brand-soft bg-white/70 p-4 text-left"
          htmlFor="qa-terminos"
        >
          <input
            id="qa-terminos"
            type="checkbox"
            checked={aceptaTerminos}
            onChange={(event) => setAceptaTerminos(event.target.checked)}
            className="mt-1 h-5 w-5 rounded border-brand-soft text-brand-primary"
          />
          <span className="text-sm text-brand-support">
            Acepto los Términos y Condiciones y la política de tratamiento de
            datos de la Carrera del Pacífico.
          </span>
        </label>

        <button
          type="submit"
          className="group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-brand-primary px-10 py-4 text-lg font-bold text-white shadow-xl shadow-brand-primary/30 transition-all duration-200 hover:translate-x-2 hover:bg-brand-mid focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-mid"
        >
          {/* BUG-5: Al pasar el cursor sobre el botón "Registrar Corredor",
              este se desplaza o desalinea en el formulario. */}
          Registrar Corredor
        </button>

        {registrado && (
          <p className="mt-4 animate-fade-in rounded-xl border border-brand-mid/50 bg-brand-soft/30 p-4 text-center text-sm font-semibold text-brand-support">
            ¡Inscripción confirmada!{" "}
            <strong>{registrado.nombre}</strong> correrá la{" "}
            <strong>
              {DISTANCIAS.find((d) => d.id === registrado.distancia)?.label}
            </strong>{" "}
            en categoría{" "}
            <strong>
              {CATEGORIAS.find((c) => c.id === registrado.categoria)?.label}
            </strong>
            .
          </p>
        )}
      </form>

      <section className="w-full rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl shadow-brand-primary/20 backdrop-blur-md sm:p-8">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-support">
            Auditoría QA
          </span>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-brand-support sm:text-3xl">
            Eres el ingeniero de QA
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-support/80">
            Explora el formulario de inscripción de la Carrera del Pacífico.
            Detecta las fallas de validación, lógica y UX. Ingresa el total
            exacto de errores encontrados para completar el módulo.
          </p>
        </div>

        {estadoAuditoria === "correcto" && <Confetti />}

        <div className="rounded-2xl border-2 border-brand-soft bg-white/70 p-5 text-left">
          <label className="block" htmlFor="qa-auditoria">
            <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-brand-support">
              ¿Cuántos errores encontraste?
            </span>
            <input
              id="qa-auditoria"
              type="number"
              inputMode="numeric"
              value={respuestaAuditoria}
              onChange={(event) => {
                setRespuestaAuditoria(event.target.value);
                setEstadoAuditoria("idle");
              }}
              placeholder="Ej. 5"
              aria-invalid={estadoAuditoria === "incorrecto"}
              className={`w-full rounded-2xl border-2 bg-white/80 px-5 py-3.5 text-base text-brand-support shadow-sm outline-none transition placeholder:text-brand-support/50 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 ${
                estadoAuditoria === "incorrecto"
                  ? "border-red-400"
                  : "border-brand-soft"
              }`}
            />
          </label>

          <button
            type="button"
            onClick={handleValidarReporte}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-mid px-8 py-3.5 text-lg font-bold text-white shadow-lg shadow-brand-mid/30 transition-all duration-300 hover:bg-brand-primary"
          >
            Validar Reporte
          </button>

          {estadoAuditoria === "correcto" && (
            <div className="mt-5 animate-fade-in rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 text-center">
              <p className="text-base font-bold text-emerald-700">
                ¡Excelente trabajo de QA! Has detectado todos los errores del
                formulario de la Carrera del Pacífico.
              </p>
              <p className="mt-1 text-xs text-emerald-700/80">
                Has identificado los 7 bugs: validación (edad, documento,
                nombre), lógica (categoría), UX (botón) y localización
                (teléfono).
              </p>
            </div>
          )}

          {estadoAuditoria === "incorrecto" && (
            <p className="mt-5 animate-fade-in rounded-xl border border-amber-300 bg-amber-50 p-3 text-center text-sm font-semibold text-amber-800">
              Estás cerca. Revisa bien los campos numéricos, las opciones de
              categoría y el comportamiento de los botones.
            </p>
          )}

          {estadoAuditoria === "correcto" && (
            <button
              type="button"
              onClick={() => router.push("/retos")}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-brand-primary/30 transition-all duration-300 hover:bg-brand-mid"
            >
              Continuar al siguiente rol
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
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

function Confetti() {
  const piezas = Array.from({ length: 80 }, (_, index) => ({
    id: index,
    color: COLORES_CONFETI[index % COLORES_CONFETI.length],
    x: `${(index % 10) * 11}%`,
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
          transition={{ duration: 2.4, delay: pieza.delay, ease: "easeIn" }}
          className="absolute h-3 w-2 rounded-sm"
          style={{
            left: pieza.x,
            backgroundColor: pieza.color,
          }}
        />
      ))}
    </div>
  );
}