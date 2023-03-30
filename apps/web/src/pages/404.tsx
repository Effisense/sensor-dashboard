import { Button } from "@/ui/Button";
import H1 from "@/ui/typography/H1";
import Subtle from "@/ui/typography/Subtle";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <H1>Oh no!</H1>
      <Subtle>
        It looks like the page you&apos;re looking for doesn&apos;t exist.
      </Subtle>
      <Link href="/">
        <Button variant="subtle">Take me home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
