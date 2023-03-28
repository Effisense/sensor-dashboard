import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";
import { Button } from "../../ui/Button";
import CreateSensorMap from "@/ui/Map";
import H1 from "@/ui/typography/H1";
import useCreateSensorForm from "@/hooks/forms/useCreateSensorForm";
import FormInput from "@/ui/FormInput";
import FormTextarea from "@/ui/FormTextarea";
import { trpc } from "@/utils/trpc";
import SelectContainerDropdown from "@/ui/containers/SelectContainerDropdown";

const CreateSensorPage = () => {
  const {
    register,
    onSubmit,
    handleSubmit,
    errors,
    containerId,
    setContainerId,
  } = useCreateSensorForm();
  const { data, isLoading } = trpc.container.getAll.useQuery();

  return (
    <div className="flex flex-col items-center justify-center">
      <H1>Add sensor</H1>

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
          register={register}
          id="description"
          errorMessage={errors.description?.message}
          label="Description"
        />

        <SelectContainerDropdown
          containerId={containerId}
          setContainerId={setContainerId}
          data={data}
          isLoading={isLoading}
        />

        <FormInput
          register={register}
          id="latitude"
          label="Latitude"
          errorMessage={errors.latitude?.message}
          valueAsNumber
        />

        <FormInput
          register={register}
          id="longitude"
          label="Longitude"
          errorMessage={errors.longitude?.message}
          valueAsNumber
        />

        <CreateSensorMap />

        <Button variant="default" type="submit" className="w-3/4">
          Add sensor
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
        destination: "/sign-in?redirect=/sensors/create",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default CreateSensorPage;
