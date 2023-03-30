import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/tailwind";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./ToastPrimitive";
import SeverityToIcon from "@/ui/utils/SeverityToIcon";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        severity,
        ...props
      }) {
        return (
          <Toast
            key={id}
            {...props}
            className={cn(
              "border-2",
              severity === "error" && "border-red-500",
              severity === "warning" && "border-orange-300",
              severity === "success" && "border-green-500",
              severity === "info" && "border-blue-400",
              severity === "neutral" && "border-slate-400",
            )}
          >
            <div className="grid gap-1">
              <div className="flex items-center justify-start gap-x-2">
                {SeverityToIcon(severity || "neutral")}
                {title && <ToastTitle>{title}</ToastTitle>}
              </div>
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
