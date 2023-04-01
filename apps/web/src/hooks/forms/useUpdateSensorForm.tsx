import { trpc } from "@/utils/trpc";
import { UpdateSensorSchema } from "@acme/api/src/schemas/sensor";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useToast } from "../toast/useToast";
import useZodForm from "../useZodForm";

/**
 * We use this schema to omit the `sensorId` from the form, because the `id` is passed in as a prop.
 * We keep this schema close to the custom hook so that it's easy to see what's going on.
 */
const UpdateSensorFormSchema = UpdateSensorSchema.omit({
  sensorId: true,
});

type UpdateSensorFormProps = {
  id: string;
};

/**
 * Handles logic related to updating a sensor.
 *
 * @returns all objects and handlers needed to update a sensor.
 */
const useUpdateSensorForm = ({ id }: UpdateSensorFormProps) => {
  const { toast } = useToast();
  const { mutateAsync } = trpc.sensor.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Successfully updated sensor.",
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
  const [containerId, setContainerId] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useZodForm({
    schema: UpdateSensorFormSchema,
  });

  const onSubmit = async (data: z.infer<typeof UpdateSensorFormSchema>) => {
    await mutateAsync({
      sensorId: id,
      ...data,
    });
  };

  // Whenever the containerId changes in the dropdown menu, update the form value.
  useEffect(() => {
    if (!containerId) return;
    setValue("containerId", containerId);
  }, [containerId, setValue]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    containerId,
    setContainerId,
  };
};

export default useUpdateSensorForm;
