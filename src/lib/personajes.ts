/**
 * Personajes guía de la Ruta de Ingeniería de Software.
 *
 * Cada actividad tiene un personaje que:
 *  1. pide la contraseña de la parada en el mapa,
 *  2. presenta su rol y el reto al empezar (intro),
 *  3. felicita y explica por qué su rol es importante al terminar (cierre).
 *
 * En los textos, {nombre} se reemplaza por el nombre del estudiante, y las
 * expresiones caleñas van entre asteriscos (*ve*, *pailas*…) para que se
 * resalten con su significado del diccionario caleñol (src/lib/calenol.ts).
 */

export type RolActividad =
  | "analista"
  | "arquitecto"
  | "backend"
  | "frontend"
  | "qa"
  | "ciberseguridad";

export interface Personaje {
  /** Cómo se presenta el personaje en la etiqueta del globo. */
  titulo: string;
  /** Cómo se nombra a sí mismo: "¡Hola! Soy {presentacion}". */
  presentacion: string;
  imagen: string;
  intro: string[];
  cierre: string[];
  /** Texto del botón con el que termina la intro. */
  botonIntro: string;
  /** A dónde lleva el personaje al terminar la actividad. */
  destinoCierre: string;
  /** Texto del botón con el que termina el cierre. */
  botonCierre: string;
}

