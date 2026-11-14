"use client";

import { useRef, type ReactNode } from "react";
import { useReveal } from "../hooks/use-reveal";

export function SalonShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return (
    <div className="salon" ref={ref}>
      {children}
    </div>
  );
}
