import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";
import { useForm, UseFormProps } from "react-hook-form";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { Label } from "../../ui/Label";
import Map from "@/ui/Map";
import { Textarea } from "../../ui/Textarea";
import H4 from "@/ui/typography/H4";
import { zodResolver } from "@hookform/resolvers/zod";
import { SensorSchema } from "@acme/api/src/schemas/sensor";
import { trpc } from "@/utils/trpc";

import {z} from "zod"

  type SensorForm = z.infer<typeof SensorSchema>

  function useZodForm<TSchema extends z.ZodType>(
    props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & {
      schema: TSchema;
    },
  ) {
    const form = useForm<TSchema['_input']>({
      ...props,
      resolver: zodResolver(props.schema, undefined),
    });
  
    return form;
  }

const CreateSensorPage = () => {

  const createSensorMutation = trpc.sensor.create.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useZodForm({
    schema: SensorSchema,
    defaultValues:{
      sensorId: "17fk1ja662n2g0",
      collectionId: "17fk1ja662n2g1",
      //use clfs020b60000vw6gbxhvli89 for containerTypeId
    }
  });

  console.log(errors)

  //triggered when the form is submitted
  const onSubmit = async (data: SensorForm) => {
    console.log(data)
    try {      
      await createSensorMutation.mutateAsync(data);
    } catch (error) {
      // handle error
      console.log(error)
    }
  };

  return (
    <><div className="bg-slate-300 w-[400px] rounded-md mt-4 mb-8">
      <div className="mt-2 grid align-middle justify-center">
        <H4>Add sensor</H4>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center my-4 mb-8 gap-y-4">

          <Label htmlFor="name" className="mr-44 w-36">Name</Label>
          <Input className="bg-white w-10/12" placeholder="Name" {...register("name")} />

          <Label htmlFor="description" className="mr-44 w-36">Description</Label>
          <Textarea className="bg-white w-10/12" placeholder="Description" {...register("description")} />

          <Label htmlFor="containerId" className="mr-44  w-36">Container ID</Label>
          <Input className="bg-white w-10/12" placeholder="Container ID" {...register("containerTypeId")} />

          <Label htmlFor="latitude" className="mr-44  w-36">Latitude</Label>
          <Input className="bg-white w-10/12" placeholder="Latitude" {...register("latitude", {
            valueAsNumber: true
          })} type="number" />

          <Label htmlFor="longitude" className="mr-44  w-36">Longitude</Label>
          <Input className="bg-white w-10/12" placeholder="Longitude" {...register("longitude", {
            valueAsNumber: true
          })} type="number" />

          <Map />

        <Button variant="default" type="submit" className="w-3/4">Add sensor</Button>
      </form> 
    </div>
      </>
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
