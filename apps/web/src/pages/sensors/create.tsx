import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Button } from "../../ui/Button";
import SetSensorPositionMap from "@/ui/map/SetSensorPositionMap";
import H2 from "@/ui/typography/H2";
import useCreateSensorForm from "@/hooks/forms/useCreateSensorForm";
import FormInput from "@/ui/FormInput";
import FormTextarea from "@/ui/FormTextarea";
import { trpc } from "@/utils/trpc";
import SelectContainerDropdown from "@/ui/containers/SelectContainerDropdown";
import {
  SpanApiPayload,
  SpanApiPayloadSchema,
} from "@acme/api/src/schemas/sensor";
import { sensorBelongsToCollection as _sensorBelongsToCollection } from "@acme/api/src/utils/sensor";
import urlWithQueryParameters from "@/utils/urlWithQueryParameters";
import useSetSensorPositionMap from "@/hooks/map/useSetSensorPositionMap";
import { cn } from "@/utils/tailwind";
import Subtle from "@/ui/typography/Subtle";

type CreateSensorPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const CreateSensorPage = ({
  sensorId,
  collectionId,
}: CreateSensorPageProps) => {
  const {
    container,
    data: location,
    isLoading: mapIsLoading,
    latitude,
    longitude,
    error,
  } = useSetSensorPositionMap({});

  const {
    register,
    onSubmit,
    handleSubmit,
    errors,
    containerId,
    setContainerId,
  } = useCreateSensorForm({ sensorId, collectionId, latitude, longitude });

  const { data, isLoading } = trpc.container.getAll.useQuery();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-screen justify-center lg:mt-0">
        <H2>Add sensor</H2>
      </div>
      <div
        className={cn(
            "md:grid",
            "flex min-h-[calc(100vh-12rem)] gap-y-16 lg:gap-y-0",
            "w-full lg:grid-cols-3",
            "w-screen flex-col p-6",
        )}
      >
        <div
          className={cn(
            "col-span-1 grid w-full lg:col-span-2",
            "transition-all duration-300",
            "lg:order:1 flex flex-col items-start justify-center sm:order-1 md:order-1",
            "h-[calc(100vh-12rem)] lg:h-auto",
          )}
        >
          <Subtle className="w-full py-2 text-center">
            Please set the position of the sensor.
          </Subtle>
          <SetSensorPositionMap
            container={container}
            location={location}
            error={error}
            isLoading={mapIsLoading}
          />
        </div>
        <div className="col-span-1 flex w-full flex-col items-center justify-center sm:order-2 md:order-2 lg:order-2 lg:col-span-1 lg:mt-0 lg:h-auto">
          <div>
            <FormInput
              label="Name"
              errorMessage={errors.name?.message}
              id="name"
              register={register}
            />

            <FormTextarea
              register={register}
              id="description"
              errorMessage={errors.description?.message}
              label="Description"
            />
          </div>
          <SelectContainerDropdown
            containerId={containerId}
            setContainerId={setContainerId}
            data={data}
            isLoading={isLoading}
          />
          <div className="flex items-center justify-center">
            <Button variant="default" type="submit" className="mt-8 w-40">
              Add sensor
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { userId } = getAuth(ctx.req);

  const { success } = SpanApiPayloadSchema.safeParse(ctx.query);
  if (!success) {
    return {
      redirect: {
        destination: "/scan",
        permanent: false,
      },
    };
  }

  const { deviceId, collectionId } = ctx.query as SpanApiPayload;

  const sensorBelongsToCollection = await _sensorBelongsToCollection(
    deviceId,
    collectionId,
  );
  if (!sensorBelongsToCollection) {
    return {
      redirect: {
        destination: "/scan",
        permanent: false,
      },
    };
  }

  // Note that if the user is not signed in, the server-side logic in this function
  // will be ran when the user is redirected back to the `/sensors/create` page.
  // This way, we always ensure that the user is signed in and we have the `deviceId` and `collectionId`.
  if (!userId) {
    return {
      redirect: {
        destination: urlWithQueryParameters("/sign-in", {
          redirect: "/sensors/create",
          deviceId,
          collectionId,
        }),
        permanent: false,
      },
    };
  }

  return {
    props: {
      sensorId: deviceId,
      collectionId,
    },
  };
};

export default CreateSensorPage;
