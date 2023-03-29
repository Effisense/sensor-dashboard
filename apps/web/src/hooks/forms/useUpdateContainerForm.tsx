import { trpc } from "@/utils/trpc";
import { ContainerFormSchema } from "@acme/api/src/schemas/container";
import { useEffect } from "react";
import { z } from "zod";
import { useToast } from "../useToast";
import useZodForm from "../useZodForm";

type UpdateContainerFormProps = {
  id: string;
};

/**
 * Handles logic related to updating a container.
 *
 * @returns all objects and handlers needed to update a container.
 */
const useUpdateContainerForm = ({ id }: UpdateContainerFormProps) => {
  const { mutateAsync, error } = trpc.container.update.useMutation();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm({
    schema: ContainerFormSchema,
  });

  const onSubmit = async (data: z.infer<typeof ContainerFormSchema>) => {
    await mutateAsync({
      containerId: id,
      ...data,
    }).then(() => {
      toast({
        title: "Success!",
        description: "Successfully updated container.",
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

export default useUpdateContainerForm;
