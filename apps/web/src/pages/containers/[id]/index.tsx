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

  if (containerIsLoading || sensorsIsLoading) {
    return <div>Loading...</div>;
  }

  if (containerError || sensorsError) {
    return <div>Error</div>;
  }

  if (!container) {
    return <div>Container not found</div>;
  }

  return (
    <div>
      <H1>Container {container.id}</H1>
      <p>Description: {container.description}</p>
      <p>Name: {container.name}</p>
      <p>Sensors:</p>
      <ul>
        {sensors.map((sensor) => (
          <li key={sensor.id}>
            {sensor.name} 
          </li>
        ))}
      </ul>
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
