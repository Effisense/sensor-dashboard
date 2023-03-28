import { cn } from "@/utils/tailwind";

type SubtleProps = React.HTMLAttributes<HTMLHeadingElement>;

const Subtle = ({ className, children, ...props }: SubtleProps) => {
  return (
    <p
      className={cn("dark:text-slate-400 text-sm text-slate-500", className)}
      {...props}
    >
      {children}
    </p>
  );
};

export default Subtle;
