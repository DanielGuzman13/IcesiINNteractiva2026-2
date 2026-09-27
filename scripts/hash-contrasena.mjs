// Genera la huella SHA-256 de una contraseña para src/lib/stage-access.ts
// Uso: node scripts/hash-contrasena.mjs NUEVACLAVE-123
import { createHash } from "node:crypto";

const entrada = process.argv.slice(2).join(" ");
if (!entrada) {
  console.error("Uso: node scripts/hash-contrasena.mjs NUEVACLAVE-123");
  process.exit(1);
}

// Misma normalización que la app: mayúsculas, sin espacios, guiones ni símbolos.
const normalizada = entrada.toUpperCase().replace(/[^A-Z0-9Ñ]/g, "");
console.log(`Contraseña normalizada: ${normalizada}`);
console.log(`Huella: ${createHash("sha256").update(normalizada).digest("hex")}`);
