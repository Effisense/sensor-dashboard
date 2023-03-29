import { SignUp, useAuth } from "@clerk/nextjs";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { RedirectSchema } from "@/schemas";
import LoadingSpinner from "@/ui/LoadingSpinner";

type SignUpPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SignUpPage = ({ redirect }: SignUpPageProps) => {
  const { isLoaded } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Sign In
        </h1>

        {!isLoaded && <LoadingSpinner className="w-12" />}

        {isLoaded && (
          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
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

export default SignUpPage;
