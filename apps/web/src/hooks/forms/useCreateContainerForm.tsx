import { trpc } from "@/utils/trpc";
import { CreateContainerSchema } from "@acme/api/src/schemas/container";
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
