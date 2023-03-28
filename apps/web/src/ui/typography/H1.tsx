type H1Props = React.HTMLAttributes<HTMLHeadingElement>;

const H1 = ({ children }: H1Props) => {
  return (
    <h1 className="scroll-m-20 pb-3 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h1>
  );
};

export default H1;
