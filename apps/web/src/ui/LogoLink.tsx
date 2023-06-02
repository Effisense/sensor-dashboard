import Link from "next/link";
import Logo from "./Logo";
import { useRouter } from "next/router";

const LogoLink = () => {
  const router = useRouter();
  return (
    <Link
      href="/"
      onClick={async () => {
        router.push("/");
      }}
    >
      <div className="h-10 drop-shadow-md transition-all duration-300 hover:drop-shadow-lg">
        <Logo />
      </div>
    </Link>
  );
};

export default LogoLink;
