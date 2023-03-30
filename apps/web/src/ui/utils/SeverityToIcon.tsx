import { Severity } from "@/types";
import { XCircle, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";

const SeverityToIcon = (severity: Severity) => {
  switch (severity) {
    case "error":
      return <XCircle className="w-4 text-red-500" />;
    case "warning":
      return <AlertTriangle className="w-4 text-orange-300" />;
    case "success":
      return <CheckCircle className="w-4 text-green-500" />;
    case "info":
      return <HelpCircle className="w-4 text-blue-400" />;
    default:
      return undefined;
  }
};

export default SeverityToIcon;
