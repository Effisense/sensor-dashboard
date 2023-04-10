import { toast } from "@/hooks/toast/useToast";
import { Button } from "@/ui/Button";
import H1 from "@/ui/typography/H1";
import Subtle from "@/ui/typography/Subtle";
import { trpc } from "@/utils/trpc";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Textarea } from "@/ui/Textarea";
import H4 from "@/ui/typography/H4";
import LoadingSpinner from "@/ui/LoadingSpinner";
import DeleteContainerAlert from "@/ui/containers/DeleteContainerAlert";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

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
    return (
      <div className="flex flex-col items-center justify-center gap-y-4">
        <H1>Oh no!</H1>
        <Subtle>
          It looks like the container you&apos;re looking for doesn&apos;t
          exist.
        </Subtle>
        <Link href="/">
          <Button variant="subtle">Return home</Button>
        </Link>
      </div>
    );
  }

  const onDelete = async () => {
    try {
      await deleteContainer({ containerId: id });
      toast({
        title: "Success!",
        description:
          "Container was deleted. You will now be redirected to the dashboard",
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

  // TODO: change textarea with card from tremor
  return (
    <div>
      <H1>{container.name}</H1>
      <div className="items-left justify-left my-4 flex flex-col">
        <H4>Height</H4>
        <p>{container.binHeightInMillimeters}</p>
        <H4>Width</H4>
        <p>{container.binWidthInMillimeters}</p>
        <H4>Volume</H4>
        <p>{container.containerVolumeInLiters}</p>
        <H4>Description</H4>
        <Textarea value={container.description} disabled />
        <H4>Sensors:</H4>
        <ul className="ml-8 list-disc">
          {sensors.map((sensor) => (
            <li key={sensor.id}>
              <Link
                className="hover:underline"
                href={`/dashboard/sensors/${sensor.id}`}
              >
                {sensor.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="items-left justify-left my-4 flex flex-row gap-x-4">
        <Link href={`/dashboard/containers/${id}/update`}>
          <Button
            variant="subtle"
            className="flex items-center justify-center gap-x-2"
          >
            <PencilIcon className="w-4" />
            <span>Update</span>
          </Button>
        </Link>

        <DeleteContainerAlert
          trigger={
            <Button
              variant="subtle"
              className="flex items-center justify-center gap-x-2"
            >
              <TrashIcon className="w-4" />
              <span>Delete</span>
            </Button>
          }
          onDelete={onDelete}
        />
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
