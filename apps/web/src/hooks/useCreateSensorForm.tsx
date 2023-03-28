import { trpc } from "@/utils/trpc";
import { SensorSchema } from "@acme/api/src/schemas/sensor";
import { useEffect } from "react";
import { z } from "zod";
import { useToast } from "./useToast";
import useZodForm from "./useZodForm";

/**
 * Handles logic related to creating a sensor.
 *
 * @returns all objects and handlers needed to create a sensor.
 */
const useCreateSensorForm = () => {
  const { mutateAsync, error } = trpc.sensor.create.useMutation();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm({
    schema: SensorSchema,
    defaultValues: {
      sensorId: "17fk1ja662n2g0",
      collectionId: "17fk1ja662n2g1",
      //use clfs020b60000vw6gbxhvli89 for containerTypeId
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

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
  };
};

export default useCreateSensorForm;
