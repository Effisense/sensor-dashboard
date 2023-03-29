import useUpdateSensorForm from "@/hooks/forms/useUpdateSensorForm";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/ui/Button";
import FormInput from "@/ui/FormInput";
import FormTextarea from "@/ui/FormTextarea";
import LoadingSpinner from "@/ui/LoadingSpinner";
import SensorPositionMap from "@/ui/Map";
import H1 from "@/ui/typography/H1";
import Subtle from "@/ui/typography/Subtle";
import { trpc } from "@/utils/trpc";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

type UpdateSensorPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const UpdateSensorPage = ({ id }: UpdateSensorPageProps) => {
  const router = useRouter();
  const { data, isLoading, error } = trpc.sensor.get.useQuery({ id });
  const { register, onSubmit, handleSubmit, errors } = useUpdateSensorForm({
    id,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Oops!",
        description: `An error occurred: ${error.message}`,
        severity: "error",
      });
    }
  }, [error, toast]);

  const sensorExists = !error && !isLoading && !!data.sensor;

  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      router.push("/404");
    }
  }, [error, router]);

  return (
    <div>
      {!error && isLoading && (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
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

            <SensorPositionMap />

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
