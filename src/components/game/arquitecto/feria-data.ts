// Contenido de la actividad del Arquitecto de Software - Feria de Cali.
// Está pensado para estudiantes de grado 10° y 11° sin conocimientos previos:
// primero se usa lenguaje cotidiano (molde, ejemplo, característica, conexión)
// y al terminar cada nivel se revela el término técnico (clase, objeto,
// atributo, relación).

export type MoldeId =
  | "orquesta"
  | "bailarin"
  | "boleta"
  | "desfile"
  | "escuela"
  | "asistente";

export interface Molde {
  id: MoldeId;
  nombre: string;
  /** Nombre como lo escribiría un ingeniero en el diagrama de clases. */
  nombreTecnico: string;
  /** Atributos que se muestran en el plano final. */
  atributos: string[];
}

export const MOLDES: Record<MoldeId, Molde> = {
  orquesta: {
    id: "orquesta",
    nombre: "Orquesta",
    nombreTecnico: "Orquesta",
    atributos: ["generoMusical", "numeroDeMusicos", "anioDeFundacion"],
  },
  bailarin: {
    id: "bailarin",
    nombre: "Bailarín",
    nombreTecnico: "Bailarin",
    atributos: ["edad", "aniosDeExperiencia", "tallaDeVestuario"],
  },
  boleta: {
    id: "boleta",
    nombre: "Boleta",
    nombreTecnico: "Boleta",
    atributos: ["precio", "localidad", "codigoQR"],
  },
  desfile: {
    id: "desfile",
    nombre: "Desfile",
    nombreTecnico: "Desfile",
    atributos: ["recorrido", "horaDeInicio", "numeroDeComparsas"],
  },
  escuela: {
    id: "escuela",
    nombre: "Escuela de salsa",
    nombreTecnico: "EscuelaDeSalsa",
    atributos: ["nombre", "barrio", "numeroDeBailarines"],
  },
  asistente: {
    id: "asistente",
    nombre: "Asistente",
    nombreTecnico: "Asistente",
    atributos: ["nombre", "documento", "edad"],
  },
};

/* ------------------------------------------------------------------ */
/* Nivel 1 - ¿Molde o ejemplo?                                          */
/* ------------------------------------------------------------------ */

export type TipoTarjeta = "molde" | "ejemplo";

export interface TarjetaNivel1 {
  id: string;
  texto: string;
  tipo: TipoTarjeta;
  explicacion: string;
}

export const TARJETAS_NIVEL1: TarjetaNivel1[] = [
  {
    id: "m-orquesta",
    texto: "Orquesta",
    tipo: "molde",
    explicacion: "En la Feria tocan muchas orquestas: es el molde que las agrupa a todas.",
  },
  {
    id: "m-bailarin",
    texto: "Bailarín",
    tipo: "molde",
    explicacion: "Hay cientos de bailarines: “Bailarín” describe a cualquiera de ellos.",
  },
  {
    id: "m-boleta",
    texto: "Boleta",
    tipo: "molde",
    explicacion: "Se venden miles de boletas: es el tipo de cosa, no una en particular.",
  },
  {
    id: "m-desfile",
    texto: "Desfile",
    tipo: "molde",
    explicacion: "La Feria tiene varios desfiles: “Desfile” es el molde de todos ellos.",
  },
  {
    id: "m-escuela",
    texto: "Escuela de salsa",
    tipo: "molde",
    explicacion: "En Cali hay muchas escuelas de salsa: es un molde.",
  },
  {
    id: "m-asistente",
    texto: "Asistente",
    tipo: "molde",
    explicacion: "Cualquier persona que va a la Feria es un asistente: es un molde.",
  },
  {
    id: "e-niche",
    texto: "Grupo Niche",
    tipo: "ejemplo",
    explicacion: "Es UNA orquesta real y con nombre propio: un ejemplo del molde Orquesta.",
  },
  {
    id: "e-salsodromo",
    texto: "El Salsódromo",
    tipo: "ejemplo",
    explicacion: "Es un desfile concreto de la Feria: un ejemplo del molde Desfile.",
  },
  {
    id: "e-swing",
    texto: "Swing Latino",
    tipo: "ejemplo",
    explicacion: "Es una escuela de salsa específica: un ejemplo del molde Escuela de salsa.",
  },
  {
    id: "e-valentina",
    texto: "Valentina, bailarina de 16 años",
    tipo: "ejemplo",
    explicacion: "Es una persona en particular: un ejemplo del molde Bailarín.",
  },
  {
    id: "e-boleta",
    texto: "La boleta #0457 de palco",
    tipo: "ejemplo",
    explicacion: "Tiene un número único: es un ejemplo del molde Boleta.",
  },
  {
    id: "e-carlos",
    texto: "Carlos, que fue al Superconcierto",
    tipo: "ejemplo",
    explicacion: "Es una persona concreta que asistió: un ejemplo del molde Asistente.",
  },
];

/* ------------------------------------------------------------------ */
/* Nivel 2 - ¿Qué lo describe?                                          */
/* ------------------------------------------------------------------ */

export const MOLDES_NIVEL2: MoldeId[] = ["orquesta", "bailarin", "boleta", "desfile"];

