import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getAuth } from "@clerk/nextjs/server";
import SensorPositionMap from "@/ui/Map";

type IndexPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const IndexPage = ({}: IndexPageProps) => {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Dashboard
      </h1>

      <SensorPositionMap />
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { userId, orgId } = getAuth(ctx.req);

  // TODO
  // const userExists = await prisma?.user
  //   .findUnique({
  //     where: {
  //       id: userId,
  //     },
  //   })
  //   .then((user) => !!user);

  // if (!userExists) {
  //   await prisma?.user.create({
  //     data: {
  //       id: userId,
  //     },
  //   });
  // }

  return {
    props: {},
  };
};

export default IndexPage;
