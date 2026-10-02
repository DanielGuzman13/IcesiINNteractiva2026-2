/**
 * Roles del equipo de ingeniería de software que el estudiante conoce en la
 * pantalla final (/equipo), después de completar toda la ruta.
 *
 * Imágenes: `imagen` apunta al personaje de cada rol. Para usar una versión
 * "caleñizada" (editada con vestuario o elementos de su evento), basta con
 * guardar la nueva imagen en public/personajes/calenos/ y cambiar esta ruta.
 *
 * En `frase`, las expresiones caleñas van entre asteriscos (*pailas*) para que
 * se resalten con su significado del diccionario caleñol (src/lib/calenol.ts).
 */

export type TemaEvento = "salsa" | "feria" | "petronio" | "carrera";

export interface RolEquipo {
  id: string;
  titulo: string;
  /** Otro nombre con el que se conoce el rol en la industria. */
  tambien?: string;
  imagen: string;
  anchoImagen: number;
  altoImagen: number;
  tema: TemaEvento;
  evento: string;
  escudo: string;
  foto: { src: string; alt: string; ancho: number; alto: number };
  etapa: string;
  queHace: string;
  tareas: string[];
  enLaRuta: string;
  frase: string;
}

export const ROLES_EQUIPO: RolEquipo[] = [
  {
    id: "analista",
    titulo: "Analista de Requerimientos",
    tambien: "Product Owner",
    imagen: "/personajes/analista-nuevo.webp",
    anchoImagen: 1365,
    altoImagen: 1489,
    tema: "salsa",
    evento: "Mundial de Salsa",
    escudo: "/mapa/mundialSalsa.png",
    foto: {
      src: "/media/eventos/mundial-salsa-pareja.jpg",
      alt: "Pareja de bailarines de salsa en competencia",
      ancho: 812,
      alto: 531,
    },
    etapa: "Requisitos",
    queHace:
      "Es quien entiende el problema antes de que exista la solución. Habla con las personas que van a usar el software, descubre qué necesitan de verdad y lo convierte en requerimientos claros para todo el equipo.",
    tareas: [
      "Entrevista a usuarios y clientes para entender sus necesidades.",
      "Escribe historias de usuario: Dado que… cuando… entonces…",
      "Decide qué es más importante construir primero.",
    ],
    enLaRuta:
      "En el Mundial de Salsa armaste historias de usuario para la votación del público, la boletería y el jurado.",
    frase: "Si no entendemos bien el problema, *pailas* con la solución, ¿*oís*?",
  },
  {
    id: "arquitecto",
    titulo: "Arquitecto de Software",
    imagen: "/personajes/arqui-nuevo.webp",
    anchoImagen: 1680,
    altoImagen: 1446,
    tema: "feria",
    evento: "Feria de Cali",
    escudo: "/mapa/feria.png",
    foto: {
      src: "/media/eventos/feria-cali-salsodromo.jpg",
      alt: "Desfile nocturno del Salsódromo en la Feria de Cali",
      ancho: 1280,
      alto: 990,
    },
    etapa: "Diseño",
    queHace:
      "Diseña la estructura del sistema antes de programarlo: qué partes tendrá, qué información guarda cada una y cómo se conectan. Su plano guía el trabajo de todo el equipo.",
    tareas: [
      "Identifica las clases y los componentes del sistema.",
      "Dibuja diagramas, como el diagrama de clases, para explicar el diseño.",
      "Elige tecnologías y patrones para que el sistema crezca sin volverse un enredo.",
    ],
    enLaRuta:
      "En la Feria de Cali diseñaste el plano de la app oficial: moldes, características y conexiones.",
    frase: "Un buen diseño evita que el sistema termine hecho un *sancocho*.",
  },
  {
    id: "backend",
    titulo: "Desarrolladora Backend",
    imagen: "/personajes/front-nuevo.webp",
    anchoImagen: 1218,
    altoImagen: 1488,
    tema: "petronio",
    evento: "Petronio Álvarez",
    escudo: "/mapa/petronio.png",
    foto: {
      src: "/media/eventos/petronio-cocina.jpg",
      alt: "Cocineras sirviendo platos típicos del Pacífico en el Festival Petronio Álvarez",
      ancho: 1280,
      alto: 720,
    },
    etapa: "Desarrollo",
    queHace:
      "Programa la lógica que funciona detrás de escena: las reglas del negocio, los datos y los servicios que responden cada vez que alguien usa la app.",
    tareas: [
      "Programa las reglas del negocio y los servicios (APIs).",
      "Guarda y protege la información en bases de datos.",
      "Hace que la app responda rápido aunque la usen miles de personas.",
    ],
    enLaRuta:
      "En el Petronio Álvarez programaste con bloques la lógica de pedidos de una caseta de comida del Pacífico.",
    frase: "Si algo se *totea* por dentro, ¡me toca a mí!",
  },
  {
    id: "frontend",
    titulo: "Desarrolladora Frontend",
    imagen: "/personajes/back-nuevo.webp",
    anchoImagen: 1200,
    altoImagen: 1486,
    tema: "petronio",
    evento: "Petronio Álvarez",
    escudo: "/mapa/petronio.png",
    foto: {
      src: "/media/eventos/petronio-tarima.jpg",
      alt: "Agrupación tocando marimba en la tarima del Festival Petronio Álvarez",
      ancho: 1280,
      alto: 720,
    },
    etapa: "Desarrollo",
    queHace:
      "Construye todo lo que ves y tocas en una app o página web: pantallas, botones, colores y textos. Su meta es que usarla sea fácil y agradable para cualquier persona.",
    tareas: [
      "Convierte los diseños en pantallas que funcionan.",
      "Cuida la usabilidad y la accesibilidad: contraste, tamaños e íconos claros.",
      "Conecta la interfaz con los servicios del backend.",
    ],
    enLaRuta:
      "En el Petronio Álvarez tomaste decisiones de diseño para que la app de marimba y chirimía fuera clara y fácil de usar.",
    frase: "Si la app es confusa, es un *desparche*: la gente la cierra y no vuelve.",
  },
  {
    id: "qa",
    titulo: "QA y Ciberseguridad",
    tambien: "Aseguramiento de la calidad",
    imagen: "/personajes/qa-nuevo.webp",
    anchoImagen: 1405,
    altoImagen: 1458,
    tema: "carrera",
    evento: "Carrera del Pacífico",
    escudo: "/mapa/carrera10k.png",
    foto: {
      src: "/media/eventos/carrera-pacifico.jpg",
      alt: "Corredora de la Carrera del Pacífico pasando junto a una chirimía",
      ancho: 513,
      alto: 314,
    },
    etapa: "Pruebas y seguridad",
    queHace:
      "QA prueba el software para encontrar errores antes que los usuarios. Ciberseguridad protege los sistemas y los datos de las personas frente a ataques.",
    tareas: [
      "Diseña y ejecuta pruebas para encontrar errores.",
      "Reporta los fallos para que el equipo los corrija a tiempo.",
      "Detecta ataques, cifra la información y recupera los servicios caídos.",
    ],
    enLaRuta:
      "En la Carrera del Pacífico encontraste los errores del formulario de inscripción y restauraste el servidor atacado.",
    frase: "*Ojo pues*: yo veo lo que otros no ven.",
  },
];
