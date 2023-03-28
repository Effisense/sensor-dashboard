import { cn } from "@/utils/tailwind";
import { Loader2, LucideProps } from "lucide-react";

type LoadingSpinnerProps = LucideProps;

const LoadingSpinner = ({ className }: LoadingSpinnerProps) => {
  return <Loader2 className={cn("w-8 animate-spin", className)} />;
};

export default LoadingSpinner;
