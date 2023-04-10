import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useToast } from "../toast/useToast";

type GetContainerProps = {
  id: string;
};

const useGetContainer = ({ id }: GetContainerProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { data, isLoading, error } = trpc.container.get.useQuery(
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

  return {
    data,
    isLoading,
    error,
  };
};

export default useGetContainer;
