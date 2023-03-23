import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { Label } from "../../ui/Label";
import Map from "@/ui/Map";
import { Textarea } from "../../ui/Textarea";
import H4 from "@/ui/typography/H4";

interface FormData {
    collectionId: string,
    name: string,
    description: string,
    latitude: number,
    longitude: number,
    containerId: string,
  }

const CreateSensorPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = handleSubmit(data => console.log(data));

  return (
    <><div className="bg-slate-300 w-[400px] grid rounded-md mt-4 mb-8">
      
      <div className="mt-2 grid align-middle justify-center">
        <H4>Add sensor</H4>
      </div>
      
      <form onSubmit={onSubmit} className="grid gap-y-4 grid-cols-1 my-4 mb-8 align-middle justify-center items-center">
        <Label htmlFor="name">Name</Label>
        <Input className="bg-white align-middle justify-center w-3/4"  placeholder="Name" {...register("name")} />

        <Label htmlFor="containerId">Container ID</Label>
        <Input className="bg-white w-3/4"  placeholder="Container ID" {...register("containerId")} />

        <Label htmlFor="collectionId">Collection ID</Label>
        <Input className="bg-white w-3/4"  placeholder="Collection ID" {...register("collectionId")} />

        <Label htmlFor="description">Description</Label>
        <Textarea className="bg-white w-3/4" placeholder="Description"  {...register("description")}/>

        <Label htmlFor="nickname">Location</Label>
        <Map/>

        <Button variant="default" type="button" className="w-3/4">Add sensor</Button>
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
