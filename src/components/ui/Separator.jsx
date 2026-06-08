import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

export function Separator({ decorative = true, className = "" }) {
  return (
    <SeparatorPrimitive.Root decorative={decorative} className={`h-px bg-slate-200 ${className}`} />
  );
}
