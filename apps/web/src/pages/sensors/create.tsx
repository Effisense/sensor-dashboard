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
    <div className="flex flex-col items-center justify-center">
      <H1>Add sensor</H1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="my-8 flex flex-col items-center justify-center gap-y-2"
      >
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

        <SetSensorPositionMap
          container={container}
          location={location}
          error={error}
          isLoading={mapIsLoading}
        />

        <Button variant="default" type="submit" className="w-3/4">
          Add sensor
        </Button>
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
