"use client";

import { useState } from "react";
import {
  BarraAcciones,
  Chip,
  EncabezadoNivel,
  RevelacionConcepto,
  ZonaSoltar,
  barajar,
  calcularPuntaje,
} from "./ArquitectoUI";
import { CONEXIONES, MOLDES, VERBOS, verboPorId, type MoldeId } from "./feria-data";

function PildoraMolde({ id }: { id: MoldeId }) {
  return (
    <span className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-3 py-2 text-center text-sm font-black text-white shadow-md sm:text-base">
      {MOLDES[id].nombre}
    </span>
  );
}

export default function Nivel3Conexiones({
  onComplete,
}: {
  onComplete: (score: number) => void;
}) {
  const [orden] = useState(() => barajar(VERBOS.map((v) => v.id)));
  const [frases] = useState(() => barajar(CONEXIONES));
  // conexionId -> verboId
  const [asignacion, setAsignacion] = useState<Record<string, string | null>>({});
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [bloqueadas, setBloqueadas] = useState<string[]>([]);
  const [incorrectas, setIncorrectas] = useState<string[]>([]);
  const [intento, setIntento] = useState(0);
  const [fallos, setFallos] = useState(0);
  const [pistas, setPistas] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [completado, setCompletado] = useState(false);

  const usados = Object.values(asignacion).filter(Boolean) as string[];
  const enBanco = orden.filter((id) => !usados.includes(id));
  const llenas = CONEXIONES.filter((c) => asignacion[c.id]).length;

  const conexionDeVerbo = (verboId: string) =>
    CONEXIONES.find((c) => asignacion[c.id] === verboId)?.id ?? null;

  function colocar(verboId: string, conexionId: string | null) {
    const origen = conexionDeVerbo(verboId);
    if (origen && bloqueadas.includes(origen)) return;
    if (conexionId && bloqueadas.includes(conexionId)) return;

    setAsignacion((actual) => {
      const siguiente = { ...actual };
      if (origen) siguiente[origen] = null;
      if (conexionId) siguiente[conexionId] = verboId;
      return siguiente;
    });
    setIncorrectas((actual) =>
      actual.filter((id) => id !== origen && id !== conexionId),
    );
    setSeleccionado(null);
    setError(null);
  }

  function seleccionar(id: string) {
    setSeleccionado((actual) => (actual === id ? null : id));
  }

  function validar() {
    const malas = CONEXIONES.filter((c) => asignacion[c.id] !== c.verboCorrecto).map(
      (c) => c.id,
    );
    setBloqueadas(CONEXIONES.map((c) => c.id).filter((id) => !malas.includes(id)));
    setSeleccionado(null);

    if (malas.length === 0) {
      setIncorrectas([]);
      setError(null);
      setCompletado(true);
      return;
    }
    setIncorrectas(malas);
    setFallos((f) => f + 1);
    setIntento((i) => i + 1);
    setError(
      `⚠️ ${malas.length} conexi${malas.length === 1 ? "ón no tiene" : "ones no tienen"} sentido. Lee la frase completa en voz alta y usa la pregunta guía.`,
    );
  }

  if (completado) {
    const puntaje = calcularPuntaje(fallos, pistas);
    return (
      <RevelacionConcepto
        titulo="¡Conectaste el sistema!"
        puntaje={puntaje}
        textoBoton="Ver mi plano final"
        onContinuar={() => onComplete(puntaje)}
      >
        <p>
          Estas conexiones se llaman <strong>relaciones</strong>. Le dicen al
          equipo cómo se comunican las partes del programa.
        </p>
        <p className="mt-3">
          Con <strong>clases</strong>, <strong>atributos</strong> y{" "}
          <strong>relaciones</strong> ya tienes el plano completo de la app de
          la Feria. ¡Veámoslo!
        </p>
      </RevelacionConcepto>
    );
  }

  return (
    <div className="space-y-6">
      <EncabezadoNivel
        etiqueta="Nivel 3 de 3 - ¿Cómo se conectan?"
        titulo="Conecta los moldes con una acción"
        instrucciones={
          <>
            En la Feria las cosas se relacionan entre sí. Arrastra la acción
            correcta a cada frase para que tenga sentido.{" "}
            <strong>Sobran 2 acciones.</strong>
          </>
        }
      />

      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl shadow-brand-primary/20 backdrop-blur-md">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wide text-brand-support">
            Acciones
          </h3>
          <span className="text-xs text-brand-support/60">{llenas}/5 frases completas</span>
        </div>
        <ZonaSoltar
          onSoltar={(id) => colocar(id, null)}
          onClickZona={() => seleccionado && colocar(seleccionado, null)}
          activa={!!seleccionado && !!conexionDeVerbo(seleccionado)}
          className="flex min-h-16 flex-wrap gap-2 p-4"
        >
          {enBanco.map((id) => (
            <Chip
              key={id}
              id={id}
              texto={verboPorId(id)?.texto ?? ""}
              seleccionado={seleccionado === id}
              compacto
              onSeleccionar={seleccionar}
            />
          ))}
        </ZonaSoltar>
      </div>

      <div className="space-y-3">
        {frases.map((conexion) => {
          const verboId = asignacion[conexion.id] ?? null;
          const bloqueada = bloqueadas.includes(conexion.id);
          const incorrecta = incorrectas.includes(conexion.id);
          return (
            <div
              key={conexion.id}
              className={`rounded-2xl border-2 p-4 transition-colors ${
                bloqueada
                  ? "border-emerald-300 bg-emerald-50"
                  : incorrecta
                    ? "border-red-300 bg-red-50/60"
                    : "border-brand-soft bg-white/70"
              }`}
            >
              <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_minmax(12rem,1.2fr)_1fr]">
                <div className="flex justify-center sm:justify-end">
                  <PildoraMolde id={conexion.desde} />
                </div>
                <ZonaSoltar
                  onSoltar={(id) => colocar(id, conexion.id)}
                  onClickZona={() => seleccionado && colocar(seleccionado, conexion.id)}
                  activa={!!seleccionado && !bloqueada}
                  invalida={incorrecta}
                  className="flex min-h-12 items-center justify-center p-1.5"
                >
                  {verboId ? (
                    <Chip
                      id={verboId}
                      texto={verboPorId(verboId)?.texto ?? ""}
                      estado={bloqueada ? "correcto" : incorrecta ? "incorrecto" : "normal"}
                      bloqueado={bloqueada}
                      seleccionado={seleccionado === verboId}
                      intento={intento}
                      compacto
                      onSeleccionar={seleccionar}
                    />
                  ) : (
                    <span className="text-sm text-brand-support/40">¿qué acción?</span>
                  )}
                </ZonaSoltar>
                <div className="flex justify-center sm:justify-start">
                  <PildoraMolde id={conexion.hacia} />
                </div>
              </div>
              {incorrecta && (
                <p className="mt-2 text-center text-xs font-semibold text-red-600">
                  Pregunta guía: {conexion.pista}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <BarraAcciones
        puedeValidar={llenas === CONEXIONES.length}
        textoPendiente={`Completa las 5 frases (${llenas}/5)`}
        textoValidar="Validar conexiones"
        pistaTexto="Lee cada frase completa en voz alta, por ejemplo “Un Asistente ___ una Boleta”. Si suena lógico en la Feria de Cali, vas bien. Las acciones absurdas son las que sobran."
        pistaVisible={pistas > 0}
        onPista={() => setPistas(1)}
        onValidar={validar}
        error={error}
      />
    </div>
  );
}
