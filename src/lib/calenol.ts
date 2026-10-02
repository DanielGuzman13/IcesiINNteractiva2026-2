/**
 * Diccionario caleñol - "Cali nos une"
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
  "oís": "Forma rápida de llamar la atención de alguien, o de confirmar que te está escuchando. «¡Oís!, pasame la chuspa».",
  "mirá ve": "Expresión insignia de Cali para llamar la atención antes de hablar. «¡Mirá ve! ¿Sí sabías que mañana hay fiesta?»",
  "vojabés": "«Vos sabés», dicho rapidito. Complicidad u orgullo, o dar algo por sentado. «Aquí se baila la mejor salsa del mundo, ¡vojabés!»",
  "háblame ve": "Saludo muy popular entre amigos. «¡Epa! Háblame ve, ¿cómo va todo?»",
  borondo: "Dar una vuelta, un paseo corto o salir a parchar. «Vamos a dar un borondo por el río Cali».",
  chuspa: "Bolsa de plástico o de papel. «Meté el pan en la chuspa para que no se ponga duro».",
  desparche: "Estar aburrido o no tener ningún plan. «Qué desparche tan bravo, inventemos algo».",
  "vea pues": "Sorpresa, asombro o admiración. «¿Te ascendieron? ¡Vea pues, felicitaciones!»",
  "haceme el 14": "«Hazme el favor». Hacer un 14 (o un cruce) es hacerle un favor a alguien. «Haceme el 14 de prestarme la bici».",
  "vajaír": "«¿Vas a ir?», dicho ultra rápido. «Hoy hay rumba, ¿vajaír o te vas a quedar?»",
  pailas: "Mala suerte, algo salió mal o ya no tiene arreglo.",
  "uy, pailas": "¡Uy, qué mala suerte! Algo salió mal.",
  "de una": "¡Claro! De inmediato, sin pensarlo dos veces.",
  quiubo: "Saludo: viene de «¿qué hubo?». Como decir «¿qué más?, ¿cómo vas?».",
  bacano: "Algo muy bueno, agradable o chévere.",
  "bien bacano": "Muy bueno, muy chévere.",
  "uy, qué nota": "¡Qué bien! Expresión de alegría o admiración.",
  sancocho: "Plato típico del Valle del Cauca. También se dice de algo revuelto o desordenado.",
  encarretado: "Estar encarretado es estar muy entusiasmado, apasionado o concentrado en algo. «Estoy encarretado con la salsa».",
  encarretada: "Estar encarretada es estar muy entusiasmada, apasionada o concentrada en algo. «Estoy encarretada con este proyecto».",
  totea: "De «totear»: reventarse o dañarse de golpe. «Se toteó el globo».",
  pilas: "¡Atento! Ponerse alerta.",
  "qué oso": "¡Qué vergüenza!",
  sabroso: "En Cali, algo que quedó muy bien o se disfruta mucho, no solo la comida.",
  solazo: "Un sol muy fuerte, como el de Cali al mediodía.",
  "re mela": "«Melo» o «mela» es algo excelente, chévere o de muy buena calidad, y «re» lo refuerza. «Esa canción está re mela».",
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
