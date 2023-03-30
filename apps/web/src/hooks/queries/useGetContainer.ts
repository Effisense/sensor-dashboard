import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useToast } from "../toast/useToast";

type GetContainerProps = {
  id: string;
};

const useGetContainer = ({ id }: GetContainerProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { data, isLoading, error } = trpc.container.get.useQuery({
    containerId: id,
  });

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

export default useGetContainer;
