import { toast } from "@/hooks/toast/useToast";
import { Button } from "@/ui/Button";
import H1 from "@/ui/typography/H1";
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

type SensorPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SensorPage = ({ id }: SensorPageProps) => {
  
  const router = useRouter();

  const {
    data: sensor,
    isLoading: sensorIsLoading,
    error: sensorError,
  } = trpc.sensor.get.useQuery({ id });
  const {
    data: containerData,
    isLoading: containerIsLoading,
    error: containerError,
  } = trpc.container.getAll.useQuery();
  const {
    mutate: deleteSensor,
    isLoading: deleteSensorIsLoading,
    error: deleteSensorError,
  } = trpc.sensor.delete.useMutation();
  
  if (sensorIsLoading || deleteSensorIsLoading || containerIsLoading) {
    return <LoadingSpinner />;
  }

  if (sensorError) {
    return <div>sensorError {sensorError.message}</div>;
  }

  if (containerError) {
    return <div>containerError {containerError.message}</div>;
  }

  if (deleteSensorError) {
    return <div>deleteSensorError {deleteSensorError.message}</div>;
  }

  const handleDelete = async () => {
    try {
      await deleteSensor({ sensorId: id });
      toast({
        title: "Success!",
        description: "Sensor was deleted. You will now be redirected to the dashboard",
        severity: "success",
      });
      router.push({
        pathname: "/",
      });
    } catch (error) {
      toast({
        title: "Error!",
        description: "There was an error while deleting the sensor",
        severity: "error",
      });
    }
  };  

  const container = containerData?.find((c) => c.id === sensor.sensor.containerId);

  return (
    <div>
      <H1>{sensor.sensor.name}</H1>
      <div className="my-4 flex flex-col items-left justify-left">
      <H4>Location</H4>
      <p>{sensor.sensor.location}</p>
      <H4>Container</H4>
      {container ? (
        <><Link className="hover:underline" href={`../containers/${sensor.sensor.containerId}`}>{container.name}</Link>
        </>
      ) : (
      <span>
        No container
      </span>
      )}
      <H4>Description</H4>
      <Textarea value={sensor.sensor.description} disabled />
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
            Once executed, this action cannot be reversed. It will permanently delete this sensor.
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

export default SensorPage;
