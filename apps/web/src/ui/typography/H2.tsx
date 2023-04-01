type H2Props = React.HTMLAttributes<HTMLHeadingElement>;

const H2 = ({ children }: H2Props) => {
  return (
    <h2 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      {children}
    </h2>
  );
};

export default H2;
