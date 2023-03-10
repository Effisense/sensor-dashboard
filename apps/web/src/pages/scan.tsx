import H1 from "@/ui/typography/H1";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import { QrReader } from "react-qr-reader";

const ScanPage = () => {
  const [data, setData] = useState("No result");

  return (
    <div>
      <H1>Add Sensor</H1>

      <div>
        <QrReader
          onResult={(result, error) => {
            if (!!result) {
              setData(result?.getText());
            }

            if (!!error) {
              console.info(error);
            }
          }}
          constraints={{
            facingMode: "environment",
          }}
        />
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
