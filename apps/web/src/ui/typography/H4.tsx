type H4Props = React.HTMLAttributes<HTMLHeadingElement>;

const H4 = ({ children }: H4Props) => {
  return (
    <h4 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight">
      {children}
    </h4>
  );
};

export default H4;
