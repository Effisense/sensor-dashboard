import type { GetServerSidePropsContext, NextPage } from "next";
import { RedirectSchema } from "@/schemas";
import { getAuth } from "@clerk/nextjs/server";
import Map from "@/ui/Map";

const IndexPage: NextPage = () => {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        <span className="text-[hsl(280,100%,70%)]">Effisense dashboard</span>
      </h1>

      <Map />
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
