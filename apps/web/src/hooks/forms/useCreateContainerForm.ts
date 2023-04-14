import { trpc } from "@/utils/trpc";
import { ContainerFormSchema } from "@acme/api/src/schemas/container";
import { useRouter } from "next/router";
import { z } from "zod";
import { useToast } from "../toast/useToast";
import useZodForm from "../useZodForm";
import { useEffect } from "react";

/**
 * Handles logic related to creating a container.
 *
 * @returns all objects and handlers needed to create a container.
 */
const useCreateContainerForm = () => {
  const { mutateAsync, isLoading } = trpc.container.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Successfully added container.",
        severity: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Oops!",
        description: `An error occurred: ${error.message}`,
        severity: "error",
      });
    },
  });
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm({
    schema: ContainerFormSchema,
  });

  const onSubmit = async (data: z.infer<typeof ContainerFormSchema>) => {
    await mutateAsync(data);

    // If there is a `redirect` query param, redirect to that page including all query params.
    if (router.query.redirect) {
      router.push(router.query.redirect as string, undefined, {
        shallow: true,
      });
    }
  };

  useEffect(() => {
    if (!isLoading) return;
    toast({
      title: "Creating container...",
      severity: "loading",
    });
  }, [isLoading, toast]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
  };
};

export default useCreateContainerForm;
