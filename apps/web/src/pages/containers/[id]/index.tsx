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
import { Textarea } from "@/ui/Textarea";
import H4 from "@/ui/typography/H4";
import LoadingSpinner from "@/ui/LoadingSpinner";

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
    return <LoadingSpinner />;
  }

  if (containerError || sensorsError || deleteContainerError) {
    return <div>Error</div>;
  }
  
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

  const handleDelete = async () => {
    try {
      await deleteContainer({ containerId: id });
      toast({
        title: "Success!",
        description: "Container was deleted. You will now be redirected to the dashboard",
        severity: "success",
      });
      router.push({
        pathname: "/",
      });
    } catch (error) {
      toast({
        title: "Error!",
        description: "There was an error while deleting the container",
        severity: "error",
      });
    }
  };  

  //TODO change textarea with card from tremor
  return (
    <div>
      <H1>{container.name}</H1>
      <div className="my-4 flex flex-col items-left justify-left">
      <H4>Height</H4>
      <p>{container.binHeightInMillimeters}</p>
      <H4>Width</H4>
      <p>{container.binWidthInMillimeters}</p>
      <H4>Volume</H4>
      <p>{container.containerVolumeInLiters}</p>
      <H4>Description</H4>
      <Textarea value={container.description} disabled />
      <H4>Sensors:</H4>
      <ul className="list-disc ml-8">
        {sensors.map((sensor) => (
          <li key={sensor.id}>
            <Link className="hover:underline" href={`../sensors/${sensor.id}`}>{sensor.name}</Link>
          </li>
        ))}
      </ul>
    </div>
    <div className="my-4 flex flex-row items-left justify-left gap-x-4">
      <Link href={`${id}/update`}>
      <Button variant="subtle">Update</Button>
    </Link>
      <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="subtle">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Once executed, this action cannot be reversed. It will permanently delete this container and remove it from all sensors that are currently using it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
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
