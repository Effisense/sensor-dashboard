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
import { useRouter } from "next/router";
import { useEffect } from "react";

type UpdateContainerPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const UpdateContainerPage = ({ id }: UpdateContainerPageProps) => {
  const { data, isLoading, error } = trpc.container.get.useQuery({
    containerId: id,
  });
  const router = useRouter();
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

  const containerExists = !error && !isLoading && data;

  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      router.push("/404");
    }
  }, [error, router]);

  return (
    <div>
      {isLoading && (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      {containerExists && (
        <div>
          <div className="flex flex-col items-center justify-center py-8">
            <H1>{data?.name}</H1>
            <Subtle>Update information about this container.</Subtle>
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
              errorMessage={errors.targetFillLevelInPercent?.message}
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
