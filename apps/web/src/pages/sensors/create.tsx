import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";
import { Button } from "../../ui/Button";
import CreateSensorMap from "@/ui/Map";
import H1 from "@/ui/typography/H1";
import useCreateSensorForm from "@/hooks/forms/useCreateSensorForm";
import FormInput from "@/ui/FormInput";
import FormTextarea from "@/ui/FormTextarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuHeading,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/DropdownMenu";
import Link from "next/link";
import { useState } from "react";
import { trpc } from "@/utils/trpc";

const CreateSensorPage = () => {
  const { register, onSubmit, handleSubmit, errors } = useCreateSensorForm();
  const [containerId, setContainerId] = useState<string | undefined>(undefined);
  const { data, isLoading, error } = trpc.container.getAll.useQuery();

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

        {/* TODO: Remove this input field, and get it from a dropdown menu */}
        <FormInput
          register={register}
          id="containerId"
          label="Container identifier"
          errorMessage={errors.containerId?.message}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Select container</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuHeading>Select container</DropdownMenuHeading>
            <DropdownMenuSeparator />

            {data && data.length > 0 ? (
              <>
                <DropdownMenuRadioGroup
                  value={containerId}
                  onValueChange={setContainerId}
                >
                  {data?.map((container) => (
                    <DropdownMenuRadioItem
                      value={container.id}
                      key={container.id}
                    >
                      {container.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
              </>
            ) : (
              <>
                <DropdownMenuLabel>No containers found</DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem>
              <Link
                href={{
                  pathname: "/containers/create",
                  // TODO: Add query params to redirect back to this page and include the deviceId and collectionId, just like in /scan
                }}
              >
                Add new container
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
