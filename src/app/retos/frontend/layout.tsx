import type { ReactNode } from "react";
import StageGate from "@/components/retos/StageGate";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <StageGate stage={3} rol="frontend">
      {children}
    </StageGate>
  );
}