export interface Caracteristica {
  id: string;
  texto: string;
  /** Molde al que pertenece, o null si es un distractor. */
  molde: MoldeId | null;
  explicacion: string;
}

export const CARACTERISTICAS: Caracteristica[] = [
  {
    id: "c-genero",
    texto: "Género musical",
    molde: "orquesta",
    explicacion: "El género musical describe a una Orquesta (salsa, pachanga, bugalú…).",
  },
  {
    id: "c-musicos",
    texto: "Número de músicos",
    molde: "orquesta",
    explicacion: "Cada Orquesta tiene su número de músicos.",
  },
  {
    id: "c-fundacion",
    texto: "Año de fundación",
    molde: "orquesta",
    explicacion: "El año de fundación describe a una Orquesta: Grupo Niche se fundó en 1980.",
  },
  {
    id: "c-edad",
    texto: "Edad",
    molde: "bailarin",
    explicacion: "La edad describe a una persona, en este caso al Bailarín.",
  },
  {
    id: "c-experiencia",
    texto: "Años de experiencia",
    molde: "bailarin",
    explicacion: "Los años bailando describen a un Bailarín.",
  },
  {
    id: "c-talla",
    texto: "Talla del vestuario",
    molde: "bailarin",
    explicacion: "Cada Bailarín necesita un vestuario de su talla.",
  },
  {
    id: "c-precio",
    texto: "Precio",
    molde: "boleta",
    explicacion: "El precio describe a la Boleta: la de palco cuesta más que la de gradería.",
  },
  {
    id: "c-localidad",
    texto: "Localidad (palco, gradería…)",
    molde: "boleta",
    explicacion: "La localidad dice en qué zona te sientas: describe a la Boleta.",
  },
  {
    id: "c-qr",
    texto: "Código QR",
    molde: "boleta",
    explicacion: "El código QR permite validar la Boleta en la entrada.",
  },
  {
    id: "c-recorrido",
    texto: "Recorrido",
    molde: "desfile",
    explicacion: "El recorrido (por dónde pasa) describe a un Desfile.",
  },
  {
    id: "c-hora",
    texto: "Hora de inicio",
    molde: "desfile",
    explicacion: "La hora de inicio describe cuándo arranca el Desfile.",
  },
  {
    id: "c-comparsas",
    texto: "Número de comparsas",
    molde: "desfile",
    explicacion: "Las comparsas son los grupos que desfilan: describen al Desfile.",
  },
  {
    id: "d-niche",
    texto: "Grupo Niche",
    molde: null,
    explicacion: "Grupo Niche es un ejemplo de Orquesta, no una característica. ¡Déjalo en el banco!",
  },
  {
    id: "d-salsa",
    texto: "Salsa",
    molde: null,
    explicacion: "“Salsa” es un valor, no una característica: la característica es “Género musical”.",
  },
  {
    id: "d-aplausos",
    texto: "Muchos aplausos",
    molde: null,
    explicacion: "Los aplausos no son un dato fijo que describa a ninguno de estos moldes.",
  },
];

/* ------------------------------------------------------------------ */
/* Nivel 3 - ¿Cómo se conectan?                                         */
/* ------------------------------------------------------------------ */

export interface Verbo {
  id: string;
  texto: string;
}

export const VERBOS: Verbo[] = [
  { id: "v-formada", texto: "está formada por" },
  { id: "v-toca", texto: "toca en" },
  { id: "v-participa", texto: "participa en" },
  { id: "v-permite", texto: "permite ver" },
  { id: "v-compra", texto: "compra" },
  { id: "v-come", texto: "se come" },
  { id: "v-vuela", texto: "vuela sobre" },
];

export interface Conexion {
  id: string;
  desde: MoldeId;
  hacia: MoldeId;
  verboCorrecto: string;
  pista: string;
}

export const CONEXIONES: Conexion[] = [
  {
    id: "r-escuela-bailarin",
    desde: "escuela",
    hacia: "bailarin",
    verboCorrecto: "v-formada",
    pista: "¿De qué está hecha una Escuela de salsa?",
  },
  {
    id: "r-orquesta-desfile",
    desde: "orquesta",
    hacia: "desfile",
    verboCorrecto: "v-toca",
    pista: "¿Qué hace una Orquesta sobre una carroza del Desfile?",
  },
  {
    id: "r-bailarin-desfile",
    desde: "bailarin",
    hacia: "desfile",
    verboCorrecto: "v-participa",
    pista: "¿Qué hace un Bailarín en el Salsódromo?",
  },
  {
    id: "r-boleta-desfile",
    desde: "boleta",
    hacia: "desfile",
    verboCorrecto: "v-permite",
    pista: "¿Para qué sirve la Boleta de gradería en un Desfile?",
  },
  {
    id: "r-asistente-boleta",
    desde: "asistente",
    hacia: "boleta",
    verboCorrecto: "v-compra",
    pista: "¿Qué hace un Asistente para conseguir una Boleta?",
  },
];

export function verboPorId(id: string): Verbo | undefined {
  return VERBOS.find((verbo) => verbo.id === id);
}
