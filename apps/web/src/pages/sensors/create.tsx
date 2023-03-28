import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { Label } from "../../ui/Label";
import CreateSensorMap from "@/ui/Map";
import { Textarea } from "../../ui/Textarea";
import H1 from "@/ui/typography/H1";
import useCreateSensorForm from "@/hooks/useCreateSensorForm";
import Subtle from "@/ui/typography/Subtle";

const CreateSensorPage = () => {
  const { register, onSubmit, handleSubmit, errors } = useCreateSensorForm();

  return (
    <div className="flex flex-col items-center justify-center">
      <H1>Add sensor</H1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="my-8 flex flex-col items-center justify-center gap-y-8"
      >
        <div className="flex w-full flex-col items-start justify-start gap-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            className="bg-white"
            placeholder="Name"
            {...register("name")}
          />
          <Subtle className="h-4 w-full text-red-500">
            {errors.name?.message}
          </Subtle>
        </div>

        <div className="flex w-full flex-col items-start justify-start gap-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            className="bg-white"
            placeholder="Description"
            {...register("description")}
          />
          <Subtle className="h-4 w-full text-red-500">
            {errors.description?.message}
          </Subtle>
        </div>

        {/* TODO: Remove this input field, and get it from a dropdown menu */}
        <div className="flex w-full flex-col items-start justify-start gap-y-2">
          <Label htmlFor="containerId">Container ID</Label>
          <Input
            className="bg-white"
            placeholder="Container ID"
            {...register("containerTypeId")}
          />
          <Subtle className="h-4 w-full text-red-500">
            {errors.containerTypeId?.message}
          </Subtle>
        </div>

        <div className="flex w-full flex-col items-start justify-start gap-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            className="bg-white"
            placeholder="Latitude"
            {...register("latitude", {
              valueAsNumber: true,
            })}
            type="number"
          />
          <Subtle className="h-4 w-full text-red-500">
            {errors.latitude?.message}
          </Subtle>
        </div>

        <div className="flex w-full flex-col items-start justify-start gap-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            className="bg-white"
            placeholder="Longitude"
            {...register("longitude", {
              valueAsNumber: true,
            })}
            type="number"
          />
          <Subtle className="h-4 w-full text-red-500">
            {errors.longitude?.message}
          </Subtle>
        </div>

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
