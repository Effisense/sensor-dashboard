import { useToast } from "@/hooks/useToast";
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
  const { toast } = useToast();
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
    let parsed;
    try {
      parsed = JSON.parse(data);
    } catch (e) {
      console.log(e);
      toast({
        title: "Oops!",
        description: "Something went wrong. Are you sure you scanned a sensor?",
      });
      return;
    }

    try {
      const payload = SpanApiPayloadSchema.parse(parsed);
      setPayload(payload);
      refetch();
    } catch (e) {
      console.log(e);
      toast({
        title: "Oops!",
        description: "Something went wrong. Are you sure you scanned a sensor?",
      });
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

      <Button
        onClick={() => {
          toast({
            title: "test",
            description: "test",
          });
        }}
      >
        test toast
      </Button>

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
