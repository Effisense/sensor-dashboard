import useUpdateSensorForm from "@/hooks/forms/useUpdateSensorForm";
import useSetSensorPositionMap from "@/hooks/map/useSetSensorPositionMap";
import useGetSensor from "@/hooks/queries/useGetSensor";
import { Button } from "@/ui/Button";
import SelectContainerDropdown from "@/ui/containers/SelectContainerDropdown";
import FormInput from "@/ui/FormInput";
import FormTextarea from "@/ui/FormTextarea";
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
          <div className={cn(
            "md:grid",
            "flex min-h-[calc(100vh-6rem)]",
            "md:w-full md:grid-cols-1 gap-y-4 md:w-full md:gap-x-8 md:px-4 lg:grid-cols-3 lg:gap-y-0",
            "w-screen p-4 md:p-2 flex-col gap-y-20"
          )}>        
        <div
          className={cn(
            "col-span-1 grid w-full rounded-lg lg:col-span-2",
            "bg-slate-50 shadow-md transition-all duration-300 md:m-0 md:mt-8",
            "flex md:flex-col md:items-center md:justify-start p-2 flex-row justify-end order-2 md:order-1",
            "h-[calc(100vh-3rem)] md:h-5/6"
          )}
        >
                <SetSensorPositionMap
                  container={container}
                  location={location}
                  error={mapError}
                  isLoading={mapIsLoading}
                />
              </div>

              <div className="col-span-1 h-96 lg:col-span-1 lg:h-auto lg:w-96 flex justify-center items-center flex-col md:order-2 order-1 mt-4 md:mt-0">
                  <div className="py-8 text-center">
                    <H2 className="text-lg">{data?.sensor.name}</H2>
                    <Subtle>Update information about this sensor.</Subtle>
                  </div>
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
