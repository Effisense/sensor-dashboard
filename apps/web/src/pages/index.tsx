import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@acme/api";
import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Map from "@/ui/Map";

const PostCard: React.FC<{
  post: inferProcedureOutput<AppRouter["post"]["all"]>[number];
}> = ({ post }) => {
  return (
    <div className="max-w-2xl rounded-lg border-2 border-gray-500 p-4 transition-all hover:scale-[101%]">
      <h2 className="text-2xl font-bold text-[hsl(280,100%,70%)]">
        {post.title}
      </h2>
      <p>{post.content}</p>
    </div>
  );
};

const Home: NextPage = () => {
  const postQuery = trpc.post.all.useQuery();

  const timeseriesQuery = trpc.timeseries.hello.useQuery();

  console.log(timeseriesQuery.data);

  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Create <span className="text-[hsl(280,100%,70%)]">T3</span> Turbo
      </h1>
      <AuthShowcase />

      <Map />

      <button
        type="button"
        onClick={() => {
          throw new Error("Sentry Frontend Error");
        }}
      >
        Throw error
      </button>

      <div className="flex h-[60vh] justify-center overflow-y-scroll px-4 text-2xl">
        {postQuery.data ? (
          <div className="flex flex-col gap-4">
            {postQuery.data?.map((p) => {
              return <PostCard key={p.id} post={p} />;
            })}
          </div>
        ) : (
          <p>Loading..</p>
        )}
      </div>
    </div>
  );
};

export default Home;

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
