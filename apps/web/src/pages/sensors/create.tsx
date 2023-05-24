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
          <div className="absolute top-28 left-0 mx-8 mt-4">
              <Subtle>Please set the position of the sensor</Subtle>
          </div>
          <div className="flex w-screen justify-center lg:mt-0">
              <H2>Add sensor</H2>
          </div>
          <div className={cn(
            "md:grid",
            "flex min-h-[calc(100vh-12rem)]",
            "w-full gap-y-4 lg:grid-cols-3 lg:gap-y-0",
            "w-screen p-6 flex-col gap-y-20"
          )}>        
        <div
          className={cn(
            "col-span-1 grid w-full rounded-lg lg:col-span-2",
            "bg-slate-50 shadow-md transition-all duration-300 mt-4",
            "flex flex-row md:order-1 sm:order-1 lg:order:1",
            "h-[calc(100vh-3rem)] lg:h-[365px]"
          )}
        >
          <SetSensorPositionMap
            container={container}
            location={location}
            error={error}
            isLoading={mapIsLoading}
          />
        </div>
        <div className="col-span-1 h-80 lg:col-span-1 lg:h-auto lg:w-96 flex justify-center items-center flex-col md:order-2 sm:order-2 lg:order-2">
          <div className="flex flex-col items-center justify-center">
            <div className="w-64 px-4">
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
          </div>
          <div className="flex items-center justify-center">
            <Button
              variant="default"
              type="submit"
              className="mt-8 w-40"
            >
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
