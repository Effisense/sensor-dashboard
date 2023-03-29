import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useToast } from "../useToast";

type GetSensorProps = {
  id: string;
};

const useGetSensor = ({ id }: GetSensorProps) => {
  const router = useRouter();
  const { data, isLoading, error } = trpc.sensor.get.useQuery({ id });
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Oops!",
        description: `An error occurred: ${error.message}`,
        severity: "error",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      router.push("/404");
    }
  }, [error, router]);

  return {
    data,
    isLoading,
    error,
  };
};

export default useGetSensor;
