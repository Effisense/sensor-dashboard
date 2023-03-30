import H1 from "@/ui/typography/H1";
import { trpc } from "@/utils/trpc";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

type ContainerPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const ContainerPage = ({ id }: ContainerPageProps) => {
  const {
    data: container,
    isLoading: containerIsLoading,
    error: containerError,
  } = trpc.container.get.useQuery({
    containerId: id,
  });
  const {
    data: sensors,
    isLoading: sensorsIsLoading,
    error: sensorsError,
  } = trpc.container.getSensorsByContainerId.useQuery({
    containerId: id,
  });

  return (
    <div>
      <H1>Container</H1>
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>,
) => {
  const id = context.params?.id;
  if (!id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      id,
    },
  };
};

export default ContainerPage;
