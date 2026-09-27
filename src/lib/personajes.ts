/**
 * Personajes guía de la Ruta de Ingeniería de Software.
 *
 * Cada actividad tiene un personaje que:
 *  1. pide la contraseña de la parada en el mapa,
 *  2. presenta su rol y el reto al empezar (intro),
 *  3. felicita y explica por qué su rol es importante al terminar (cierre).
 *
 * En los textos, {nombre} se reemplaza por el nombre del estudiante.
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
}

export const PERSONAJES: Record<RolActividad, Personaje> = {
  analista: {
    titulo: "Analista de Requerimientos",
    presentacion: "la Analista de Requerimientos",
    imagen: "/personajes/analista.webp",
    intro: [
      "¡Hola, {nombre}! Soy la Analista de Requerimientos. En los equipos también me llaman Product Owner.",
      "Mi trabajo es entender la lógica del negocio: escucho a las personas, descubro qué necesitan de verdad y lo escribo tan claro que todo el equipo sabe qué construir.",
      "Estamos en el Mundial de Salsa de Cali. El público quiere votar en vivo, comprar boletas y ver los puntajes del jurado desde el celular. Tu reto: armar un requerimiento sin confusiones, separando lo importante de lo que sobra.",
    ],
    cierre: [
      "¡Muy bien, {nombre}! Encontraste la condición, la acción y el resultado, y dejaste por fuera lo que no tenía nada que ver.",
      "Eso evita que el equipo construya algo que nadie pidió. Un requerimiento claro ahorra semanas de trabajo y muchos dolores de cabeza.",
      "Soy la primera pieza del ciclo de vida del software: si no entendemos bien el problema, no hay buena solución. ¡Me encanta hacer preguntas y conectar a las personas con la tecnología!",
    ],
    botonIntro: "¡A analizar!",
  },
  arquitecto: {
    titulo: "Arquitecto de Software",
    presentacion: "el Arquitecto de Software",
    imagen: "/personajes/arquitecto.webp",
    intro: [
      "¡Hola, {nombre}! Soy el Arquitecto de Software.",
      "Así como un arquitecto dibuja el plano antes de levantar un edificio, yo diseño la estructura de un programa antes de que alguien escriba una sola línea de código.",
      "La Alcaldía quiere la app oficial de la Feria de Cali: boletas, desfiles, orquestas y escuelas de salsa. Vamos a diseñar juntos el plano de esa app.",
    ],
    cierre: [
      "¡Excelente, {nombre}! Separaste los moldes de los ejemplos, les diste características y los conectaste entre sí.",
      "Con ese plano, el equipo de desarrollo sabe qué construir y cómo encajan las piezas. Un buen diseño evita que el sistema se vuelva un enredo difícil de arreglar.",
      "Soy importante en el ciclo de vida del software porque pienso en el sistema completo antes de construirlo. ¡Me gusta ordenar ideas, encontrar patrones y tomar decisiones que duran años!",
    ],
    botonIntro: "¡A diseñar!",
  },
  backend: {
    titulo: "Desarrolladora Backend",
    presentacion: "la Desarrolladora Backend",
    imagen: "/personajes/backend.webp",
    intro: [
      "¡Hola, {nombre}! Soy la Desarrolladora Backend.",
      "Trabajo detrás de escena: programo la lógica, las reglas y los datos que hacen funcionar una app, aunque nadie los vea. Si algo falla por dentro, ¡me toca a mí!",
      "En el Festival Petronio Álvarez, una caseta de comida del Pacífico necesita saber si puede preparar cada pedido con lo que queda en la despensa. Vamos a programar esa lógica con bloques.",
    ],
    cierre: [
      "¡Pedido servido, {nombre}! Tu lógica revisó los ingredientes, descontó lo usado y le respondió al visitante.",
      "Eso es el backend: reglas claras que cuidan los datos y evitan, por ejemplo, vender un plato cuando ya no hay ingredientes.",
      "Soy clave en el ciclo de vida del software porque convierto el diseño en código que funciona de verdad. ¡Me encanta resolver problemas paso a paso! Ahora mi compañera de Frontend te espera.",
    ],
    botonIntro: "¡A programar!",
  },
  frontend: {
    titulo: "Desarrolladora Frontend",
    presentacion: "la Desarrolladora Frontend",
    imagen: "/personajes/frontend.webp",
    intro: [
      "¡Hola, {nombre}! Soy la Desarrolladora Frontend.",
      "Yo construyo lo que ves y tocas en una app: pantallas, botones, colores y textos. Mi misión es que usarla sea fácil y agradable para cualquier persona.",
      "La app “Sonoridades del Pacífico” del Festival Petronio Álvarez tiene problemas: botones confusos y textos que no se leen bajo el sol de Cali. Ayúdame a tomar las mejores decisiones de diseño.",
    ],
    cierre: [
      "¡Muy bien, {nombre}! Tus decisiones hicieron la app más clara, legible y fácil de usar.",
      "Una app puede funcionar perfecto por dentro, pero si la gente no entiende cómo usarla, no sirve. Por eso el diseño de la interfaz es tan importante como el código.",
      "Soy el puente entre el código y las personas dentro del ciclo de vida del software. ¡Me encanta mezclar la creatividad del arte con la lógica de la programación!",
    ],
    botonIntro: "¡A diseñar la interfaz!",
  },
  qa: {
    titulo: "QA y Ciberseguridad",
    presentacion: "el especialista en QA y Ciberseguridad",
    imagen: "/personajes/qa.webp",
    intro: [
      "Hola, {nombre}. Soy el especialista en QA y Ciberseguridad.",
      "QA significa aseguramiento de la calidad: busco los errores antes de que los encuentren los usuarios. Y también protejo los sistemas de quienes quieren atacarlos.",
      "La Carrera del Pacífico abrió inscripciones, pero el formulario tiene errores escondidos. Tu reto: ponerlo a prueba y encontrarlos todos.",
    ],
    cierre: [
      "¡Buen trabajo de detective, {nombre}! Encontraste los errores escondidos del formulario.",
      "Cada error que se detecta antes de lanzar una app le evita problemas a miles de corredores que se van a inscribir.",
      "Pero esto no termina aquí: alguien atacó el servidor de resultados de la carrera. ¡Sígueme, que ahora nos toca defenderlo!",
    ],
    botonIntro: "¡A buscar errores!",
  },
  ciberseguridad: {
    titulo: "QA y Ciberseguridad",
    presentacion: "el especialista en QA y Ciberseguridad",
    imagen: "/personajes/qa.webp",
    intro: [
      "¡Alerta, {nombre}! Un atacante bloqueó el servidor de resultados de la Carrera del Pacífico con un código cifrado.",
      "En ciberseguridad pensamos como los atacantes para defender mejor los sistemas. Un código cifrado es un mensaje escondido: si entiendes la regla, puedes leerlo.",
      "Descifra la clave y restaura el servidor para que los corredores puedan ver sus tiempos oficiales.",
    ],
    cierre: [
      "¡Servidor restaurado, {nombre}! Descifraste la clave y recuperaste los resultados oficiales.",
      "La seguridad protege los datos y la confianza de las personas que usan la tecnología. Sin ella, cualquiera podría cambiar los resultados de una carrera.",
      "Soy importante en el ciclo de vida del software porque cuido la calidad y la seguridad hasta el final. ¡Me gusta resolver acertijos y ver lo que otros no ven! Con esto completaste toda la ruta de la ingeniería de software.",
    ],
    botonIntro: "¡A defender el servidor!",
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
