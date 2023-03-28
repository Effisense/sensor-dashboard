import * as React from "react";
import { cn } from "@/utils/tailwind";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "dark:border-slate-900 dark:text-slate-50 flex h-8 w-full rounded-md border-[1px] border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none  disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
