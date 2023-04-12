import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getAuth } from "@clerk/nextjs/server";
import { trpc } from "@/utils/trpc";
import LoadingSpinner from "@/ui/LoadingSpinner";
import { useEffect } from "react";
import AllSensorsMap from "@/ui/map/AllSensorsMap";
import useErrorToast from "@/hooks/toast/useErrorToast";

type IndexPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const IndexPage = ({ userId }: IndexPageProps) => {
  const { mutateAsync, isLoading } = trpc.user.createIfNotExists.useMutation();
  const {
    data: sensors,
    isLoading: sensorsIsLoading,
    error,
  } = trpc.sensor.getAll.useQuery();

  useEffect(() => {
    if (!userId) return;
    mutateAsync({ userId });
  }, [mutateAsync, userId]);

  useErrorToast({ error });

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

          {sensorsIsLoading && !sensors && <LoadingSpinner />}
          {!sensorsIsLoading && sensors && <AllSensorsMap sensors={sensors} />}
        </>
      )}
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { userId } = getAuth(ctx.req);

  return {
    props: { userId },
  };
};

export default IndexPage;
