import Link from "next/link";
import Subtle from "./typography/Subtle";

const Footer = () => {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <Subtle>
        Developed and designed by{" "}
        <Link
          href="https://www.jrc.no/"
          target={"_blank"}
          rel="noopener noreferrer"
          className="text-sage-12 hover:text-sage-11 hover:underline"
        >
          Junior Consulting
        </Link>
      </Subtle>
    </div>
  );
};

export default Footer;
