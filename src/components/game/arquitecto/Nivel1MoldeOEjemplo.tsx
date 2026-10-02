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
import { TARJETAS_NIVEL1, type TipoTarjeta } from "./feria-data";

const ZONAS: { tipo: TipoTarjeta; titulo: string; descripcion: string }[] = [
  {
    tipo: "molde",
    titulo: "🧩 Moldes",
    descripcion: "Tipos de cosa: hay muchos de ellos en la Feria",
  },
  {
    tipo: "ejemplo",
    titulo: "📍 Ejemplos reales",
    descripcion: "Uno en particular, con nombre propio o número único",
  },
];

export default function Nivel1MoldeOEjemplo({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [orden] = useState(() => barajar(TARJETAS_NIVEL1.map((t) => t.id)));
  const [ubicacion, setUbicacion] = useState<Record<string, TipoTarjeta | null>>({});
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [bloqueados, setBloqueados] = useState<string[]>([]);
  const [incorrectos, setIncorrectos] = useState<string[]>([]);
  const [intento, setIntento] = useState(0);
  const [pistaVisible, setPistaVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completado, setCompletado] = useState(false);

  const tarjeta = (id: string) => TARJETAS_NIVEL1.find((t) => t.id === id)!;
  const enBanco = orden.filter((id) => !ubicacion[id]);
  const colocadas = orden.length - enBanco.length;

  function mover(id: string, destino: TipoTarjeta | null) {
    if (bloqueados.includes(id)) return;
    setUbicacion((actual) => ({ ...actual, [id]: destino }));
    setIncorrectos((actual) => actual.filter((x) => x !== id));
    setSeleccionado(null);
    setError(null);
  }

  function seleccionar(id: string) {
    setSeleccionado((actual) => (actual === id ? null : id));
  }

  function validar() {
    const malos = orden.filter((id) => ubicacion[id] !== tarjeta(id).tipo);
    const buenos = orden.filter((id) => !malos.includes(id));
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
      `⚠️ ${malos.length} tarjeta${malos.length === 1 ? "" : "s"} en el lugar equivocado. Lee la explicación en rojo y muévelas.`,
    );
  }

  if (completado) {
    return (
      <RevelacionConcepto
        titulo="¡Acabas de hacer abstracción!"
        textoBoton="Ir al Nivel 2"
        onContinuar={onComplete}
      >
        <p>
          Los ingenieros de sistemas llaman <strong>clase</strong> al molde y{" "}
          <strong>objeto</strong> a cada ejemplo real.
        </p>
        <p className="mt-3">
          Separar lo general (Orquesta) de lo particular (Grupo Niche) se llama{" "}
          <strong>abstracción</strong>, y es la primera herramienta de un
          arquitecto de software.
        </p>
      </RevelacionConcepto>
    );
  }

  function renderChip(id: string) {
    const t = tarjeta(id);
    const esBloqueado = bloqueados.includes(id);
    const esIncorrecto = incorrectos.includes(id);
    return (
      <Chip
        key={id}
        id={id}
        texto={t.texto}
        detalle={esBloqueado || esIncorrecto ? t.explicacion : undefined}
        estado={esBloqueado ? "correcto" : esIncorrecto ? "incorrecto" : "normal"}
        bloqueado={esBloqueado}
        seleccionado={seleccionado === id}
        intento={intento}
        onSeleccionar={seleccionar}
      />
    );
  }

  return (
    <div className="space-y-6">
      <EncabezadoNivel
        etiqueta="Nivel 1 de 3 - ¿Molde o ejemplo?"
        titulo="Separa los moldes de los ejemplos"
        instrucciones={
          <>
            Antes de construir la app de la Feria, el arquitecto debe saber de
            qué <strong>tipos de cosas</strong> hablará el sistema. Arrastra
            cada tarjeta (o tócala y luego toca la columna) a{" "}
            <strong>Moldes</strong> o <strong>Ejemplos reales</strong>.
          </>
        }
      />

      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl shadow-brand-primary/20 backdrop-blur-md">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wide text-brand-support">
            Tarjetas de la Feria
          </h3>
          <span className="text-xs text-brand-support/60">{colocadas}/12 colocadas</span>
        </div>
        <ZonaSoltar
          onSoltar={(id) => mover(id, null)}
          onClickZona={() => seleccionado && mover(seleccionado, null)}
          activa={!!seleccionado && !!ubicacion[seleccionado]}
          className="flex min-h-20 flex-wrap gap-3 p-4"
        >
          {enBanco.length === 0 ? (
            <p className="m-auto text-center text-sm text-brand-support/50">
              Todas las tarjetas están colocadas
            </p>
          ) : (
            enBanco.map(renderChip)
          )}
        </ZonaSoltar>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {ZONAS.map((zona) => {
          const ids = orden.filter((id) => ubicacion[id] === zona.tipo);
          return (
            <ZonaSoltar
              key={zona.tipo}
              onSoltar={(id) => mover(id, zona.tipo)}
              onClickZona={() => seleccionado && mover(seleccionado, zona.tipo)}
              activa={!!seleccionado && ubicacion[seleccionado] !== zona.tipo}
              className="min-h-64 p-5"
            >
              <div className="mb-4 text-center">
                <h3 className="text-xl font-black text-brand-primary">{zona.titulo}</h3>
                <p className="text-xs text-brand-support/70">{zona.descripcion}</p>
              </div>
              <div className="flex flex-col gap-2.5">
                {ids.length === 0 ? (
                  <p className="rounded-xl border-2 border-dashed border-brand-soft/60 bg-white/40 px-4 py-6 text-center text-sm text-brand-support/40">
                    Suelta aquí las tarjetas
                  </p>
                ) : (
                  ids.map(renderChip)
                )}
              </div>
            </ZonaSoltar>
          );
        })}
      </div>

      <BarraAcciones
        puedeValidar={enBanco.length === 0}
        textoPendiente={`Coloca todas las tarjetas (${colocadas}/12)`}
        textoValidar="Validar clasificación"
        pistaTexto="Pregúntate: ¿hay uno solo o hay muchos? Si puedes decir “en la Feria hay muchas/muchos ___”, es un molde. Si tiene nombre propio o un número único, es un ejemplo."
        pistaVisible={pistaVisible}
        onPista={() => setPistaVisible(true)}
        onValidar={validar}
        error={error}
      />
    </div>
  );
}
