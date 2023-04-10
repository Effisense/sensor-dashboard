import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { toast } from "../toast/useToast";

type GetSensorProps = {
  id: string;
};

const useGetSensor = ({ id }: GetSensorProps) => {
  const router = useRouter();
  const {
    data,
    isLoading: sensorIsLoading,
    error,
  } = trpc.sensor.get.useQuery(
    { id },
    {
      onError: (err) => {
        if (err.data?.code === "NOT_FOUND") {
          router.push("/404");
          return;
        }

        toast({
          title: "Error!",
          description: "There was an error while fetching the sensor",
          severity: "error",
        });
      },
    },
  );

  const {
    mutateAsync: deleteSensorMutation,
    isLoading: deleteSensorIsLoading,
  } = trpc.sensor.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description:
          "Sensor was deleted. You will now be redirected to the dashboard.",
        severity: "success",
      });

      router.push("/");
    },
    onError: () => {
      toast({
        title: "Error!",
        description: "There was an error while deleting the sensor",
        severity: "error",
      });
    },
  });

  const isLoading = sensorIsLoading || deleteSensorIsLoading;

  return {
    data,
    isLoading,
    error,
    deleteSensorMutation,
  };
};

export default useGetSensor;