export const PERSONAJES: Record<RolActividad, Personaje> = {
  analista: {
    titulo: "Analista de Requerimientos",
    presentacion: "la Analista de Requerimientos",
    imagen: "/personajes/analista.webp",
    intro: [
      "¡*Háblame ve*, {nombre}! ¿Cómo va todo? Soy la Analista de Requerimientos. En los equipos también me dicen Product Owner.",
      "Mi trabajo es entender la lógica del negocio: escucho a la gente, averiguo qué necesita de verdad y lo escribo tan clarito que todo el equipo sabe qué construir.",
      "*Mirá ve*: estamos en el Mundial de Salsa, porque aquí se baila la mejor salsa del mundo, ¡*vojabés*! El público quiere votar en vivo, comprar boletas y ver los puntajes del jurado desde el celular. Tu reto es armar un requerimiento sin enredos, separando lo importante de lo que sobra. ¿Le hacemos? ¡*De una*!",
    ],
    cierre: [
      "¡*Vea pues*, {nombre}! Encontraste la condición, la acción y el resultado, y dejaste por fuera lo que no tenía nada que ver.",
      "Eso evita que el equipo construya algo que nadie pidió. Un requerimiento clarito ahorra semanas de trabajo y muchos dolores de cabeza, ¿*oís*?",
      "Yo soy la primera pieza del ciclo de vida del software: si no entendemos bien el problema, *pailas* con la solución. ¡Me *encarreta* hacer preguntas y conectar a la gente con la tecnología! Volvamos al mapa, *pues*.",
    ],
    botonIntro: "¡A analizar!",
    destinoCierre: "/retos",
    botonCierre: "Volver al mapa",
  },
  arquitecto: {
    titulo: "Arquitecto de Software",
    presentacion: "el Arquitecto de Software",
    imagen: "/personajes/arquitecto.webp",
    intro: [
      "¡*Quiubo*, {nombre}! Soy el Arquitecto de Software.",
      "*Mirá*: así como un arquitecto dibuja el plano antes de levantar un edificio, yo diseño la estructura de un programa antes de que alguien escriba una sola línea de código.",
      "La Alcaldía quiere la app oficial de la Feria de Cali: boletas, desfiles, orquestas y escuelas de salsa. *Haceme el 14* y diseñamos juntos el plano de esa app, ¡que quede *bien bacano*!",
    ],
    cierre: [
      "¡*Eso, ve*, {nombre}! Separaste los moldes de los ejemplos, les diste características y los conectaste entre sí.",
      "Con ese plano, el equipo sabe qué construir y cómo encajan las piezas. Un buen diseño evita que el sistema termine hecho un *sancocho* difícil de arreglar.",
      "Soy importante en el ciclo de vida del software porque pienso en el sistema completo antes de construirlo. ¡Me *encarreta* ordenar ideas, encontrar patrones y tomar decisiones que duran años!",
    ],
    botonIntro: "¡A diseñar!",
    destinoCierre: "/retos",
    botonCierre: "Volver al mapa",
  },
  backend: {
    titulo: "Desarrolladora Backend",
    presentacion: "la Desarrolladora Backend",
    imagen: "/personajes/backend.webp",
    intro: [
      "¡*Oís*, {nombre}, qué bueno verte! Soy la Desarrolladora Backend.",
      "Yo trabajo detrás de escena: programo la lógica, las reglas y los datos que hacen funcionar una app, aunque nadie los vea. Si algo se *totea* por dentro, ¡me toca a mí!",
      "En el Petronio Álvarez, una caseta de comida del Pacífico necesita saber si puede preparar cada pedido con lo que queda en la despensa. *Pilas*, que vamos a programar esa lógica con bloques.",
    ],
    cierre: [
      "¡Pedido servido, {nombre}! Tu lógica revisó los ingredientes, descontó lo usado y le respondió al visitante. ¡Quedó *sabroso*!",
      "Eso es el backend: reglas claras que cuidan los datos. Imaginate prometer una cazuela de mariscos y entregar la *chuspa* vacía: ¡*qué oso*!",
      "Soy clave en el ciclo de vida del software porque convierto el diseño en código que funciona de verdad. ¡Me *encarreta* resolver problemas paso a paso! *Vamos pues* donde mi compañera de Frontend, que te está esperando.",
    ],
    botonIntro: "¡A programar!",
    destinoCierre: "/retos/frontend",
    botonCierre: "Ir a Frontend",
  },
  frontend: {
    titulo: "Desarrolladora Frontend",
    presentacion: "la Desarrolladora Frontend",
    imagen: "/personajes/frontend.webp",
    intro: [
      "¡*Quiubo*, {nombre}! Soy la Desarrolladora Frontend.",
      "Yo construyo lo que ves y tocás en una app: pantallas, botones, colores y textos. Mi misión es que usarla sea facilito y *bacano* para cualquier persona.",
      "La app “Sonoridades del Pacífico” del Petronio Álvarez tiene problemas: botones confusos y letras que no se leen con este *solazo* de Cali. ¿Me ayudás a tomar las mejores decisiones de diseño?",
    ],
    cierre: [
      "¡Quedó una *mera app*, {nombre}! Tus decisiones la hicieron más clara, legible y fácil de usar.",
      "Una app puede funcionar perfecto por dentro, pero si es confusa y aburrida es un *desparche*: la gente la cierra y no vuelve. Por eso el diseño de la interfaz importa tanto como el código.",
      "Soy el puente entre el código y las personas dentro del ciclo de vida del software. ¡Me *encarreta* mezclar la creatividad del arte con la lógica de la programación! Volvamos al mapa, *pues*.",
    ],
    botonIntro: "¡A diseñar la interfaz!",
    destinoCierre: "/retos",
    botonCierre: "Volver al mapa",
  },
  qa: {
    titulo: "QA y Ciberseguridad",
    presentacion: "el especialista en QA y Ciberseguridad",
    imagen: "/personajes/qa.webp",
    intro: [
      "Hola, {nombre}. Soy el especialista en QA y Ciberseguridad. ¿Te asustó la máscara? Tranqui, es parte del oficio.",
      "QA significa aseguramiento de la calidad: busco los errores antes de que los encuentren los usuarios. Y también protejo los sistemas de los que quieren atacarlos. *Ojo pues*.",
      "La Carrera del Pacífico abrió inscripciones, pero el formulario tiene errores escondidos. *Pilas*: ponelo a prueba y encontralos todos.",
    ],
    cierre: [
      "¡Qué buen ojo, {nombre}! Encontraste los errores escondidos del formulario.",
      "Cada error que se detecta antes de lanzar una app le ahorra problemas a miles de corredores que se van a inscribir.",
      "Pero *mirá ve*, esto no termina aquí: alguien atacó el servidor de resultados de la carrera. Ahora nos toca defenderlo, ¿*vajaír* conmigo?",
    ],
    botonIntro: "¡A buscar errores!",
    destinoCierre: "/retos/ciberseguridad",
    botonCierre: "Ir a Ciberseguridad",
  },
  ciberseguridad: {
    titulo: "QA y Ciberseguridad",
    presentacion: "el especialista en QA y Ciberseguridad",
    imagen: "/personajes/qa.webp",
    intro: [
      "¡*Uy, pailas*, {nombre}! Un atacante bloqueó el servidor de resultados de la Carrera del Pacífico con un código cifrado.",
      "En ciberseguridad pensamos como los atacantes para defender mejor los sistemas. Un código cifrado es un mensaje escondido: si entendés la regla, lo podés leer.",
      "Descifrá la clave y restaurá el servidor para que los corredores vean sus tiempos oficiales. ¡*Dale, que vos podés*!",
    ],
    cierre: [
      "¡Servidor restaurado, {nombre}! Descifraste la clave y recuperaste los resultados oficiales. ¡*Eso, ve*!",
      "La seguridad protege los datos y la confianza de la gente que usa la tecnología. Sin ella, cualquiera podría cambiar los resultados de una carrera.",
      "Soy importante en el ciclo de vida del software porque cuido la calidad y la seguridad hasta el final. ¡Me *encarretan* los acertijos y ver lo que otros no ven! Con esto completaste toda la ruta: ahora sí, date un *borondo* por el mapa y celebrá. ¡Cali nos une!",
    ],
    botonIntro: "¡A defender el servidor!",
    destinoCierre: "/retos",
    botonCierre: "Volver al mapa",
  },
};

