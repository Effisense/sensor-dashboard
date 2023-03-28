import { trpc } from "@/utils/trpc";
import { CreateContainerSchema } from "@acme/api/src/schemas/container";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { z } from "zod";
import { useToast } from "../useToast";
import useZodForm from "../useZodForm";

/**
 * Handles logic related to creating a container.
 *
 * @returns all objects and handlers needed to create a container.
 */
const useCreateContainerForm = () => {
  const { mutateAsync, error } = trpc.container.create.useMutation();
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm({
    schema: CreateContainerSchema,
  });

  const onSubmit = async (data: z.infer<typeof CreateContainerSchema>) => {
    await mutateAsync(data).then(() => {
      toast({
        title: "Success!",
        description: "Successfully added container.",
      });
    });

    // If there is a `redirect` query param, redirect to that page including all query params.
    if (router.query.redirect) {
      router.push(router.query.redirect as string, undefined, {
        shallow: true,
      });
    }
  };

  useEffect(() => {
    if (error) {
      toast({
        title: "Oops!",
        description: `An error occurred: ${error.message}`,
        severity: "error",
      });
    }
  }, [error, toast]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
  };
};

export default useCreateContainerForm;
