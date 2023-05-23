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
            <div className="grid min-h-[calc(100vh-6rem)] w-11/12 grid-cols-1 gap-y-4 md:w-full md:gap-x-16 md:px-4 lg:grid-cols-3 lg:gap-y-0">
            <div
            className={cn(
              "w-full rounded-lg bg-slate-50 shadow-md transition-all duration-300",
              "flex flex-col items-center justify-start p-4",
              "h-96 lg:h-[calc(100vh-6rem)] mb-4",
            "col-span-2 lg:col-span-2"
  )}
>
  <SetSensorPositionMap
    container={container}
    location={location}
    error={mapError}
    isLoading={mapIsLoading}
  />
</div>

              <div className="col-span-1 lg:col-span-1 lg:col-start-3">
                <div className="flex flex-col items-center justify-center">
                  <div className="py-8">
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
                      className="mt-8 w-full md:w-1/2"
                    >
                      Update sensor
                    </Button>
                  </div>
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
