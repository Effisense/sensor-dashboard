import { Severity } from "@/types";
import {
  XCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

const SeverityToIcon = (severity: Severity) => {
  switch (severity) {
    case "error":
      return <XCircleIcon className="w-4 text-red-500" />;
    case "warning":
      return <ExclamationTriangleIcon className="w-4 text-orange-300" />;
    case "success":
      return <CheckCircleIcon className="w-4 text-green-500" />;
    case "info":
      return <QuestionMarkCircleIcon className="w-4 text-blue-400" />;
    default:
      return undefined;
  }
};

export default SeverityToIcon;
