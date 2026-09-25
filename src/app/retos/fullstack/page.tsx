'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Workspace } from 'blockly';
import FutbolEditor from '@/components/FutbolEditor';
import { JugadaValidator, ValidationMode } from '@/lib/validation/jugada-validator';
import { loadPlayer } from '@/lib/player';
import { SoccerBall } from '@/components/game/icons';

const TIMER_SECONDS = 10 * 60;

interface ValidationResult {
  isValid: boolean;
  messages: string[];
  pseudocode: string;
}

const POINTS_PER_LOGIC: Record<ValidationMode, number> = {
  logica_disparo: 100,
  logica_ciclo: 100,
};

interface FutbolScoreState {
  logica_disparo?: number;
  logica_ciclo?: number;
  total?: number;
}

const getCurrentPlayer = (): string => {
  if (typeof window === 'undefined') return 'guest';
  return loadPlayer()?.name?.trim() || 'guest';
};

export default function FullstackRetoPage() {
  const router = useRouter();
  const [validationMode, setValidationMode] = useState<ValidationMode>('logica_disparo');
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: false,
    messages: [],
    pseudocode: '// Tu jugada aparecerá aquí'
  });
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_SECONDS);
  const [puntos, setPuntos] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const raw = window.localStorage.getItem(
        `${getCurrentPlayer()}_futbol_scores`
      );
      if (!raw) return 0;
      const prev = JSON.parse(raw) as FutbolScoreState;
      return prev.total ?? 0;
    } catch {
      return 0;
    }
  });
  const workspaceRef = useRef<Workspace | null>(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(intervalId);
          router.replace('/retos');
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [router]);

  const formattedMinutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const formattedSeconds = String(timeLeft % 60).padStart(2, '0');

  const handleWorkspaceChange = useCallback((workspace: Workspace) => {
    workspaceRef.current = workspace;
  }, []);

  const asignarPuntosSiAplica = (mode: ValidationMode) => {
    if (typeof window === 'undefined') {
      return { assigned: false, points: 0, alreadyAwarded: false };
    }

    const currentPlayer = getCurrentPlayer();
    const storageKey = `${currentPlayer}_futbol_scores`;

    let prev: FutbolScoreState = {};
    try {
      prev = JSON.parse(localStorage.getItem(storageKey) || '{}') as FutbolScoreState;
    } catch {
      prev = {};
    }

    const alreadyAwarded = (prev[mode] ?? 0) > 0;
    if (alreadyAwarded) {
      return { assigned: false, points: 0, alreadyAwarded: true };
    }

    const points = POINTS_PER_LOGIC[mode];
    const next: FutbolScoreState = {
      ...prev,
      [mode]: points,
      total: (prev.total ?? 0) + points,
    };

    localStorage.setItem(storageKey, JSON.stringify(next));

    setPuntos((actual) => actual + points);

    return { assigned: true, points, alreadyAwarded: false };
  };

  const validarJugada = () => {
    if (workspaceRef.current) {
      try {
        const validator = new JugadaValidator(workspaceRef.current);
        const result = validator.validarJugada(validationMode);

        if (result.isValid) {
          const award = asignarPuntosSiAplica(validationMode);

          if (award.assigned) {
            setValidationResult({
              ...result,
              messages: [
                ...result.messages,
                `¡Excelente! Has completado ${validationMode === 'logica_disparo' ? 'la Lógica 1' : 'la Lógica 2'}.`,
              ],
            });
            return;
          }

          if (award.alreadyAwarded) {
            setValidationResult({
              ...result,
              messages: [...result.messages, 'Esta lógica ya otorgó puntos anteriormente para tu jugador.'],
            });
            return;
          }
        }

        setValidationResult(result);
      } catch (error) {
        console.error('Error validando la jugada:', error);
        setValidationResult({
          isValid: false,
          messages: ['Error al validar la jugada'],
          pseudocode: '// Error en la validación',
        });
      }
    }
  };

  const limpiarWorkspace = () => {
    if (workspaceRef.current) {
      workspaceRef.current.clear();
      setValidationResult({
        isValid: false,
        messages: [],
        pseudocode: '// Tu jugada aparecerá aquí',
      });
    }
  };

  const getMessageColor = (isValid: boolean) => {
    return isValid ? 'text-green-600' : 'text-red-600';
  };

  const getBorderColor = (isValid: boolean) => {
    return isValid ? 'border-green-500' : 'border-red-500';
  };

  const getChallengeStatement = (mode: ValidationMode) => {
    if (mode === 'logica_ciclo') {
      return 'Lógica 2 – Construye una jugada de contraataque que avance 20 metros en tramos de 5 metros usando un bloque de repetición de 4 veces. En cada repetición, evalúa si hay defensa cerca para decidir entre pasar o seguir avanzando. Al finalizar el ciclo, cierra la jugada con una decisión por distancia al arco: si es menor a 20, dispara; si no, pasa el balón. La secuencia debe comenzar con INICIO y terminar con FIN.';
    }

    return 'Lógica 1 – Construye una jugada ofensiva que comience en INICIO y termine en FIN. Primero, evalúa si hay defensa cerca para decidir la acción inicial: si hay defensa, pasa el balón; si no hay defensa, avanza. Luego, toma una decisión final según la distancia al arco: si la distancia es menor a 20, debes disparar; si no, debes mantener la jugada con un pase. Organiza la secuencia con bloques SI/SINO de forma clara y en el orden correcto.';
  };

  const puntajeObtenido = { total: puntos };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-br from-brand-primary via-brand-support to-brand-mid px-4 py-8">
      <div className="mb-6 flex w-full max-w-7xl items-center justify-between">
        <Link
          href="/retos"
          className="flex items-center gap-1 text-sm font-semibold text-white/80 transition-colors hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver a los retos
        </Link>
      </div>

      <div className="w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl 2xl:max-w-[1400px]">
        <div
          className="px-8 py-6 text-white"
          style={{ background: "linear-gradient(90deg, #45609B 0%, #719FC1 100%)" }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white/20 text-3xl shadow-inner">
              <SoccerBall className="h-8 w-8" />
            </div>
            <div>
              <div className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-white/80">
                Rol del equipo
              </div>
              <h1 className="text-3xl font-extrabold">Fullstack</h1>
              <div className="text-sm font-medium text-white/80">
                Desarrollador Backend · Jugadas de Fútbol con Google Blockly
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-xs text-white/80">Score actual</div>
              <div className="text-2xl font-black">
                {(puntajeObtenido.total ?? 0)} pts
              </div>
            </div>
            <div className="rounded-xl border-2 border-white/50 bg-white/15 px-4 py-2 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/90">
                Tiempo restante
              </p>
              <p className="text-2xl font-bold tabular-nums">
                {formattedMinutes}:{formattedSeconds}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4 md:p-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-brand-soft bg-white shadow-sm lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-soft/50 p-4">
              <h2 className="text-xl font-semibold text-brand-support">
                Editor Visual
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={validationMode}
                  onChange={(event) => setValidationMode(event.target.value as ValidationMode)}
                  className="rounded-lg border border-brand-soft bg-white px-3 py-2 text-sm text-brand-support"
                >
                  <option value="logica_disparo">Lógica 1: Disparo por distancia</option>
                  <option value="logica_ciclo">Lógica 2: Contraataque con ciclo</option>
                </select>
                <button
                  type="button"
                  onClick={validarJugada}
                  className="rounded-lg bg-brand-primary px-4 py-2 font-medium text-white transition-colors hover:bg-brand-mid"
                >
                  Validar Jugada
                </button>
                <button
                  type="button"
                  onClick={limpiarWorkspace}
                  className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
                >
                  Limpiar
                </button>
              </div>
            </div>

            <div className="border-b border-brand-soft/50 bg-brand-light/30 p-4">
              <h3 className="mb-2 text-base font-semibold text-brand-primary">
                Enunciado de la lógica seleccionada
              </h3>
              <p className="text-sm leading-relaxed text-brand-support">
                {getChallengeStatement(validationMode)}
              </p>
            </div>

            <div className="p-4">
              <FutbolEditor onWorkspaceChange={handleWorkspaceChange} />
            </div>
          </div>

          <div className="space-y-4 lg:col-span-1">
            <div
              className={`rounded-2xl border-2 bg-white p-4 shadow-sm ${getBorderColor(validationResult.isValid)}`}
            >
              <h2 className="mb-3 text-xl font-semibold text-brand-support">
                Resultados
              </h2>
              {validationResult.messages.length > 0 ? (
                <div className="space-y-2">
                  {validationResult.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-2 text-sm ${getMessageColor(validationResult.isValid)} ${
                        validationResult.isValid ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      {message}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-brand-support/70">
                  Valida tu jugada para ver los resultados aquí
                </p>
              )}
              {validationResult.isValid && (
                <div className="mt-4 rounded-xl border-2 border-brand-primary bg-brand-soft/20 p-4">
                  <h3 className="mb-2 flex items-center gap-2 font-bold text-brand-primary">
                    <SoccerBall className="h-5 w-5" />
                    ¡Jugada Completada!
                  </h3>
                  <p className="mb-4 text-sm text-brand-support">
                    La lógica es perfecta y la jugada llega al borde del área rival.
                    El árbitro pita el final del primer tiempo. El siguiente paso es
                    el vestuario, donde el Arquitecto ajustará la estructura.
                  </p>
                  <Link
                    href="/retos/arquitecto"
                    className="block rounded-xl bg-brand-primary py-2 px-4 text-center font-bold text-white transition-colors hover:bg-brand-mid"
                  >
                    Continuar al Vestuario →
                  </Link>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-gray-900 p-4 shadow-sm">
              <h2 className="mb-3 text-xl font-semibold text-white">
                Pseudocódigo
              </h2>
              <pre className="h-48 overflow-auto font-mono text-sm text-green-400">
                {validationResult.pseudocode}
              </pre>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="rounded-2xl border border-brand-soft bg-white p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-brand-support">
              Cómo jugar
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold text-brand-support">
                  Bloques Disponibles:
                </h3>
                <ul className="space-y-1 text-sm text-brand-support/80">
                  <li>
                    <span className="inline-block rounded-md bg-orange-100 px-2 py-1 text-base font-bold text-orange-800">
                      Control:
                    </span>{' '}
                    INICIO, FIN, SI, SINO, REPETIR 4 VECES
                  </li>
                  <li>
                    <span className="inline-block rounded-md bg-green-100 px-2 py-1 text-base font-bold text-green-800">
                      Condiciones:
                    </span>{' '}
                    hay defensa cerca, distancia al arco &lt; 20
                  </li>
                  <li>
                    <span className="inline-block rounded-md bg-blue-100 px-2 py-1 text-base font-bold text-blue-800">
                      Acciones:
                    </span>{' '}
                    avanzar, pasar balón, disparar
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-brand-support">Reglas:</h3>
                <ul className="space-y-1 text-sm text-brand-support/80">
                  <li>• Máximo 6 bloques de acción</li>
                  <li>• Debe incluir un bloque &quot;disparar&quot;</li>
                  {validationMode === 'logica_ciclo' ? (
                    <>
                      <li>• Debes usar &quot;REPETIR 4 VECES&quot; para representar 20 metros en tramos de 5</li>
                      <li>• Dentro del ciclo, evalúa &quot;hay defensa cerca&quot; con SI/SINO</li>
                      <li>• Cierra la jugada con: SI distancia al arco &lt; 20 → disparar, SINO → pasar balón</li>
                    </>
                  ) : (
                    <>
                      <li>• Evalúa la distancia al arco antes de disparar</li>
                      <li>• Si usas &quot;hay defensa cerca&quot;, debes manejarla con SI/SINO</li>
                      <li>• No es obligatorio usar el ciclo en este modo</li>
                    </>
                  )}
                  <li>• Usa estructuras SI/SINO de forma ordenada (máximo 3)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}