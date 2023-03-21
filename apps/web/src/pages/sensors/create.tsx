import H1 from "@/ui/typography/H1";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { Textarea } from "../../ui/Textarea";
import H3 from "@/ui/typography/H3";
import H4 from "@/ui/typography/H4";

interface IFormInput {
    nickname: string,
    description: string,
    latitude: string,
    longitude: string,
    collectionId: string,
  }

const CreateSensorPage = () => {
    const { control, handleSubmit } = useForm({
        defaultValues: {
          nickname: '',
          description: '',
          latitude: '',
          longitude: '',
          collectionId: '',
        }
    });

      
    const onSubmit: SubmitHandler<IFormInput> = data => {
        console.log(data)
    };

  return (
    <><div className="bg-slate-300 min-w-[400px] justify-center align-middle grid rounded-md mt-4">
      
      <div className="mt-4 grid align-middle justify-center">
          <H4>Add sensor</H4>
      </div>
     
      <form onSubmit={handleSubmit(onSubmit)} className="w-[320px] grid gap-x-8 gap-y-4 grid-cols-1 my-11 justify-center align-middle">
      <Controller
        name="nickname"
        control={control}
        render={({ field }) => <Input className="bg-white" placeholder="Name" {...field} />}
      />
        <Controller
        name="description"
        control={control}
        render={({ field }) => <Textarea className="bg-white" placeholder="Description" {...field} />}
      />
        <Controller
        name="latitude"
        control={control}
        render={({ field }) => <Input className="bg-white"  placeholder="Location" {...field} />}
      />
        <Controller
        name="collectionId"
        control={control}
        render={({ field }) => <Input className="bg-white"  placeholder="Collection ID" {...field} />}
      />
      <Button variant="default" type="submit">Create sensor</Button>
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
