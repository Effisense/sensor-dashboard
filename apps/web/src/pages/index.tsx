import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getAuth } from "@clerk/nextjs/server";
import Map from "@/ui/Map";
import { Sensor } from "@/lib/kysely";

type IndexPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const IndexPage = ({ data }: IndexPageProps) => {
  console.log(data);
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        <span className="text-[hsl(280,100%,70%)]">Effisense dashboard</span>
      </h1>

      <Map />
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

  const data = await Sensor.selectAll()
    .execute()
    .then((res) => res)
    .catch(() => []);

  return {
    props: {
      data,
    },
  };
};

export default IndexPage;
