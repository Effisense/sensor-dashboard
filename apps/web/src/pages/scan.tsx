import QrReader from "@/ui/QrReader";
import H1 from "@/ui/typography/H1";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";

const ScanPage = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  const handleScan = (data: string) => {
    // TODO
    // 1.Validate that the `data` is a valid and active device ID
    // 2. Redirect to `/sensors/add` with `deviceId` as a query parameter
    console.log(data);
  };

  return (
    <div>
      <H1>Add Sensor</H1>

      <div>
        <QrReader
          onResult={(result) => {
            if (!!result) {
              handleScan(result.getText());
              setDeviceId(result.getText());
            }
          }}
        />
        <p>{deviceId}</p>
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
