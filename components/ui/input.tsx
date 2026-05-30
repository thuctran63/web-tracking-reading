import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, leftIcon, rightSlot, invalid, ...rest },
  ref,
) {
  return (
    <div
      className={cn(
        "flex h-10 w-full items-center gap-2 rounded-xl border bg-white px-3 transition-all focus-within:ring-2",
        invalid
          ? "border-rose-300 focus-within:border-rose-400 focus-within:ring-rose-100"
          : "border-slate-300 focus-within:border-indigo-400 focus-within:ring-indigo-100",
        className,
      )}
    >
      {leftIcon ? (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center text-slate-400">
          {leftIcon}
        </span>
      ) : null}
      <input
        ref={ref}
        className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:outline-none"
        {...rest}
      />
      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
    </div>
  );
});
