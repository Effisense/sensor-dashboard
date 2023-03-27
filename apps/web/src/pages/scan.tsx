import { Button } from "@/ui/Button";
import QrReader from "@/ui/QrReader";
import H1 from "@/ui/typography/H1";
import { trpc } from "@/utils/trpc";
import {
  SpanApiPayload,
  SpanApiPayloadSchema,
} from "@acme/api/src/schemas/sensor";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ScanPage = () => {
  const [payload, setPayload] = useState<SpanApiPayload | null>(null);
  const router = useRouter();
  const { data: sensorBelongsToCollection, refetch } =
    trpc.sensor.belongsToCollection.useQuery(
      {
        collectionId: payload?.collectionId || "",
        deviceId: payload?.deviceId || "",
      },
      {
        enabled: !!payload,
      },
    );

  const handleScan = (data: string) => {
    try {
      const payload = SpanApiPayloadSchema.parse(JSON.parse(data));
      setPayload(payload);
      refetch();
    } catch (e) {
      // TODO: Display error message in toast
      console.log(e);
    }
  };

  useEffect(() => {
    if (sensorBelongsToCollection && payload) {
      router.push({
        pathname: "/sensors/add",
        query: {
          deviceId: payload.deviceId,
          collectionId: payload.collectionId,
        },
      });
    }
  }, [payload, router, sensorBelongsToCollection]);

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
