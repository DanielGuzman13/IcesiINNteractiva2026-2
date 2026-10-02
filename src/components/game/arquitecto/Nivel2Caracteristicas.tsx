"use client";

import { useState } from "react";
import {
  BarraAcciones,
  Chip,
  EncabezadoNivel,
  RevelacionConcepto,
  ZonaSoltar,
  barajar,
} from "./ArquitectoUI";
import { CARACTERISTICAS, MOLDES, MOLDES_NIVEL2, type MoldeId } from "./feria-data";

const POR_MOLDE = 3;

const ICONOS: Partial<Record<MoldeId, string>> = {
  orquesta: "🎺",
  bailarin: "💃",
  boleta: "🎟️",
  desfile: "🎉",
};

export default function Nivel2Caracteristicas({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [orden] = useState(() => barajar(CARACTERISTICAS.map((c) => c.id)));
  const [moldes] = useState(() => barajar(MOLDES_NIVEL2));
  const [ubicacion, setUbicacion] = useState<Record<string, MoldeId | null>>({});
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [bloqueados, setBloqueados] = useState<string[]>([]);
  const [incorrectos, setIncorrectos] = useState<string[]>([]);
  const [intento, setIntento] = useState(0);
  const [pistaVisible, setPistaVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completado, setCompletado] = useState(false);

  const caracteristica = (id: string) => CARACTERISTICAS.find((c) => c.id === id)!;
  const enBanco = orden.filter((id) => !ubicacion[id]);
  const enMolde = (molde: MoldeId) => orden.filter((id) => ubicacion[id] === molde);
  const todosLlenos = MOLDES_NIVEL2.every((m) => enMolde(m).length === POR_MOLDE);
  const colocadas = orden.length - enBanco.length;

  function mover(id: string, destino: MoldeId | null) {
    if (bloqueados.includes(id)) return;
    if (destino && ubicacion[id] !== destino && enMolde(destino).length >= POR_MOLDE) {
      setError(
        `El molde ${MOLDES[destino].nombre} ya tiene ${POR_MOLDE} características. Quita una antes de agregar otra.`,
      );
      setSeleccionado(null);
      return;
    }
    setUbicacion((actual) => ({ ...actual, [id]: destino }));
    setIncorrectos((actual) => actual.filter((x) => x !== id));
    setSeleccionado(null);
    setError(null);
  }

  function seleccionar(id: string) {
    setSeleccionado((actual) => (actual === id ? null : id));
  }

  function reiniciarTarjetas() {
    setUbicacion((actual) => {
      const siguiente = { ...actual };
      for (const id of incorrectos) siguiente[id] = null;
      return siguiente;
    });
    setIncorrectos([]);
    setSeleccionado(null);
    setError(null);
  }

  function validar() {
    const colocadasIds = orden.filter((id) => ubicacion[id]);
    const malos = colocadasIds.filter((id) => caracteristica(id).molde !== ubicacion[id]);
    const buenos = colocadasIds.filter((id) => !malos.includes(id));
    setBloqueados(buenos);
    setSeleccionado(null);

    if (malos.length === 0) {
      setIncorrectos([]);
      setError(null);
      setCompletado(true);
      return;
    }
    setIncorrectos(malos);
    setIntento((i) => i + 1);
    setError(
      `⚠️ ${malos.length} característica${malos.length === 1 ? " no corresponde" : "s no corresponden"}. Lee la explicación en rojo y devuélvela${malos.length === 1 ? "" : "s"} al banco.`,
    );
  }

  if (completado) {
    return (
      <RevelacionConcepto
        titulo="¡Definiste los atributos!"
        textoBoton="Ir al Nivel 3"
        onContinuar={onComplete}
      >
        <p>
          Las características de un molde se llaman <strong>atributos</strong>.
        </p>
        <p className="mt-3">
          Cada objeto llena los atributos con sus propios valores: la boleta de
          palco y la de gradería tienen <em>precio</em>, pero no cuestan lo
          mismo. Por eso “Salsa” no es un atributo: es el <em>valor</em> del
          atributo “género musical”.
        </p>
      </RevelacionConcepto>
    );
  }

  function renderChip(id: string) {
    const c = caracteristica(id);
    const esBloqueado = bloqueados.includes(id);
    const esIncorrecto = incorrectos.includes(id);
    return (
      <Chip
        key={id}
        id={id}
        texto={c.texto}
        detalle={esIncorrecto ? c.explicacion : undefined}
        estado={esBloqueado ? "correcto" : esIncorrecto ? "incorrecto" : "normal"}
        bloqueado={esBloqueado}
        seleccionado={seleccionado === id}
        intento={intento}
        compacto
        onSeleccionar={seleccionar}
      />
    );
  }

  return (
    <div className="space-y-6">
      <EncabezadoNivel
        etiqueta="Nivel 2 de 3 - ¿Qué lo describe?"
        titulo="Dale características a cada molde"
        instrucciones={
          <>
            Para guardar la información de la Feria, la app necesita saber qué
            datos tiene cada molde. Pon <strong>3 características</strong> en
            cada uno. <strong>Cuidado:</strong> hay 3 tarjetas que no son
            características y deben quedarse en el banco.
          </>
        }
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-80 lg:flex-shrink-0">
          <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-2xl shadow-brand-primary/20 backdrop-blur-md lg:sticky lg:top-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wide text-brand-support">
                Banco
              </h3>
              <span className="text-xs text-brand-support/60">{colocadas}/12 colocadas</span>
            </div>
            <ZonaSoltar
              onSoltar={(id) => mover(id, null)}
              onClickZona={() => seleccionado && mover(seleccionado, null)}
              activa={!!seleccionado && !!ubicacion[seleccionado]}
              className="flex min-h-24 flex-wrap gap-2 p-3"
            >
              {enBanco.map(renderChip)}
            </ZonaSoltar>
            <button
              type="button"
              onClick={reiniciarTarjetas}
              disabled={intento === 0 || incorrectos.length === 0}
              className="mt-3 w-full rounded-xl border border-brand-primary/30 bg-white px-4 py-2 text-sm font-bold text-brand-primary transition hover:bg-brand-primary/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
            >
              Reiniciar tarjetas
            </button>
            <p className="mt-3 text-xs text-brand-support/70">
              Prueba decir: “Toda boleta tiene un ___”. Si la frase tiene
              sentido, es una característica de Boleta.
            </p>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
          {moldes.map((moldeId) => {
            const ids = enMolde(moldeId);
            return (
              <ZonaSoltar
                key={moldeId}
                onSoltar={(id) => mover(id, moldeId)}
                onClickZona={() => seleccionado && mover(seleccionado, moldeId)}
                activa={!!seleccionado && ubicacion[seleccionado] !== moldeId}
                className="overflow-hidden !border-solid"
              >
                <div className="flex items-center justify-between bg-brand-primary px-4 py-3 text-white">
                  <span className="font-display text-lg font-black">
                    {ICONOS[moldeId]} {MOLDES[moldeId].nombre}
                  </span>
                  <span className="border border-white/50 px-2 py-0.5 font-mono text-xs font-bold">
                    {ids.length}/{POR_MOLDE}
                  </span>
                </div>
                <div className="flex min-h-40 flex-col gap-2 p-3">
                  {ids.length === 0 ? (
                    <p className="m-auto text-center text-sm text-brand-support/40">
                      Suelta aquí 3 características
                    </p>
                  ) : (
                    ids.map(renderChip)
                  )}
                </div>
              </ZonaSoltar>
            );
          })}
        </div>
      </div>

      <BarraAcciones
        puedeValidar={todosLlenos}
        textoPendiente={`Completa los 4 moldes (${colocadas}/12)`}
        textoValidar="Validar características"
        pistaTexto="Una característica es un dato que puedes llenar para CUALQUIER ejemplo del molde. Los nombres propios (como Grupo Niche) o valores sueltos (como Salsa) no son características."
        pistaVisible={pistaVisible}
        onPista={() => setPistaVisible(true)}
        onValidar={validar}
        error={error}
      />
    </div>
  );
}
