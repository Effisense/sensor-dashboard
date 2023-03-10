type SubtleProps = React.HTMLAttributes<HTMLHeadingElement>;

const Subtle = ({ children }: SubtleProps) => {
  return (
    <p className="dark:text-slate-400 text-sm text-slate-500">{children}</p>
  );
};

export default Subtle;
