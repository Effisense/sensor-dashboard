import useUpdateContainerForm from "@/hooks/forms/useUpdateContainerForm";
import useGetContainer from "@/hooks/queries/useGetContainer";
import { Button } from "@/ui/Button";
import FormInput from "@/ui/FormInput";
import FormTextarea from "@/ui/FormTextarea";
import LoadingSpinner from "@/ui/LoadingSpinner";
import H1 from "@/ui/typography/H1";
import Subtle from "@/ui/typography/Subtle";
import { cn } from "@/utils/tailwind";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

type UpdateContainerPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const UpdateContainerPage = ({ id }: UpdateContainerPageProps) => {
  const { register, onSubmit, handleSubmit, errors } = useUpdateContainerForm({
    id,
  });
  const { data, isLoading, error } = useGetContainer({ id });

  return (
    <div className="flex w-screen flex-col items-center justify-center">
      {isLoading && (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <>
          <H1>{data?.name}</H1>
          <Subtle>Update information about this container.</Subtle>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
              "my-8 mx-8 flex h-full w-11/12 flex-col items-center lg:w-3/5",
              "justify-center gap-y-2 rounded-lg bg-slate-50 p-8",
              "shadow-md transition-all duration-300 hover:shadow-lg",
            )}
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

            <div className="flex w-full flex-col items-end justify-evenly md:flex-row md:gap-x-4">
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
            </div>

            <Button variant="default" type="submit" className="w-1/2">
              Update container
            </Button>
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

export default UpdateContainerPage;
