import useUpdateSensorForm from "@/hooks/forms/useUpdateSensorForm";
import useSetSensorPositionMap from "@/hooks/map/useSetSensorPositionMap";
import useGetSensor from "@/hooks/queries/useGetSensor";
import { Button } from "@/ui/Button";
import SelectContainerDropdown from "@/ui/containers/SelectContainerDropdown";
import FormInput from "@/ui/FormInput";
import FormTextarea from "@/ui/FormTextarea";
import LoadingSpinner from "@/ui/LoadingSpinner";
import SetSensorPositionMap from "@/ui/map/SetSensorPositionMap";
import H2 from "@/ui/typography/H2";
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
    <div>
      {sensorExists && (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex w-full flex-col items-center justify-center lg:mt-0">
              <H2 className="text-lg">{data?.sensor.name}</H2>
              <Subtle>Update information about this sensor.</Subtle>
            </div>
            <div
              className={cn(
                "md:grid",
                "flex min-h-[calc(100vh-12rem)]",
                "w-full gap-y-4 lg:grid-cols-3 lg:gap-y-0",
                "w-screen flex-col p-6",
              )}
            >
              <div
                className={cn(
                  "col-span-1 grid w-full lg:col-span-2",
                  "transition-all duration-300",
                  "lg:order:1 flex flex-col items-start justify-center sm:order-1 md:order-1",
                  "sm:h-[calc(100vh-12rem)] lg:h-auto",
                )}
              >
                <Subtle className="w-full py-2 text-center">
                  Please set the position of the sensor.
                </Subtle>
                <SetSensorPositionMap
                  container={container}
                  location={location}
                  error={mapError}
                  isLoading={mapIsLoading}
                />
              </div>
              <div className="col-span-1 flex w-full flex-col items-center justify-center sm:order-2 md:order-2 md:mt-8 lg:order-2 lg:col-span-1 lg:mt-0 lg:h-auto">
                <div>
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
                </div>
                <SelectContainerDropdown
                  containerId={containerId}
                  setContainerId={setContainerId}
                  data={containerData}
                  isLoading={isLoading}
                />
                <div className="flex items-center justify-center">
                  <Button
                    variant="default"
                    type="submit"
                    className="mt-8 w-full md:w-40"
                  >
                    Update sensor
                  </Button>
                </div>
              </div>
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
