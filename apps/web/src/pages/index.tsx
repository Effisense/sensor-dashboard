import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getAuth } from "@clerk/nextjs/server";
import SensorPositionMap from "@/ui/Map";
import { trpc } from "@/utils/trpc";
import LoadingSpinner from "@/ui/LoadingSpinner";
import { useEffect } from "react";

type IndexPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const IndexPage = ({ userId }: IndexPageProps) => {
  const { mutateAsync, isLoading } = trpc.user.createIfNotExists.useMutation();

  useEffect(() => {
    if (!userId) return;
    mutateAsync({ userId });
  }, [mutateAsync, userId]);

  return (
    <div className="flex flex-col items-center justify-center gap-12 px-4 py-8">
      {isLoading && (
        <div className="flex flex-col items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Dashboard
          </h1>

          <SensorPositionMap />
        </>
      )}
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { userId } = getAuth(ctx.req);

  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: { userId },
  };
};

export default IndexPage;
