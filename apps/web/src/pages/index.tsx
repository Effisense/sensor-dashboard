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

  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  // If user has not set an active organization, we must ensure they do so before they can access the dashboard
  if (!orgId) {
    return {
      redirect: {
        destination: "/customer",
        permanent: false,
      },
    };
  }

  const userExists = await prisma?.user
    .findUnique({
      where: {
        id: userId,
      },
    })
    .then((user) => !!user);

  if (!userExists) {
    await prisma?.user.create({
      data: {
        id: userId,
      },
    });
  }

  return {
    props: {},
  };
};

export default IndexPage;
