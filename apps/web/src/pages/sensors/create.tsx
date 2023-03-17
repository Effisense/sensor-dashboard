import H1 from "@/ui/typography/H1";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { Textarea } from "../../ui/Textarea";

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
    <><div>
          <H1>Create sensor</H1>
      </div>
     
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-x-8 gap-y-4 grid-cols-1 my-11 justify-center align-middle">
      <Controller
        name="nickname"
        control={control}
        render={({ field }) => <Input placeholder="Nickname" {...field} />}
      />
        <Controller
        name="description"
        control={control}
        render={({ field }) => <Textarea placeholder="Description" {...field} />}
      />
        <Controller
        name="latitude"
        control={control}
        render={({ field }) => <Input placeholder="Latitude" {...field} />}
      />
        <Controller
        name="longitude"
        control={control}
        render={({ field }) => <Input placeholder="Longitude" {...field} />}
      />
        <Controller
        name="collectionId"
        control={control}
        render={({ field }) => <Input placeholder="Collection ID" {...field} />}
      />
      <Button variant="default" type="submit">Create sensor</Button>
    </form>

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
