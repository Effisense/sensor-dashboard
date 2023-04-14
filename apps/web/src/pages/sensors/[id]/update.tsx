import useUpdateSensorForm from "@/hooks/forms/useUpdateSensorForm";
import useSetSensorPositionMap from "@/hooks/map/useSetSensorPositionMap";
import useGetSensor from "@/hooks/queries/useGetSensor";
import { Button } from "@/ui/Button";
import SelectContainerDropdown from "@/ui/containers/SelectContainerDropdown";
import FormInput from "@/ui/FormInput";
import FormTextarea from "@/ui/FormTextarea";
import LoadingSpinner from "@/ui/LoadingSpinner";
import SetSensorPositionMap from "@/ui/map/SetSensorPositionMap";
import H1 from "@/ui/typography/H1";
import Subtle from "@/ui/typography/Subtle";
import { trpc } from "@/utils/trpc";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

type UpdateSensorPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const UpdateSensorPage = ({ id }: UpdateSensorPageProps) => {
  const {
    container,
    data: location,
    isLoading: mapIsLoading,
    latitude,
    longitude,
    error: mapError,
  } = useSetSensorPositionMap();

  const {
    register,
    onSubmit,
    handleSubmit,
    errors,
    containerId,
    setContainerId,
  } = useUpdateSensorForm({
    id,
    latitude,
    longitude,
  });
  const {
    data,
    isLoading: sensorIsLoading,
    error: sensorError,
  } = useGetSensor({ id });
  const {
    data: containerData,
    isLoading: containerIsLoading,
    error: containerError,
  } = trpc.container.getAll.useQuery();

  const isLoading = sensorIsLoading || containerIsLoading;
  const error = !!sensorError || !!containerError;
  const sensorExists = !sensorError && !sensorIsLoading && !!data?.sensor;

  return (
    <div>
      {sensorExists && (
        <div>
          <div className="flex flex-col items-center justify-center py-8">
            <H1>{data?.sensor.name}</H1>
            <Subtle>Update information about this sensor.</Subtle>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="my-8 flex flex-col items-center justify-center gap-y-2"
          >
            <FormInput
              label="Name"
              errorMessage={errors.name?.message}
              id="name"
              register={register}
              defaultValue={data?.sensor.name}
            />

            <FormTextarea
              label="Description"
              errorMessage={errors.description?.message}
              id="description"
              register={register}
              defaultValue={data?.sensor.description}
            />

            <SelectContainerDropdown
              containerId={containerId}
              setContainerId={setContainerId}
              data={containerData}
              isLoading={isLoading}
            />

            <FormInput
              register={register}
              id="latitude"
              label="Latitude"
              errorMessage={errors.latitude?.message}
              valueAsNumber
              defaultValue={data?.sensor.latitude}
            />

            <FormInput
              register={register}
              id="longitude"
              label="Longitude"
              errorMessage={errors.longitude?.message}
              valueAsNumber
              defaultValue={data?.sensor.longitude}
            />

            <SetSensorPositionMap
              container={container}
              location={location}
              error={mapError}
              isLoading={mapIsLoading}
            />

            <Button variant="default" type="submit" className="w-3/4">
              Update sensor
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>,
) => {
  const id = context.params?.id;
  if (!id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      id,
    },
  };
};

export default UpdateSensorPage;
