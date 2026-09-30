import type { Metadata } from "next";
import EquipoRoles from "@/components/equipo/EquipoRoles";

export const metadata: Metadata = {
  title: "El equipo | Icesi INNteractiva",
};

export default function EquipoPage() {
  return <EquipoRoles />;
}
