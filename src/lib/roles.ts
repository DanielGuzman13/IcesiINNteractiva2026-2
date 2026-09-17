export type RoleSlug =
  | "arquitecto"
  | "qa-ciberseguridad"
  | "fullstack"
  | "analista";

export interface Role {
  slug: RoleSlug;
  title: string;
  shortTitle: string;
  description: string;
  icon: "blueprint" | "shield" | "code" | "chart";
  accent: string;
}

export const ROLES: Role[] = [
  {
    slug: "arquitecto",
    title: "Arquitecto",
    shortTitle: "Arquitecto",
    description:
      "Diseña la solución: define la estructura, los componentes y la experiencia del reto.",
    icon: "blueprint",
    accent: "#719FC1",
  },
  {
    slug: "qa-ciberseguridad",
    title: "QA / Ciberseguridad",
    shortTitle: "QA / Ciberseguridad",
    description:
      "Asegura la calidad y la seguridad: valida escenarios, prueba y protege cada detalle.",
    icon: "shield",
    accent: "#6E7FA2",
  },
  {
    slug: "fullstack",
    title: "Fullstack",
    shortTitle: "Fullstack",
    description:
      "Lleva el reto a código: construye la interfaz y el backend de principio a fin.",
    icon: "code",
    accent: "#45609B",
  },
  {
    slug: "analista",
    title: "Analista",
    shortTitle: "Analista",
    description:
      "Interpreta datos y estrategia: modela la información y guía las decisiones del equipo.",
    icon: "chart",
    accent: "#91A4BC",
  },
];

export function getRoleBySlug(slug: string): Role | undefined {
  return ROLES.find((role) => role.slug === slug);
}