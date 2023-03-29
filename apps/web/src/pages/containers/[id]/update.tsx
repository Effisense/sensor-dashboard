import useUpdateContainerForm from "@/hooks/forms/useUpdateContainerForm";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/ui/Button";
import FormInput from "@/ui/FormInput";
import FormTextarea from "@/ui/FormTextarea";
import LoadingSpinner from "@/ui/LoadingSpinner";
import H1 from "@/ui/typography/H1";
import Subtle from "@/ui/typography/Subtle";
import { trpc } from "@/utils/trpc";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useEffect } from "react";

type ContainerPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const UpdateContainerPage = ({ id }: ContainerPageProps) => {
  const { data, isLoading, error } = trpc.container.get.useQuery({
    containerId: id,
  });
  const { register, onSubmit, handleSubmit, errors } = useUpdateContainerForm({
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

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      {!error && !isLoading && data && (
        <div>
          <H1>{data?.name}</H1>
          <Subtle>Update information about this container.</Subtle>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="my-8 flex flex-col items-center justify-center gap-y-2"
          >
            <FormInput
              label="Name"
              errorMessage={errors.name?.message}
              id="name"
              register={register}
              defaultValue={data?.name}
            />

            <FormTextarea
              label="Description"
              errorMessage={errors.description?.message}
              id="description"
              register={register}
              defaultValue={data?.description}
            />

            <FormInput
              label="Target fill level (%)"
              errorMessage={errors.name?.message}
              id="targetFillLevelInPercent"
              register={register}
              valueAsNumber
              defaultValue={data?.targetFillLevelInPercent}
            />

            <FormInput
              register={register}
              id="binHeightInMillimeters"
              label="Bin height (mm)"
              errorMessage={errors.binHeightInMillimeters?.message}
              valueAsNumber
              defaultValue={data?.binHeightInMillimeters}
            />

            <FormInput
              register={register}
              id="binWidthInMillimeters"
              label="Bin width (mm)"
              errorMessage={errors.binWidthInMillimeters?.message}
              valueAsNumber
              defaultValue={data?.binWidthInMillimeters}
            />

            <FormInput
              register={register}
              id="sensorOffsetInMillimeters"
              label="Sensor offset (mm)"
              errorMessage={errors.sensorOffsetInMillimeters?.message}
              valueAsNumber
              defaultValue={data?.sensorOffsetInMillimeters}
            />

            <FormInput
              register={register}
              id="containerVolumeInLiters"
              label="Container volume (L)"
              errorMessage={errors.containerVolumeInLiters?.message}
              valueAsNumber
              defaultValue={data?.containerVolumeInLiters}
            />

            <Button variant="default" type="submit" className="w-3/4">
              Update container
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

export default UpdateContainerPage;
