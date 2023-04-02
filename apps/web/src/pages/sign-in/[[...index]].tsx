import { SignIn, useAuth } from "@clerk/nextjs";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { RedirectSchema } from "@/schemas";
import LoadingSpinner from "@/ui/LoadingSpinner";
import { getAuth } from "@clerk/nextjs/server";

type SignInPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SignInPage = ({ redirect }: SignInPageProps) => {
  const { isLoaded } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Sign In
        </h1>
        {!isLoaded && <LoadingSpinner className="w-12" />}

        {isLoaded && (
          <SignIn
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
            redirectUrl={redirect || "/"}
          />
        )}
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

  return {
    props: {
      redirect,
    },
  };
};

export default SignInPage;
