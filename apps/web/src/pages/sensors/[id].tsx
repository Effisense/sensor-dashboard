import { trpc } from "@/utils/trpc";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

type SensorPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SensorPage = ({ id }: SensorPageProps) => {
  const { data, isLoading, error } = trpc.sensor.get.useQuery({ id: id });

  return <div>sensor data goes here (check the console)</div>;
};

export const getServerSideProps = (
  context: GetServerSidePropsContext<{
    id: string;
  }>,
) => {
  const id = context.params?.id;

  if (!id) {
    return {
      redirect: {
        destination: "/404",
      },
    };
  }

  return {
    props: { id },
  };
};

export default SensorPage;
