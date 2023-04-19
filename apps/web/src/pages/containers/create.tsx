import { Button } from "../../ui/Button";
import H1 from "@/ui/typography/H1";
import FormInput from "@/ui/FormInput";
import FormTextarea from "@/ui/FormTextarea";
import useCreateContainerForm from "@/hooks/forms/useCreateContainerForm";
import { cn } from "@/utils/tailwind";

const CreateContainerPage = () => {
  const { register, onSubmit, handleSubmit, errors } = useCreateContainerForm();

  return (
    <div className="flex w-screen flex-col items-center justify-center">
      <H1>Add container</H1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "my-8 mx-8 flex h-full w-1/2 flex-col items-center",
          "justify-center gap-y-2 rounded-lg bg-slate-50 p-8",
          "shadow-md transition-all duration-300 hover:shadow-lg",
        )}
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
          errorMessage={errors.targetFillLevelInPercent?.message}
          id="targetFillLevelInPercent"
          register={register}
          valueAsNumber
          defaultValue={100}
        />

        <div className="flex items-center justify-center gap-x-4">
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
        </div>

        <Button variant="default" type="submit" className="w-3/4">
          Add container
        </Button>
      </form>
    </div>
  );
};

export default CreateContainerPage;
