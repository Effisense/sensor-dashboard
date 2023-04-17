import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useToast } from "../toast/useToast";

type GetContainerWithSensorsProps = {
  id: string;
};

const useGetContainerWithSensors = ({ id }: GetContainerWithSensorsProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const { data: container, isLoading: containerIsLoading } =
    trpc.container.get.useQuery(
      {
        containerId: id,
      },
      {
        onError: (err) => {
          if (err.data?.code === "NOT_FOUND") {
            router.push("/404");
            return;
          }

          toast({
            title: "Error!",
            description: "There was an error while fetching the container",
            severity: "error",
          });
        },
      },
    );
  const { data: sensors, isLoading: sensorsIsLoading } =
    trpc.container.getSensorsByContainerId.useQuery(
      {
        containerId: id,
      },
      {
        onError: () => {
          toast({
            title: "Error!",
            description: "There was an error while fetching the sensors",
            severity: "error",
          });
        },
      },
    );

  const {
    mutateAsync: deleteContainerMutation,
    isLoading: deleteContainerIsLoading,
  } = trpc.container.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description:
          "Container was deleted. You will now be redirected to the dashboard",
        severity: "success",
      });

      router.push("/");
    },
    onError: () => {
      toast({
        title: "Error!",
        description: "There was an error while deleting the container",
        severity: "error",
      });
    },
  });

  useEffect(() => {
    if (!deleteContainerIsLoading) return;
    toast({
      title: "Deleting continaer...",
      severity: "loading",
    });
  }, [deleteContainerIsLoading, toast]);

  const loading =
    containerIsLoading || sensorsIsLoading || deleteContainerIsLoading;

  return {
    container,
    sensors,
    loading,
    deleteContainerMutation,
  };
};

export default useGetContainerWithSensors;
