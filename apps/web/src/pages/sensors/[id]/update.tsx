import useUpdateSensorForm from "@/hooks/forms/useUpdateSensorForm";
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
import { Types } from "@acme/leaflet";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type UpdateSensorPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const UpdateSensorPage = ({ id }: UpdateSensorPageProps) => {
  const {
    data,
    isLoading: sensorIsLoading,
    error: sensorError,
  } = useGetSensor({ id });

  const [position, setPosition] = useState<Types.Coordinate | null>(null);

  useEffect(() => {
    if (data?.sensor) {
      setPosition({
        lat: data.sensor.latitude,
        lng: data.sensor.longitude,
      });
    }
  }, [data?.sensor]);

  console.log(position);

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
    latitude: position?.lat,
    longitude: position?.lng,
  });

  const {
    data: containerData,
    isLoading: containerIsLoading,
    error: containerError,
  } = trpc.container.getAll.useQuery();

  const isLoading = sensorIsLoading || containerIsLoading;
  const error = !!sensorError || !!containerError;
  const sensorExists = !sensorError && !sensorIsLoading && !!data?.sensor;

  const router = useRouter();

  return (
    <div>
      {sensorExists && (
        <>
          <Button
            variant="subtle"
            className="m-4 flex items-center justify-center gap-x-2"
            onClick={() => {
              router.back();
            }}
          >
            <ArrowUturnLeftIcon className="w-4" />
            <span>Back</span>
          </Button>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex w-full flex-col items-center justify-center lg:mt-0">
              <H2 className="text-lg">{data?.sensor.name}</H2>
              <Subtle>Update information about this sensor.</Subtle>
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
                  sensor={data?.sensor}
                  boundsFallback={{
                    lat: data?.sensor.latitude,
                    lng: data?.sensor.longitude,
                  }}
                  position={position}
                  setPosition={setPosition}
                />
              </div>
              <div
                className={cn(
                  "mx-4 justify-center gap-y-2 rounded-lg bg-slate-50 p-4 md:ml-4",
                  "shadow-md transition-all duration-300 hover:shadow-lg",
                  "col-span-1 flex w-full flex-col items-center justify-center",
                  "sm:order-2 md:order-2 lg:order-2 lg:col-span-1 lg:mt-0 lg:h-auto",
                )}
              >
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
