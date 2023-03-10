type PProps = React.HTMLAttributes<HTMLHeadingElement>;

const P = ({ children }: PProps) => {
  return <p className="[&:not(:first-child)]:mt-6 leading-7">{children}</p>;
};

export default P;
