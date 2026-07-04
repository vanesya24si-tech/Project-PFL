import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

export function Switch({ checked, onCheckedChange, label }) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer select-none">
      <span className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">{label}</span>
      <SwitchPrimitive.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-slate-300 bg-slate-200 transition-colors duration-200 data-[state=checked]:bg-sky-600"
      >
        <SwitchPrimitive.Thumb className="block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 data-[state=checked]:translate-x-5" />
      </SwitchPrimitive.Root>
    </label>
  );
}
