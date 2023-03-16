import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Map from "@/ui/Map";

const Home: NextPage = () => {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Create <span className="text-[hsl(280,100%,70%)]">T3</span> Turbo
      </h1>
      <AuthShowcase />

      {/* <Map /> */}

      <button
        type="button"
        onClick={() => {
          throw new Error("Sentry Frontend Error");
        }}
      >
        Throw error
      </button>
    </div>
  );
};

const AuthShowcase: React.FC = () => {
  const { isSignedIn } = useAuth();
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined,
    { enabled: !!isSignedIn },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {isSignedIn && (
        <>
          <p className="text-center text-2xl text-black">
            {secretMessage && (
              <span>
                {" "}
                {secretMessage} click the user button!
                <br />
              </span>
            )}
          </p>
          <div className="flex items-center justify-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "3rem",
                    height: "3rem",
                  },
                },
              }}
            />
          </div>
        </>
      )}
      {!isSignedIn && (
        <p className="text-center text-2xl ">
          <Link href="/sign-in">Sign In</Link>
        </p>
      )}
    </div>
  );
};

export default Home;
