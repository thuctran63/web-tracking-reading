import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

import { cn } from "@/lib/cn";

type Tone = "indigo" | "emerald" | "sky" | "amber" | "rose" | "slate";

const tones: Record<Tone, { iconBg: string; iconColor: string; ring: string }> = {
  indigo: {
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    ring: "ring-indigo-100",
  },
  emerald: {
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    ring: "ring-emerald-100",
  },
  sky: {
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    ring: "ring-sky-100",
  },
  amber: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    ring: "ring-amber-100",
  },
  rose: {
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    ring: "ring-rose-100",
  },
  slate: {
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    ring: "ring-slate-100",
  },
};

type StatCardProps = {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  tone?: Tone;
  hint?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "indigo",
  hint,
  footer,
  className,
}: StatCardProps) {
  const t = tones[tone];
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-1.5 text-2xl font-semibold text-slate-900 tabular-nums">
            {value}
          </p>
          {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
        </div>
        <span
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1",
            t.iconBg,
            t.iconColor,
            t.ring,
          )}
          aria-hidden
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {footer ? <div className="mt-3">{footer}</div> : null}
    </div>
  );
}
