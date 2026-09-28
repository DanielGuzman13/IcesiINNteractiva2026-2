'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { inject, svgResize, Themes, WorkspaceSvg } from 'blockly';
import Link from 'next/link';
import { backendToolbox } from '@/lib/toolbox/backend-petronio-toolbox';
import {
  defineBackendBlocks,
  buildBackendPlan,
  runBackendPedido,
  INITIAL_INVENTORY,
  type BackendLog,
  type BackendPlan,
  type Inventory,
  type Ingredient
} from '@/lib/blocks/backend-petronio-blocks';

type CasetaScene = 'idle' | 'cooking' | 'served' | 'rejected' | 'smoke';
type ServerState = 'inactive' | 'deployed';
type TransactionState = 'idle' | 'ok' | 'conflict' | 'rollback' | 'no-updates' | 'invalid';

interface LogEntry extends BackendLog {
  id: number;
  time: string;
}

interface Banner {
  text: string;
  tone: 'info' | 'success' | 'error' | 'warn';
}

interface CasetaCanvasProps {
  scene: CasetaScene;
  banner: Banner;
  targetIngredient: string | null;
}

const LOG_TONE_CLASS: Record<BackendLog['tone'], string> = {
  info: 'text-sky-300',
  success: 'text-emerald-400',
  error: 'text-red-400',
  warn: 'text-amber-300'
};

const TX_LABEL: Record<TransactionState, string> = {
  idle: 'En espera de un pedido',
  ok: 'Pedido entregado',
  conflict: 'Pedido rechazado',
  rollback: 'Se revirtió el pedido',
  'no-updates': 'Faltó descontar ingredientes',
  invalid: 'La lógica del pedido no es válida'
};

function responsiveBlocklyScale(): number {
  if (typeof window === 'undefined') return 0.9;
  return window.innerWidth < 1024 ? 0.78 : 0.9;
}

function isSmallViewport(width: number): boolean {
  return width < 1024;
}

function nowTime(): string {
  return new Date().toLocaleTimeString('es-CO', { hour12: false });
}