/** Personaje que pide la contraseña de cada parada del mapa. */
export const PERSONAJE_POR_PARADA: Record<number, RolActividad> = {
  1: "analista",
  2: "arquitecto",
  3: "backend",
  4: "qa",
};

export function textoConNombre(texto: string, nombre: string | null | undefined): string {
  const limpio = nombre?.trim();
  if (limpio) return texto.split("{nombre}").join(limpio);
  // Sin nombre: "¡Hola, {nombre}!" -> "¡Hola!"
  return texto.replace(/,\s*\{nombre\}/g, "").split("{nombre}").join("");
}

/* ------------------------------------------------------------------ */
/* Qué escenas ya vio el estudiante en esta sesión                      */
/* ------------------------------------------------------------------ */

export const PERSONAJES_VISTOS_KEY = "icesi-personajes-vistos";

type Escena = "intro" | "cierre";

function leerVistos(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PERSONAJES_VISTOS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function escenaVista(rol: RolActividad, escena: Escena): boolean {
  return leerVistos().includes(`${rol}:${escena}`);
}

export function marcarEscenaVista(rol: RolActividad, escena: Escena): void {
  if (typeof window === "undefined") return;
  const clave = `${rol}:${escena}`;
  const vistos = leerVistos();
  if (vistos.includes(clave)) return;
  try {
    window.localStorage.setItem(PERSONAJES_VISTOS_KEY, JSON.stringify([...vistos, clave]));
  } catch {
    return;
  }
}

export function resetPersonajesVistos(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PERSONAJES_VISTOS_KEY);
  } catch {
    return;
  }
}

/* ------------------------------------------------------------------ */
/* Aviso de "actividad terminada" para mostrar el cierre del personaje  */
/* ------------------------------------------------------------------ */

export const EVENTO_CIERRE = "icesi-cierre-personaje";

/**
 * Llamar cuando el estudiante termina con éxito una actividad.
 * El personaje aparece después de `retrasoMs` para dejar ver primero el resultado.
 */
export function anunciarCierrePersonaje(rol: RolActividad, retrasoMs = 1200): void {
  if (typeof window === "undefined") return;
  window.setTimeout(() => {
    window.dispatchEvent(new CustomEvent<RolActividad>(EVENTO_CIERRE, { detail: rol }));
  }, retrasoMs);
}

export function continuarConCierre(rol: RolActividad, navegar: (href: string) => void): void {
  if (escenaVista(rol, "cierre")) {
    navegar(PERSONAJES[rol].destinoCierre);
    return;
  }
  anunciarCierrePersonaje(rol, 0);
}
