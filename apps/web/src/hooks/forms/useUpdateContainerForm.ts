import { trpc } from "@/utils/trpc";
import { ContainerFormSchema } from "@acme/api/src/schemas/container";
import { z } from "zod";
import { useToast } from "../toast/useToast";
import useZodForm from "../useZodForm";
import { useEffect } from "react";
import { useRouter } from "next/router";

type UpdateContainerFormProps = {
  id: string;
};

/**
 * Handles logic related to updating a container.
 *
 * @returns all objects and handlers needed to update a container.
 */
const useUpdateContainerForm = ({ id }: UpdateContainerFormProps) => {
  const router = useRouter();

  const { mutateAsync, isLoading } = trpc.container.update.useMutation({
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
    }).then(async (container) => {
      await router.push(`/containers/${container.id}`);
    });
  };

  useEffect(() => {
    if (!isLoading) return;
    toast({
      title: "Updating container...",
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

export default useUpdateContainerForm;
