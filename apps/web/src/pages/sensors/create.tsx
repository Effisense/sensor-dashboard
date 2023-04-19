import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Button } from "../../ui/Button";
import SetSensorPositionMap from "@/ui/map/SetSensorPositionMap";
import H1 from "@/ui/typography/H1";
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
    <div className="flex min-h-[calc(100vh-6rem)] w-screen flex-col items-center justify-start">
      <H1>Add sensor</H1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "my-8 mx-8 flex h-full w-11/12 flex-col items-center md:w-full",
          "justify-center gap-y-2 rounded-lg bg-slate-50 p-8",
          "shadow-md transition-all duration-300 hover:shadow-lg",
          "md:grid md:flex-none md:grid-cols-2 md:gap-x-4",
          "md:bg-transparent md:shadow-none md:hover:shadow-none",
        )}
      >
        <div className="flex flex-col items-center justify-center md:col-start-2 md:row-start-1">
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

          <SelectContainerDropdown
            containerId={containerId}
            setContainerId={setContainerId}
            data={data}
            isLoading={isLoading}
          />
        </div>

        <div className="my-4 h-96 w-96 pb-8 md:col-start-1 md:row-start-1 md:h-full md:w-full">
          <SetSensorPositionMap
            container={container}
            location={location}
            error={error}
            isLoading={mapIsLoading}
          />
        </div>

        <div className="flex items-center justify-center md:col-start-2 md:row-start-2">
          <Button variant="default" type="submit" className="mt-8 md:w-1/2">
            Add sensor
          </Button>
        </div>
      </form>
    </div>
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
