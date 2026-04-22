"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement>;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-200",
        className,
      )}
      {...props}
    />
  );
}
