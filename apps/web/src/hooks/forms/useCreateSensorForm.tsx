import { trpc } from "@/utils/trpc";
import { SensorSchema } from "@acme/api/src/schemas/sensor";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useToast } from "../useToast";
import useZodForm from "../useZodForm";

type CreateSensorFormProps = {
  sensorId: string;
  collectionId: string;
};

/**
 * Handles logic related to creating a sensor.
 *
 * @returns all objects and handlers needed to create a sensor.
 */
const useCreateSensorForm = ({
  sensorId,
  collectionId,
}: CreateSensorFormProps) => {
  const { mutateAsync, error } = trpc.sensor.create.useMutation();
  const { toast } = useToast();
  const [containerId, setContainerId] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useZodForm({
    schema: SensorSchema,
    defaultValues: {
      sensorId,
      collectionId,
    },
  });

  const onSubmit = async (data: z.infer<typeof SensorSchema>) => {
    await mutateAsync(data).then(() => {
      toast({
        title: "Success!",
        description: "Successfully added sensor.",
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

export default useCreateSensorForm;
