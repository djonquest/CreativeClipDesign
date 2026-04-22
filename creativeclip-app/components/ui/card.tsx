import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-xl shadow-slate-950/30 backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}
