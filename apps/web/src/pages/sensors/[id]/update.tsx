import useUpdateSensorForm from "@/hooks/forms/useUpdateSensorForm";
import useSetSensorPositionMap from "@/hooks/map/useSetSensorPositionMap";
import useGetSensor from "@/hooks/queries/useGetSensor";
import { Button } from "@/ui/Button";
import SelectContainerDropdown from "@/ui/containers/SelectContainerDropdown";
import FormInput from "@/ui/FormInput";
import FormTextarea from "@/ui/FormTextarea";
import SetSensorPositionMap from "@/ui/map/SetSensorPositionMap";
import H1 from "@/ui/typography/H1";
import Subtle from "@/ui/typography/Subtle";
import { cn } from "@/utils/tailwind";
import { trpc } from "@/utils/trpc";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

type UpdateSensorPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const UpdateSensorPage = ({ id }: UpdateSensorPageProps) => {
  const {
    data,
    isLoading: sensorIsLoading,
    error: sensorError,
  } = useGetSensor({ id });

  const {
    container,
    data: location,
    isLoading: mapIsLoading,
    latitude,
    longitude,
    error: mapError,
  } = useSetSensorPositionMap({
    latitude: data?.sensor.latitude,
    longitude: data?.sensor.longitude,
  });

  const {
    register,
    onSubmit,
    handleSubmit,
    errors,
    containerId,
    setContainerId,
  } = useUpdateSensorForm({
    sensor: data?.sensor,
    id,
    latitude,
    longitude,
  });

  const {
    data: containerData,
    isLoading: containerIsLoading,
    error: containerError,
  } = trpc.container.getAll.useQuery();

  const isLoading = sensorIsLoading || containerIsLoading;
  const error = !!sensorError || !!containerError;
  const sensorExists = !sensorError && !sensorIsLoading && !!data?.sensor;

  return (
    <div className="flex min-h-[calc(100vh-6rem)] w-screen flex-col items-center justify-start">
      {sensorExists && (
        <>
          <div className="flex flex-col items-center justify-center py-8">
            <H1>{data?.sensor.name}</H1>
            <Subtle>Update information about this sensor.</Subtle>
          </div>

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
            </div>

            <div className="my-4 h-96 w-96 pb-8 md:col-start-1 md:row-start-1 md:h-full md:w-full">
              <SetSensorPositionMap
                container={container}
                location={location}
                error={mapError}
                isLoading={mapIsLoading}
              />
            </div>

            <div className="flex items-center justify-center md:col-start-2 md:row-start-2">
              <Button
                variant="default"
                type="submit"
                className="mt-8 w-full md:w-1/2"
              >
                Update sensor
              </Button>
            </div>
          </form>
        </>
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
