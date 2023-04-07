import { trpc } from "@/utils/trpc";
import { ContainerFormSchema } from "@acme/api/src/schemas/container";
import { z } from "zod";
import { useToast } from "../toast/useToast";
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
  const { mutateAsync } = trpc.container.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Successfully updated container.",
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
    });
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
  };
};

export default useUpdateContainerForm;
