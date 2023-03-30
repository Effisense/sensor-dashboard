import H1 from "@/ui/typography/H1";
import { trpc } from "@/utils/trpc";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

type SensorPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SensorPage = ({ id }: SensorPageProps) => {
  const {
    data: sensor,
    isLoading: sensorIsLoading,
    error: sensorError,
  } = trpc.sensor.get.useQuery({ id });

  return (
    <div>
      <H1>Sensor</H1>
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

export default SensorPage;
