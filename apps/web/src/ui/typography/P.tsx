import { cn } from "@/utils/tailwind";

type PProps = React.HTMLAttributes<HTMLHeadingElement>;

const P = ({ className, children }: PProps) => {
  return (
    <p className={cn("[&:not(:first-child)]:mt-6 leading-7", className)}>
      {children}
    </p>
  );
};

export default P;
