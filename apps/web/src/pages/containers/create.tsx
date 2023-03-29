import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";
import { Button } from "../../ui/Button";
import H1 from "@/ui/typography/H1";
import FormInput from "@/ui/FormInput";
import FormTextarea from "@/ui/FormTextarea";
import useCreateContainerForm from "@/hooks/forms/useCreateContainerForm";

const CreateContainerPage = () => {
  const { register, onSubmit, handleSubmit, errors } = useCreateContainerForm();

  return (
    <div className="flex flex-col items-center justify-center">
      <H1>Add container</H1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="my-8 flex flex-col items-center justify-center gap-y-2"
      >
        <FormInput
          label="Name"
          errorMessage={errors.name?.message}
          id="name"
          register={register}
        />

        <FormTextarea
          label="Description"
          errorMessage={errors.description?.message}
          id="description"
          register={register}
        />

        <FormInput
          label="Target fill level (%)"
          errorMessage={errors.name?.message}
          id="targetFillLevelInPercent"
          register={register}
          valueAsNumber
          defaultValue={100}
        />

        <FormInput
          register={register}
          id="binHeightInMillimeters"
          label="Bin height (mm)"
          errorMessage={errors.binHeightInMillimeters?.message}
          valueAsNumber
        />

        <FormInput
          register={register}
          id="binWidthInMillimeters"
          label="Bin width (mm)"
          errorMessage={errors.binWidthInMillimeters?.message}
          valueAsNumber
        />

        <FormInput
          register={register}
          id="sensorOffsetInMillimeters"
          label="Sensor offset (mm)"
          errorMessage={errors.sensorOffsetInMillimeters?.message}
          valueAsNumber
        />

        <FormInput
          register={register}
          id="containerVolumeInLiters"
          label="Container volume (L)"
          errorMessage={errors.containerVolumeInLiters?.message}
          valueAsNumber
        />

        <Button variant="default" type="submit" className="w-3/4">
          Add container
        </Button>
      </form>
    </div>
  );
};

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const { userId } = getAuth(ctx.req);

  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in?redirect=/containers/create",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default CreateContainerPage;
