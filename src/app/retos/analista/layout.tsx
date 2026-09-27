import type { ReactNode } from "react";
import StageGate from "@/components/retos/StageGate";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <StageGate stage={1} rol="analista">
      {children}
    </StageGate>
  );
}
