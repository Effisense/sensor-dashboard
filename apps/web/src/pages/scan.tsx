import useScanSensor from "@/hooks/useScanSensor";
import QrReader from "@/ui/QrReader";
import H1 from "@/ui/typography/H1";
import Subtle from "@/ui/typography/Subtle";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";

const ScanPage = () => {
  const { handleScan } = useScanSensor();

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center py-8">
        <H1>Welcome to Effisense</H1>
        <Subtle>Please scan the QR code on your sensor.</Subtle>
      </div>

      <div className="mx-auto w-11/12 md:w-3/4 lg:w-1/2">
        <QrReader
          onResult={(result) => {
            if (!!result) {
              handleScan(result.getText());
            }
          }}
        />
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
