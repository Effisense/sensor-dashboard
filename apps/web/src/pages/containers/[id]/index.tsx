import { toast } from "@/hooks/toast/useToast";
import { Button } from "@/ui/Button";
import H1 from "@/ui/typography/H1";
import Subtle from "@/ui/typography/Subtle";
import { trpc } from "@/utils/trpc";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/AlertDialog"

type ContainerPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const ContainerPage = ({ id }: ContainerPageProps) => {

  const router = useRouter();
  const {
    data: container,
    isLoading: containerIsLoading,
    error: containerError,
  } = trpc.container.get.useQuery({
    containerId: id,
  });
  const {
    data: sensors,
    isLoading: sensorsIsLoading,
    error: sensorsError,
  } = trpc.container.getSensorsByContainerId.useQuery({
    containerId: id,
  });

  const {
    mutate: deleteContainer,
    isLoading: deleteContainerIsLoading,
    error: deleteContainerError,
  } = trpc.container.delete.useMutation();


  if (containerIsLoading || sensorsIsLoading || deleteContainerIsLoading) {
    return <div>Loading...</div>;
  }

  if (containerError || sensorsError || deleteContainerError) {
    return <div>Error</div>;
  }

  const handleDelete = async () => {
    try {
      await deleteContainer({ containerId: id });
      toast({
        title: "Success!",
        description: "Container was deletedy. You will now be redirected to the dashboard",
        severity: "success",
      });
      router.push({
        pathname: "/",
      });
    } catch (error) {
      // Handle the error, for example:
      console.error("Failed to delete container:", error);
      toast({
        title: "Error!",
        description: "There was an error while deleting the container",
        severity: "error",
      });
    }
  };  

  if (!container) {
    return     <div className="flex flex-col items-center justify-center gap-y-4">
    <H1>Oh no!</H1>
    <Subtle>
      It looks like the container you&apos;re looking for doesn&apos;t exist.
    </Subtle>
    <Link href="/">
      <Button variant="subtle">Return home</Button>
    </Link>
  </div>;
  }

  return (
    <div>
      <H1>{container.name}</H1>
      <p>Height: {container.binHeightInMillimeters}</p>
      <p>Width: {container.binWidthInMillimeters}</p>
      <p>Volume: {container.containerVolumeInLiters}</p>
      <p>Description: {container.description}</p>
      <p>Sensors:</p>
      <ul>
        {sensors.map((sensor) => (
          <li key={sensor.id}>
            {sensor.name} 
          </li>
        ))}
      </ul>
      <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Delete Container</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Once executed, this action cannot be reversed. It will permanently delete the container and remove it from all sensors that are currently using it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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

export default ContainerPage;
