import { Button } from "@/ui/Button";
import H1 from "@/ui/typography/H1";
import Subtle from "@/ui/typography/Subtle";
import { trpc } from "@/utils/trpc";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";

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
    return     <div className="flex flex-col items-center justify-center gap-y-4">
    <H1>Oh no!</H1>
    <Subtle>
      It looks like the container you&apos;re looking for doesn&apos;t exist.
    </Subtle>
    <Link href="/">
      <Button variant="subtle">Take me home</Button>
    </Link>
  </div>;
  }

  return (
    <div>
      <H1>{container.name}</H1>
      <p>Height: {container.binHeightInMillimeters}</p>
      <p>Width: {container.binWidthInMillimeters}</p>
      <p>Volume: {container.containerVolumeInLiters}</p>
      <p>Description: {container.description}</p>
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
