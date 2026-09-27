/**
 * Diccionario caleñol · "Cali nos une"
 *
 * Expresiones caleñas que usan los personajes. En los textos de
 * src/lib/personajes.ts se marcan entre asteriscos: "¡*Ve*, Valeria!".
 * La palabra marcada se resalta y, al pasar el mouse o tocarla, muestra
 * su significado. Si una palabra marcada no está aquí, solo se resalta.
 *
 * Para agregar una expresión: escríbela en minúsculas y sin signos
 * (¡ ! ¿ ?) como clave.
 */
export const DICCIONARIO_CALENOL: Record<string, string> = {
  ve: "Expresión caleña para llamar la atención o darle fuerza a lo que se dice. «¡Ve, qué bueno verte!»",
  "eso, ve": "¡Muy bien! Una felicitación bien caleña.",
  mirá: "«Mira», con el voseo caleño: en Cali se trata de «vos». «Mirá, vení, tené».",
  "vení": "«Ven», con el voseo típico de Cali.",
  "oís": "«¿Oyes?» o «¿me entiendes?». Se usa para confirmar que el otro está pendiente.",
  pailas: "Mala suerte, algo salió mal o ya no tiene arreglo.",
  "uy, pailas": "¡Uy, qué mala suerte! Algo salió mal.",
  "de una": "¡Claro! De inmediato, sin pensarlo dos veces.",
  quiubo: "Saludo: viene de «¿qué hubo?». Como decir «¿qué más?, ¿cómo vas?».",
  bacano: "Algo muy bueno, agradable o chévere.",
  "bien bacano": "Muy bueno, muy chévere.",
  "uy, qué nota": "¡Qué bien! Expresión de alegría o admiración.",
  sancocho: "Plato típico del Valle del Cauca. También se dice de algo revuelto o desordenado.",
  encarreta: "De «encarretar»: gustar mucho, engancharse con algo. «Me encarreta la salsa».",
  encarretan: "De «encarretar»: gustar mucho, engancharse con algo. «Me encarretan los acertijos».",
  totea: "De «totear»: reventarse o dañarse de golpe. «Se toteó el globo».",
  pilas: "¡Atento! Ponerse alerta.",
  "qué oso": "¡Qué vergüenza!",
  sabroso: "En Cali, algo que quedó muy bien o se disfruta mucho, no solo la comida.",
  solazo: "Un sol muy fuerte, como el de Cali al mediodía.",
  "mera app": "En Cali, «mero» o «mera» es «tremendo» o «muy grande». «¡Mera app!» es una app tremenda.",
  "ojo pues": "¡Cuidado! ¡Presta atención!",
  "vamos pues": "«Pues» al final de la frase es una muletilla muy caleña: «vamos pues», «hágale pues».",
  pues: "Muletilla muy caleña al final de la frase: «volvamos al mapa, pues».",
  dale: "¡Adelante, hazlo!",
  "dale, que vos podés": "¡Adelante, que tú puedes!, con el voseo caleño.",
};

export function normalizarExpresion(texto: string): string {
  return texto
    .toLowerCase()
    .replace(/[¡!¿?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function significadoCalenol(expresion: string): string | undefined {
  return DICCIONARIO_CALENOL[normalizarExpresion(expresion)];
}