function BackendPetronioWorkspace({
  nextHref = '/retos',
  onHelp,
  onCompleted
}: {
  nextHref?: string;
  onHelp?: () => void;
  onCompleted?: () => void;
}) {
  const blocklyDivRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<WorkspaceSvg | null>(null);
  const timersRef = useRef<number[]>([]);
  const logIdRef = useRef(1);
  const completedRef = useRef(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const [serverState, setServerState] = useState<ServerState>('inactive');
  const [scene, setScene] = useState<CasetaScene>('idle');
  const [inventory, setInventory] = useState<Inventory>(INITIAL_INVENTORY);
  const inventoryRef = useRef<Inventory>(INITIAL_INVENTORY);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 0, tone: 'info', text: 'La caseta está cerrada: arma el flujo y ábrela para recibir pedidos.', time: '--:--:--' }
  ]);
  const [plan, setPlan] = useState<BackendPlan | null>(null);
  const [txState, setTxState] = useState<TransactionState>('idle');
  const [targetIngredient, setTargetIngredient] = useState<string | null>(null);
  const [tip, setTip] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const appendLogs = useCallback((entries: BackendLog[]) => {
    setLogs((prev) => {
      const next = [
        ...prev,
        ...entries.map((entry) => ({
          ...entry,
          id: logIdRef.current++,
          time: nowTime()
        }))
      ];
      return next.slice(-80);
    });
  }, []);

  const banner: Banner = useMemo<Banner>(() => {
    switch (scene) {
      case 'cooking':
        return { text: 'Preparando pedido en la olla...', tone: 'info' };
      case 'served':
        return { text: '¡Plato servido al comensal!', tone: 'success' };
      case 'rejected':
        return { text: 'Pedido rechazado: no hay ingredientes', tone: 'error' };
      case 'smoke':
        return { text: 'Error: vendiste sin insumos', tone: 'warn' };
      case 'idle':
      default:
        return serverState === 'inactive'
          ? { text: 'La caseta aún no está lista', tone: 'info' }
          : { text: 'La caseta está lista para recibir pedidos', tone: 'info' };
    }
  }, [scene, serverState]);

  useEffect(() => {
    const container = blocklyDivRef.current;
    if (!container || workspaceRef.current) return;

    defineBackendBlocks();

    const ws = inject(container, {
      theme: Themes.Zelos,
      toolbox: backendToolbox,
      grid: { spacing: 24, length: 3, colour: '#ccd4e0', snap: true },
      zoom: {
        controls: true,
        wheel: true,
        startScale: responsiveBlocklyScale(),
        maxScale: 1.3,
        minScale: 0.65,
        scaleSpeed: 1.1,
        pinch: true
      },
      trashcan: false,
      renderer: 'zelos'
    });

    workspaceRef.current = ws;
    const listener = () => {
      if (workspaceRef.current) {
        setPlan(buildBackendPlan(workspaceRef.current));
      }
    };
    ws.addChangeListener(listener);
    setPlan(buildBackendPlan(ws));

    return () => {
      ws.removeChangeListener(listener);
      ws.dispose();
      workspaceRef.current = null;
      clearTimers();
    };
  }, [clearTimers]);

  useEffect(() => {
    const container = blocklyDivRef.current;
    if (!container) return;

    const recompute = () => {
      const ws = workspaceRef.current;
      if (!ws || !container.isConnected) return;
      svgResize(ws);
    };

    const previousSize = { width: window.innerWidth, scale: responsiveBlocklyScale() };
    const resizeWithBreakpoint = () => {
      const ws = workspaceRef.current;
      if (!ws || !container.isConnected) return;
      svgResize(ws);
      const nextScale = responsiveBlocklyScale();
      if (
        isSmallViewport(previousSize.width) !== isSmallViewport(window.innerWidth) ||
        nextScale !== previousSize.scale
      ) {
        previousSize.width = window.innerWidth;
        previousSize.scale = nextScale;
        ws.setScale(nextScale);
        ws.scrollCenter();
      }
    };

    const observer = new ResizeObserver(recompute);
    observer.observe(container);
    window.addEventListener('resize', resizeWithBreakpoint);
    recompute();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resizeWithBreakpoint);
    };
  }, []);

  useEffect(() => {
    const terminal = terminalRef.current;
    if (terminal) terminal.scrollTop = terminal.scrollHeight;
  }, [logs]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const applyInventory = (next: Inventory) => {
    inventoryRef.current = next;
    setInventory(next);
  };

  const runRequest = () => {
    const ws = workspaceRef.current;
    if (!ws) return;

    clearTimers();
    const currentPlan = buildBackendPlan(ws);
    setPlan(currentPlan);

    if (serverState === 'inactive') {
      setServerState('deployed');
      appendLogs([
        { tone: 'info', text: 'La caseta abrió sus puertas: ya puede recibir pedidos.' }
      ]);
    }

    const result = runBackendPedido(ws, inventoryRef.current);
    setTargetIngredient(result.targetIngredient);

    if (result.committed) {
      applyInventory(result.inventory);
    }

    switch (result.kind) {
      case 'no-endpoint':
        setScene('idle');
        setTxState('idle');
        break;
      case 'created':
        setTxState('ok');
        setScene('cooking');
        timersRef.current.push(
          window.setTimeout(() => setScene('served'), 1800),
          window.setTimeout(() => setScene('idle'), 7000)
        );
        if (!completedRef.current) {
          completedRef.current = true;
          setCompleted(true);
          onCompleted?.();
        }
        break;
      case 'conflict':
        setTxState('conflict');
        setScene('rejected');
        timersRef.current.push(window.setTimeout(() => setScene('idle'), 4500));
        break;
      case 'db-error':
        setTxState('rollback');
        setScene('smoke');
        timersRef.current.push(window.setTimeout(() => setScene('idle'), 7000));
        break;
      case 'no-response':
      case 'no-updates':
        setTxState('no-updates');
        setScene('idle');
        break;
      case 'invalid':
        setTxState('invalid');
        setScene('idle');
        if (completedRef.current) {
          completedRef.current = false;
          setCompleted(false);
        }
        break;
      default:
        break;
    }

    setTip(result.tip);
    appendLogs(result.logs);
  };

  const resetCaseta = () => {
    clearTimers();
    applyInventory({ ...INITIAL_INVENTORY });
    setLogs([
      { id: logIdRef.current++, tone: 'info', text: 'La caseta está cerrada: arma el flujo y ábrela para recibir pedidos.', time: nowTime() }
    ]);
    setScene('idle');
    setServerState('inactive');
    setTxState('idle');
    setTip(null);
    setTargetIngredient(null);
  };

  const clearWorkspace = () => {
    workspaceRef.current?.clear();
    if (workspaceRef.current) {
      setPlan(buildBackendPlan(workspaceRef.current));
    }
  };

  const readOnly = scene === 'cooking';

  return (
    <section className="w-full overflow-hidden rounded-3xl bg-white shadow-2xl">
      <header
        className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 text-white"
        style={{ background: 'linear-gradient(90deg, #C63254 0%, #EC6449 100%)' }}
      >
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Ruta de Ingeniería de Software · Festival Petronio Álvarez
          </div>
          <h2 className="mt-1 text-2xl font-extrabold">
            Backend Engineer · Caseta Gastronómica
          </h2>
          <p className="text-sm font-medium text-white/85">
            Construye la lógica de la caseta con bloques y observa la cocina en tiempo real.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {onHelp && (
            <button
              type="button"
              onClick={onHelp}
              className="flex shrink-0 items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/35"
              title="Volver a ver la introducción de la actividad"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M9.2 9a2.8 2.8 0 0 1 5.5.9c0 1.9-2.4 2.2-2.7 4" />
                <circle cx="12" cy="17.2" r="0.6" fill="currentColor" stroke="none" />
              </svg>
              Ayuda
            </button>
          )}
          
          {completed && (
            <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-950">
              Reto Completado
            </span>
          )}
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        <div className="flex min-h-[480px] flex-col border-b border-slate-200 lg:w-1/2 lg:flex-none lg:border-b-0 lg:border-r">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-3">
            <button
              type="button"
              onClick={runRequest}
              disabled={readOnly}
              className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-mid disabled:cursor-not-allowed disabled:opacity-50"
            >
              {serverState === 'inactive' ? 'Abrir la caseta' : 'Recibir un pedido'}
            </button>
            <button
              type="button"
              onClick={resetCaseta}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-brand-support transition-colors hover:bg-slate-100"
            >
              Reiniciar Caseta
            </button>
            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                aria-label="Alejar"
                title="Alejar"
                onClick={() => workspaceRef.current?.zoomCenter(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-base font-bold text-brand-support transition-colors hover:bg-slate-100"
              >
                −
              </button>
              <button
                type="button"
                aria-label="Acercar"
                title="Acercar"
                onClick={() => workspaceRef.current?.zoomCenter(1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-base font-bold text-brand-support transition-colors hover:bg-slate-100"
              >
                +
              </button>
              <button
                type="button"
                aria-label="Vaciar workspace"
                title="Papelera"
                onClick={clearWorkspace}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" />
                </svg>
              </button>
            </div>
          </div>

          <div ref={blocklyDivRef} className="relative h-full w-full min-h-[420px] max-h-[75vh] flex-1 overflow-hidden rounded-xl border" />
        </div>

        <div className="flex flex-col gap-4 p-4 lg:w-1/2 lg:flex-none">
          <div
            className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 p-4 transition-colors ${
              completed ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white'
            }`}
          >
            <div>
              <div className="text-sm font-bold text-brand-support">
                {completed ? '¡Reto Completado!' : 'Completa la caseta con lo que hay en la despensa'}
              </div>

            </div>
            {completed ? (
              <Link
                href={nextHref}
                className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-600"
              >
                Continuar
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-bold text-slate-400"
              >
                Continuar
              </button>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                Simulador · Caseta de la Abuela Paz
              </span>
              <span className="text-xs font-semibold text-white/50">
                {scene === 'idle' && targetIngredient === null
                  ? `Inventario: ${formatInventory(inventory)}`
                  : `Ingrediente: ${targetIngredient ?? '—'} · ${formatInventory(inventory)}`}
              </span>
            </div>
            <CasetaCanvas scene={scene} banner={banner} targetIngredient={targetIngredient} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-support">
                La despensa
              </h3>
              <div className="space-y-2">
                {(['Jaiba', 'Coco', 'Camarón'] as Ingredient[]).map((ingredient) => {
                  const count = inventory[ingredient];
                  const max = 5;
                  return (
                    <div key={ingredient}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-brand-support">{ingredient}</span>
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-xs font-bold ${
                            count === 0
                              ? 'bg-red-100 text-red-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {count} u
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            count === 0 ? 'bg-red-400' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, (count / max) * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5 text-xs">
                <span className="font-semibold uppercase tracking-wide text-slate-500">
                  Último pedido
                </span>
                <span
                  className={`font-bold ${
                    txState === 'ok'
                      ? 'text-emerald-600'
                      : txState === 'conflict'
                        ? 'text-red-600'
                        : txState === 'rollback' || txState === 'invalid'
                          ? 'text-amber-600'
                          : 'text-slate-600'
                  }`}
                >
                  {TX_LABEL[txState]}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-support">
                Pseudocódigo 
              </h3>
              <pre className="h-[168px] overflow-auto rounded-lg bg-slate-950 p-3 font-mono text-[11px] leading-relaxed text-emerald-300">
                {plan?.pseudo ?? '// Tu flujo aparecerá aquí'}
              </pre>
              {plan && plan.issues.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {plan.issues.map((issue) => (
                    <li key={issue} className="flex gap-1.5 text-[11px] text-amber-700">
                      <span aria-hidden="true">▲</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-support">
                Bitácora de la caseta
              </h3>
              <div
                ref={terminalRef}
                className="flex-1 overflow-auto rounded-lg bg-slate-950 p-3 font-mono text-[11px] leading-relaxed"
                style={{ maxHeight: '230px' }}
              >
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-2">
                    <span className="shrink-0 text-slate-500">{log.time}</span>
                    <span className={LOG_TONE_CLASS[log.tone]}>{log.text}</span>
                  </div>
                ))}
              </div>
              {tip && (
                <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-[11px] font-semibold text-amber-800">
                  {tip}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatInventory(inventory: Inventory): string {
  return Object.entries(inventory)
    .map(([name, count]) => `${name} ${count}`)
    .join(' · ');
}

// ---------------------------------------------------------------------------
// Canvas de la caseta
// ---------------------------------------------------------------------------

const CANVAS_W = 640;
const CANVAS_H = 360;

const BANNER_STYLE: Record<Banner['tone'], { bg: string; border: string; text: string }> = {
  info: { bg: 'rgba(30,41,59,0.85)', border: '#64748b', text: '#e2e8f0' },
  success: { bg: 'rgba(5,150,105,0.9)', border: '#10b981', text: '#ecfdf5' },
  error: { bg: 'rgba(225,29,72,0.9)', border: '#f43f5e', text: '#fff1f2' },
  warn: { bg: 'rgba(217,119,6,0.92)', border: '#f59e0b', text: '#fffbeb' }
};

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function CasetaCanvas({ scene, banner, targetIngredient }: CasetaCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<CasetaScene>(scene);
  const bannerRef = useRef<Banner>(banner);
  const targetRef = useRef<string | null>(targetIngredient);
  const sceneStartRef = useRef(0);

  useEffect(() => {
    sceneRef.current = scene;
    sceneStartRef.current = performance.now();
  }, [scene]);

  useEffect(() => {
    bannerRef.current = banner;
  }, [banner]);

  useEffect(() => {
    targetRef.current = targetIngredient;
  }, [targetIngredient]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;

    let raf = 0;
    const loop = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawCaseta(
        ctx,
        now,
        sceneRef.current,
        bannerRef.current,
        targetRef.current,
        sceneStartRef.current
      );
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="block h-auto w-full"
      style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
      aria-label="Simulación visual de la caseta gastronómica del festival Petronio Álvarez"
    />
  );
}

function drawCaseta(
  ctx: CanvasRenderingContext2D,
  now: number,
  scene: CasetaScene,
  banner: Banner,
  targetIngredient: string | null,
  sceneStart: number
) {
  const elapsed = now - sceneStart;
  const t = now;

  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#4aa0e0');
  sky.addColorStop(0.6, '#8ccdf2');
  sky.addColorStop(1, '#dff2ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, CANVAS_W, 300);

  const sunX = 540;
  const sunY = 78;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 6, sunX, sunY, 90);
  sunGlow.addColorStop(0, 'rgba(255,236,150,0.85)');
  sunGlow.addColorStop(1, 'rgba(255,236,150,0)');
  ctx.fillStyle = sunGlow;
  ctx.fillRect(sunX - 90, sunY - 90, 180, 180);
  ctx.fillStyle = '#ffdf70';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.ellipse(150, 118, 62, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(462, 150, 48, 10, 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#8a5236';
  ctx.fillRect(0, 300, CANVAS_W, CANVAS_H - 300);
  ctx.fillStyle = '#6e3f26';
  ctx.fillRect(0, 300, CANVAS_W, 5);

  drawPalapa(ctx);
  drawBanderines(ctx, t);
  drawHandkerchiefs(ctx, t);
  drawPantry(ctx);
  drawStove(ctx, scene, t);
  drawCook(ctx, scene, t);
  drawDiner(ctx, scene);

  if (scene === 'served') {
    drawFlyingDish(ctx, elapsed);
  }
  if (scene === 'rejected') {
    drawAlertCloud(ctx, t);
  }
  if (scene === 'smoke') {
    drawSmoke(ctx, elapsed);
    drawGhostSign(ctx, t);
  }

  drawPotLabel(ctx, targetIngredient, scene);
  drawBanner(ctx, banner);
}

function drawPalapa(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#4a2e1b';
  ctx.fillRect(40, 150, 14, 152);
  ctx.fillRect(586, 150, 14, 152);
  ctx.fillStyle = '#6b4530';
  ctx.fillRect(40, 150, 5, 152);
  ctx.fillRect(591, 150, 5, 152);
  ctx.fillStyle = '#5f3a22';
  ctx.fillRect(36, 162, 24, 7);
  ctx.fillRect(580, 162, 24, 7);

  const peakX = 320;
  const peakY = 40;
  const eaveL = 16;
  const eaveR = 624;
  const eaveY = 178;

  ctx.fillStyle = '#3a2012';
  ctx.fillRect(eaveL, eaveY - 2, eaveR - eaveL, 8);

  const thatch = ctx.createLinearGradient(0, peakY, 0, eaveY + 16);
  thatch.addColorStop(0, '#c98a3d');
  thatch.addColorStop(0.5, '#a0522d');
  thatch.addColorStop(1, '#7c3f1d');
  ctx.fillStyle = thatch;
  ctx.beginPath();
  ctx.moveTo(peakX, peakY);
  ctx.lineTo(eaveR, eaveY);
  ctx.lineTo(eaveR + 12, eaveY + 14);
  ctx.lineTo(eaveL - 12, eaveY + 14);
  ctx.lineTo(eaveL, eaveY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#8b5a2b';
  for (let x = eaveL + 10; x <= eaveR - 20; x += 26) {
    ctx.beginPath();
    ctx.ellipse(x, eaveY + 2, 14, 8, 0, Math.PI, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = 'rgba(85,45,22,0.5)';
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 12; i++) {
    const p = i / 11;
    const yRow = peakY + 12 + p * (eaveY - peakY - 16);
    const half = 30 + p * 300;
    ctx.beginPath();
    ctx.moveTo(peakX - half, yRow);
    ctx.lineTo(peakX + half, yRow + 12);
    ctx.stroke();
  }

  ctx.strokeStyle = '#3a2012';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(peakX - 24, peakY + 10);
  ctx.lineTo(peakX + 24, peakY + 10);
  ctx.stroke();

  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(eaveL - 6, eaveY + 10);
  ctx.lineTo(eaveR + 6, eaveY + 10);
  ctx.stroke();

  ctx.lineWidth = 2.6;
  ctx.strokeStyle = 'rgba(56,30,15,0.6)';
  for (let i = -4; i <= 4; i++) {
    const xTop = peakX + i * 16;
    const yTop = peakY + 8 + Math.abs(i) * 9;
    const side = i < 0 ? -1 : 1;
    const xBottom = peakX + side * (22 + Math.abs(i) * 58);
    ctx.beginPath();
    ctx.moveTo(xTop, yTop);
    ctx.lineTo(xBottom, eaveY + 4);
    ctx.stroke();
  }
}

function drawBanderines(ctx: CanvasRenderingContext2D, t: number) {
  const x0 = 56;
  const x1 = 584;
  const ropeY = 188;
  const colors = ['#ffd23f', '#3aa04f', '#f8f4e4', '#e2743a'];

  ctx.strokeStyle = 'rgba(255,244,214,0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x0, ropeY);
  ctx.quadraticCurveTo(320, ropeY + 18, x1, ropeY);
  ctx.stroke();

  for (let i = 0; i <= 14; i++) {
    const p = i / 14;
    const x = x0 + p * (x1 - x0);
    const y = ropeY + Math.sin(Math.PI * p) * 18;
    const sway = Math.sin(t / 700 + i * 0.8) * 2.5;
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(x - 13, y);
    ctx.lineTo(x + 13, y);
    ctx.lineTo(x + sway, y + 18);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawHandkerchiefs(ctx: CanvasRenderingContext2D, t: number) {
  const xs = [64, 92, 120];
  const hues = ['#fdfaf0', '#f5f0e1', '#fbf7ec'];
  for (let i = 0; i < 3; i++) {
    const wave = Math.sin(t / 700 + i * 1.8) * 5;
    ctx.fillStyle = hues[i];
    ctx.beginPath();
    ctx.moveTo(xs[i] - 9, 178);
    ctx.quadraticCurveTo(xs[i] - 15 + wave, 200, xs[i] - 10, 222);
    ctx.lineTo(xs[i] + 4, 226 + wave);
    ctx.quadraticCurveTo(xs[i] + 14 + wave, 200, xs[i] + 9, 178);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(160,120,70,0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.fillStyle = '#caa05a';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(xs[i], 178, 3.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPantry(ctx: CanvasRenderingContext2D) {
  const bx = 112;
  const by = 296;

  ctx.fillStyle = '#a06a3c';
  ctx.beginPath();
  ctx.moveTo(bx - 22, by);
  ctx.lineTo(bx - 16, by - 26);
  ctx.lineTo(bx + 16, by - 26);
  ctx.lineTo(bx + 22, by);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(80,50,20,0.6)';
  ctx.lineWidth = 1.4;
  for (let i = 1; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(bx - 20 + i * 3, by);
    ctx.lineTo(bx - 14 + i * 3, by - 25);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(bx - 18, by - 13);
  ctx.lineTo(bx + 18, by - 13);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bx - 15, by - 26);
  ctx.lineTo(bx + 15, by - 26);
  ctx.stroke();

  ctx.fillStyle = '#6c9a3f';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.ellipse(bx + (i - 1) * 8, by - 32, 5, 12, i % 2 ? 0.3 : -0.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#4e7a2b';
  ctx.beginPath();
  ctx.ellipse(bx + 2, by - 30, 3, 7, 0.2, 0, Math.PI * 2);
  ctx.fill();

  const cy = 292;
  for (let i = 0; i < 2; i++) {
    const cxx = 146 + i * 18;
    ctx.fillStyle = '#5f3a1f';
    ctx.beginPath();
    ctx.arc(cxx, cy, 9, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f3e9d2';
    ctx.beginPath();
    ctx.arc(cxx, cy, 9, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#45301a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cxx, cy, 9, 0, Math.PI);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(70,40,25,0.8)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cxx - 8, cy + 2);
    ctx.lineTo(cxx + 7, cy + 2);
    ctx.moveTo(cxx - 6, cy + 5);
    ctx.lineTo(cxx + 5, cy + 5);
    ctx.stroke();
  }
}

function drawStove(ctx: CanvasRenderingContext2D, scene: CasetaScene, t: number) {
  const stoveX = 250;
  const stoveY = 296;
  const potX = 330;
  const potY = 250;

  ctx.fillStyle = '#7c4a2d';
  ctx.fillRect(stoveX, stoveY - 6, 160, 16);
  ctx.fillStyle = '#5f3a22';
  ctx.fillRect(stoveX + 6, stoveY - 2, 148, 8);

  ctx.fillStyle = '#e07020';
  for (let i = -1; i <= 1; i++) {
    const fx = potX + i * 12 + Math.sin(t / 110 + i * 2) * 2;
    const height = 12 + Math.sin(t / 120 + i * 3 + 1) * 5;
    ctx.beginPath();
    ctx.moveTo(fx - 7, stoveY - 4);
    ctx.quadraticCurveTo(fx, stoveY - 4 - height, fx + 7, stoveY - 4);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = '#a2471f';
  ctx.beginPath();
  ctx.ellipse(potX, potY, 52, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c25a26';
  ctx.beginPath();
  ctx.ellipse(potX, potY - 4, 48, 21, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#3c1f12';
  ctx.beginPath();
  ctx.ellipse(potX, potY - 10, 44, 16, 0, Math.PI, 0);
  ctx.fill();

  ctx.strokeStyle = '#3c1f12';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(potX - 48, potY - 2, 12, Math.PI * 0.5, Math.PI * 1.4);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(potX + 48, potY - 2, 12, Math.PI * 0.6, Math.PI * 1.5);
  ctx.stroke();

  const cooking = scene === 'cooking';
  const served = scene === 'served';

  if (cooking) {
    ctx.strokeStyle = 'rgba(255,214,140,0.95)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 7; i++) {
      const phase = (t / 260 + i * 0.13) % 1;
      const bx = potX - 34 + phase * 68;
      const by = potY - 4 - phase * 24;
      const r = 2 + phase * 6;
      ctx.globalAlpha = 0.25 + 0.75 * (1 - phase);
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  if (cooking || served) {
    ctx.strokeStyle = 'rgba(226,232,240,0.85)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const phase = (t / 900 + i * 0.3) % 1;
      const sx = potX + Math.sin(t / 500 + i * 2) * 14;
      const sy = potY - 14 - phase * 70;
      ctx.globalAlpha = 0.55 * (1 - phase);
      ctx.beginPath();
      ctx.arc(sx, sy, 7 + 8 * (1 - phase), 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(sx + 8, sy + 6, 5 + 5 * (1 - phase), 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  ctx.save();
  ctx.translate(potX - 26, potY + 2);
  ctx.rotate(-0.45);
  ctx.strokeStyle = '#7b4b27';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(10, -40);
  ctx.stroke();
  ctx.fillStyle = '#a05a2c';
  ctx.beginPath();
  ctx.ellipse(16, -44, 12, 8, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#5f3a22';
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.restore();
}

function drawCook(ctx: CanvasRenderingContext2D, scene: CasetaScene, t: number) {
  const breathing =
    scene === 'idle' ? Math.sin(t / 600) * 1.2 : scene === 'smoke' ? Math.sin(t / 300) * 2 : 0;
  const cx = 200;
  const headY = 168 + breathing * 0.3;
  const footY = 300;

  ctx.strokeStyle = '#2f1d0e';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  if (scene === 'rejected') {
    ctx.beginPath();
    ctx.moveTo(184, 212);
    ctx.lineTo(216, 232);
    ctx.moveTo(216, 212);
    ctx.lineTo(184, 232);
    ctx.stroke();
  } else if (scene === 'cooking') {
    const handX = 262 + Math.sin(t / 220) * 10;
    ctx.beginPath();
    ctx.moveTo(214, 204);
    ctx.lineTo(handX, 226);
    ctx.stroke();
    ctx.strokeStyle = '#cfceb2';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(186, 204);
    ctx.lineTo(180, 244);
    ctx.stroke();
    ctx.strokeStyle = '#7b4b27';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(214, 204);
    ctx.lineTo(handX, 226);
    ctx.stroke();
    ctx.fillStyle = '#a05a2c';
    ctx.beginPath();
    ctx.ellipse(handX + 12, 230, 10, 7, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#5f3a22';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else if (scene === 'smoke') {
    ctx.beginPath();
    ctx.moveTo(186, 206);
    ctx.lineTo(194, 172);
    ctx.moveTo(214, 206);
    ctx.lineTo(210, 244);
    ctx.stroke();
  } else if (scene === 'served') {
    const wave = Math.sin(t / 200) * 6;
    ctx.beginPath();
    ctx.moveTo(186, 206);
    ctx.lineTo(168, 160 + wave);
    ctx.moveTo(214, 206);
    ctx.lineTo(232, 158 - wave);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(186, 206);
    ctx.lineTo(180, 242);
    ctx.moveTo(214, 206);
    ctx.lineTo(222, 242);
    ctx.stroke();
  }

  ctx.fillStyle = '#3f3152';
  ctx.beginPath();
  ctx.moveTo(178, footY);
  ctx.lineTo(176, 242);
  ctx.lineTo(224, 242);
  ctx.lineTo(222, footY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#7d5a8f';
  ctx.beginPath();
  ctx.moveTo(182, footY);
  ctx.lineTo(180, 250);
  ctx.lineTo(220, 250);
  ctx.lineTo(218, footY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#3f3152';
  ctx.beginPath();
  ctx.moveTo(182, 206);
  ctx.lineTo(200, 194);
  ctx.lineTo(218, 206);
  ctx.lineTo(222, 244);
  ctx.lineTo(178, 244);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fdfcf6';
  ctx.beginPath();
  ctx.moveTo(184, 206);
  ctx.lineTo(198, 197);
  ctx.lineTo(202, 197);
  ctx.lineTo(216, 206);
  ctx.lineTo(219, 252);
  ctx.lineTo(181, 252);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(120,85,55,0.35)';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.fillStyle = 'rgba(180,140,90,0.28)';
  ctx.fillRect(196, 226, 12, 11);
  ctx.strokeStyle = '#fdfcf6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(183, 206);
  ctx.lineTo(176, 214);
  ctx.moveTo(217, 206);
  ctx.lineTo(226, 214);
  ctx.stroke();

  ctx.strokeStyle = '#2f1d0e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.rect(186, 145, 28, 26);
  ctx.stroke();

  ctx.fillStyle = '#e9c46a';
  ctx.beginPath();
  ctx.arc(cx, headY + 4, 17, 0, Math.PI * 2);
  ctx.fill();

  const turban = ctx.createLinearGradient(cx - 24, headY - 26, cx + 24, headY + 2);
  turban.addColorStop(0, '#e2723f');
  turban.addColorStop(0.5, '#c0392b');
  turban.addColorStop(1, '#8e2f1d');
  ctx.fillStyle = turban;
  ctx.beginPath();
  ctx.ellipse(cx, headY - 9, 19, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(96,24,12,0.55)';
  ctx.lineWidth = 1.6;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.ellipse(cx + i * 5, headY - 9, 17, 9.5, 0, Math.PI * 0.12, Math.PI * 0.88);
    ctx.stroke();
  }
  ctx.fillStyle = '#e2723f';
  ctx.beginPath();
  ctx.ellipse(cx, headY - 20, 6, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#2f1d0e';
  ctx.beginPath();
  ctx.arc(cx - 6, headY + 3, 1.8, 0, Math.PI * 2);
  ctx.arc(cx + 6, headY + 3, 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#2f1d0e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (scene === 'rejected') {
    ctx.moveTo(cx - 10, headY - 6);
    ctx.lineTo(cx - 2, headY - 3);
    ctx.moveTo(cx + 10, headY - 6);
    ctx.lineTo(cx + 2, headY - 3);
    ctx.stroke();
  } else if (scene === 'smoke') {
    ctx.moveTo(cx - 12, headY - 5);
    ctx.lineTo(cx - 2, headY - 1);
    ctx.moveTo(cx + 12, headY - 5);
    ctx.lineTo(cx + 2, headY - 1);
    ctx.stroke();
  } else {
    ctx.arc(cx, headY - 4, 8, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }

  ctx.beginPath();
  if (scene === 'served') {
    ctx.arc(cx, headY + 8, 6, 0, Math.PI);
  } else if (scene === 'rejected' || scene === 'smoke') {
    ctx.arc(cx, headY + 12, 6, Math.PI, Math.PI * 2);
    ctx.fillStyle = '#3f2d19';
    ctx.fill();
  } else {
    ctx.moveTo(cx - 5, headY + 9);
    ctx.lineTo(cx + 5, headY + 9);
  }
  ctx.stroke();
}

function drawDiner(ctx: CanvasRenderingContext2D, scene: CasetaScene) {
  const counterX = 468;
  const counterY = 252;
  const headX = 545;
  const headY = 228;

  ctx.fillStyle = '#6f4a2e';
  ctx.fillRect(counterX, counterY, 152, 48);
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(counterX, counterY, 152, 6);
  ctx.fillStyle = '#805a2d';
  ctx.fillRect(counterX + 4, counterY + 20, 144, 22);

  ctx.fillStyle = '#27597e';
  ctx.fillRect(headX - 26, 254, 52, 46);

  ctx.strokeStyle = '#27597e';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(headX + 12, 256);
  ctx.lineTo(headX + 30, 268);
  ctx.stroke();
  ctx.fillStyle = '#e9b98a';
  ctx.beginPath();
  ctx.arc(headX + 32, 270, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#e9b98a';
  ctx.beginPath();
  ctx.arc(headX, headY, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#241409';
  ctx.beginPath();
  ctx.arc(headX + 6, headY - 12, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#2f1d0e';
  ctx.beginPath();
  ctx.arc(headX - 5, headY, 1.8, 0, Math.PI * 2);
  ctx.arc(headX + 5, headY, 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#2f1d0e';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  if (scene === 'served') {
    ctx.arc(headX, headY + 6, 5, 0.15, Math.PI - 0.15);
  } else {
    ctx.moveTo(headX - 4, headY + 7);
    ctx.lineTo(headX + 4, headY + 7);
  }
  ctx.stroke();

  if (scene === 'served') {
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath();
    ctx.arc(headX + 14, headY - 14, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(headX + 19, headY - 9, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawFlyingDish(ctx: CanvasRenderingContext2D, elapsed: number) {
  const progress = (elapsed / 1400) % 1;
  const x = 330 + (545 - 330) * progress;
  const y = 226 - Math.sin(progress * Math.PI) * 40;

  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.ellipse(x, y, 16, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.fillStyle = '#c25a26';
  ctx.beginPath();
  ctx.arc(x, y - 2, 6, 0, Math.PI * 2);
  ctx.fill();
}

function drawAlertCloud(ctx: CanvasRenderingContext2D, t: number) {
  const pulse = 0.75 + 0.25 * Math.sin(t / 150);
  ctx.globalAlpha = 0.35 + 0.25 * pulse;
  ctx.fillStyle = '#ef4444';
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const dx = Math.cos(angle) * 16;
    const dy = Math.sin(angle) * 9;
    ctx.beginPath();
    ctx.arc(206 + dx, 92 + dy, 18, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(206, 90, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('!', 206, 92);
}

function drawSmoke(ctx: CanvasRenderingContext2D, elapsed: number) {
  ctx.fillStyle = 'rgba(60,60,66,0.75)';
  for (let i = 0; i < 8; i++) {
    const phase = (elapsed / 1500 + i * 0.14) % 1;
    const x = 330 + Math.sin(phase * Math.PI * 2 + i) * 20;
    const y = 220 - phase * 150;
    const r = 10 + phase * 26;
    ctx.globalAlpha = 0.7 * (1 - phase);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawGhostSign(ctx: CanvasRenderingContext2D, t: number) {
  ctx.save();
  ctx.translate(320, 118);
  ctx.rotate(Math.sin(t / 500) * 0.02);
  roundRect(ctx, -170, -34, 340, 68, 10);
  ctx.fillStyle = '#9f1239';
  ctx.fill();
  ctx.strokeStyle = '#be123c';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#fffbe9';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⚠️ Venta fantasma detectada', 0, -12);
  ctx.font = '13px sans-serif';
  ctx.fillText('Vendiste sin insumos', 0, 10);
  ctx.restore();
}

function drawPotLabel(
  ctx: CanvasRenderingContext2D,
  targetIngredient: string | null,
  scene: CasetaScene
) {
  if (!targetIngredient || scene === 'smoke') return;
  ctx.fillStyle = 'rgba(255,253,245,0.92)';
  roundRect(ctx, 358, 192, 104, 22, 8);
  ctx.fill();
  ctx.strokeStyle = 'rgba(180,150,90,0.8)';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.fillStyle = '#6b4a2f';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`Plato: ${targetIngredient}`, 410, 203);
}

function drawBanner(ctx: CanvasRenderingContext2D, banner: Banner) {
  const style = BANNER_STYLE[banner.tone];
  ctx.font = 'bold 13px sans-serif';
  const width = Math.min(380, ctx.measureText(banner.text).width + 28);
  roundRect(ctx, 16, 16, width, 34, 10);
  ctx.fillStyle = style.bg;
  ctx.fill();
  ctx.strokeStyle = style.border;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = style.text;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(banner.text, 30, 33.5);
}

export default BackendPetronioWorkspace;