import { TextareaHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, invalid, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "block w-full resize-y rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-shadow focus:outline-none focus:ring-2",
          invalid
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
            : "border-slate-300 focus:border-indigo-400 focus:ring-indigo-100",
          className,
        )}
        {...rest}
      />
    );
  },
);
