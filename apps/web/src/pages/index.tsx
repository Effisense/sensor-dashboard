import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getAuth } from "@clerk/nextjs/server";
import SensorPositionMap from "@/ui/Map";
import { Button } from "@/ui/Button";
import { useToast } from "@/hooks/useToast";

type IndexPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const IndexPage = ({}: IndexPageProps) => {
  const { toast } = useToast();
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Dashboard
      </h1>

      <Button
        onClick={() => {
          toast({
            title: "Test",
            description: "Test description",
            severity: "error",
            duration: 5000,
          });
        }}
      >
        Trigger toast
      </Button>

      <SensorPositionMap />
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
    props: {},
  };
};

export default IndexPage;
