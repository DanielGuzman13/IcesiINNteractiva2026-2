import type { ReactNode } from "react";
import StageGate from "@/components/retos/StageGate";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <StageGate stage={4} rol="ciberseguridad">
      {children}
    </StageGate>
  );
}
