import QrReader from "@/ui/QrReader";
import H1 from "@/ui/typography/H1";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";

const ScanPage = () => {
  const [data, setData] = useState<string | null>(null);

  return (
    <div>
      <H1>Add Sensor</H1>

      <div>
        <QrReader data={data} setData={setData} />
        <p>{data}</p>
      </div>
    </div>
  );
};

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const { userId } = getAuth(ctx.req);

  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in?redirect=/scan",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default ScanPage;
