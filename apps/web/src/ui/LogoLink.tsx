import Link from "next/link";
import Logo from "./Logo";

const LogoLink = () => {
  return (
    <Link href="/">
      <div className="h-10 drop-shadow-md transition-all duration-300 hover:drop-shadow-lg">
        <Logo />
      </div>
    </Link>
  );
};

export default LogoLink;
