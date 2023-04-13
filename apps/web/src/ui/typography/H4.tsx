import { cn } from "@/utils/tailwind";

type H4Props = React.HTMLAttributes<HTMLHeadingElement>;

const H4 = ({ className, children }: H4Props) => {
  return (
    <h4
      className={cn(
        "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
    >
      {children}
    </h4>
  );
};

export default H4;
