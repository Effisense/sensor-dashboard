import { SignIn } from "@clerk/nextjs";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { z } from "zod";
import { RedirectSchema } from "@/schemas";

type SignInPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SignInPage = ({ redirect }: SignInPageProps) => {
  console.log(redirect);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Sign In
        </h1>
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          redirectUrl={redirect || "/"}
        />
      </div>
    </div>
  );
};

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const { userId } = getAuth(ctx.req);

  if (userId) {
    return {
      redirect: {
        destination: "/",
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

  console.log(redirect);

  return {
    props: {
      redirect,
    },
  };
};

export default SignInPage;
