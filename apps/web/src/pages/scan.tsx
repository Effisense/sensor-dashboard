import useScanSensor from "@/hooks/useScanSensor";
import QrReader from "@/ui/QrReader";
import H1 from "@/ui/typography/H1";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";

const ScanPage = () => {
  const { handleScan } = useScanSensor();

  return (
    <div className="">
      <H1 className="text-center">Add Sensor</H1>

      <div>
        <QrReader
          onResult={(result) => {
            if (!!result) {
              handleScan(result.getText());
            }
          }}
          className="h-full w-full"
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
