import type { GetServerSidePropsContext, NextPage } from "next";
import { trpc } from "../utils/trpc";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@acme/api";
import { RedirectSchema } from "@/schemas";
import { getAuth } from "@clerk/nextjs/server";
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

const IndexPage: NextPage = () => {
  const postQuery = trpc.post.all.useQuery();

  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        <span className="text-[hsl(280,100%,70%)]">Effisense dashboard</span>
      </h1>

      <Map />

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

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const { userId } = getAuth(ctx.req);

  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const { success } = RedirectSchema.safeParse(ctx.query.redirect);
  if (!success) {
    return {
      props: {},
    };
  }

  const redirect = ctx.query.redirect as string;

  return {
    props: {
      redirect,
    },
  };
};

export default IndexPage;
