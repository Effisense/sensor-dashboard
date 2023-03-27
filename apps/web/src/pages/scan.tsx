import { SpanApiPayload, SpanApiPayloadSchema } from "@/schemas";
import QrReader from "@/ui/QrReader";
import H1 from "@/ui/typography/H1";
import { trpc } from "@/utils/trpc";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";

const ScanPage = () => {
  const [payload, setPayload] = useState<SpanApiPayload | null>(null);
  const {} = trpc.

  const handleScan = (data: string) => {
    const { success } = SpanApiPayloadSchema.safeParse(data);
    if (!success) {
      // Display toast with error message
    }

    // TODO
    // 1.Validate that the `data` is a valid and active device ID
    // 2. Redirect to `/sensors/add` with `deviceId` as a query parameter
    console.log(data);
  };

  return (
    <div className="w-1/2 md:w-3/4">
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
        <p>{JSON.stringify(payload)}</p>
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
