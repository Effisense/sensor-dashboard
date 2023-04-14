import { Severity } from "@/types";
import {
  XCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../LoadingSpinner";
import { cn } from "@/utils/tailwind";

const SeverityToIcon = (severity: Severity, className?: string) => {
  switch (severity) {
    case "error":
      return <XCircleIcon className={cn("w-4 text-red-500", className)} />;
    case "warning":
      return (
        <ExclamationTriangleIcon
          className={cn("w-4 text-orange-300", className)}
        />
      );
    case "success":
      return (
        <CheckCircleIcon className={cn("w-4 text-green-500", className)} />
      );
    case "info":
      return (
        <QuestionMarkCircleIcon
          className={cn("w-4 text-blue-400", className)}
        />
      );
    case "loading":
      return <LoadingSpinner className={cn("w-4", className)} />;
    default:
      return undefined;
  }
};

export default SeverityToIcon;
