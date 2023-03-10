type H3Props = React.HTMLAttributes<HTMLHeadingElement>;

const H3 = ({ children }: H3Props) => {
  return (
    <h3 className="dark:border-b-slate-700 mt-10 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      {children}
    </h3>
  );
};

export default H3;
