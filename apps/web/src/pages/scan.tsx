import H1 from "@/ui/typography/H1";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";

const ScanPage = () => {
  return (
    <div>
      <H1>Add sensor</H1>
    </div>
  );
};

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
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

export default ScanPage;
