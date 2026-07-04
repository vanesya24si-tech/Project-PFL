import * as React from "react";

export function Separator({ className = "" }) {
  return <hr className={`border-slate-200 border-t ${className}`} />;
}
