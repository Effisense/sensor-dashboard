import { TRPCClientErrorBase } from "@trpc/client";
import { DefaultErrorShape } from "@trpc/server";
import { useEffect } from "react";
import { useToast } from "./useToast";

type ErrorToastProps<T extends DefaultErrorShape> = {
  error: TRPCClientErrorBase<T> | null;
};

const useErrorToast = <T extends DefaultErrorShape>({
  error,
}: ErrorToastProps<T>) => {
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
};

export default useErrorToast;
