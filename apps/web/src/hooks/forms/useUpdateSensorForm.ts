import { trpc } from "@/utils/trpc";
import { UpdateSensorSchema } from "@acme/api/src/schemas/sensor";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useToast } from "../toast/useToast";
import useZodForm from "../useZodForm";
import { Sensor } from "@acme/db";

/**
 * We use this schema to omit the `sensorId` from the form, because the `id` is passed in as a prop.
 * We keep this schema close to the custom hook so that it's easy to see what's going on.
 */
const UpdateSensorFormSchema = UpdateSensorSchema.omit({
  sensorId: true,
});

type UpdateSensorFormProps = {
  sensor?: Sensor;
  id: string;
  latitude?: number;
  longitude?: number;
};

/**
 * Handles logic related to updating a sensor.
 *
 * @returns all objects and handlers needed to update a sensor.
 */
const useUpdateSensorForm = ({
  sensor,
  id,
  latitude,
  longitude,
}: UpdateSensorFormProps) => {
  const { toast } = useToast();
  const { mutateAsync, isLoading } = trpc.sensor.update.useMutation({
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
  const [containerId, setContainerId] = useState<string | null | undefined>(
    sensor?.containerId,
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useZodForm({
    schema: UpdateSensorFormSchema,
    defaultValues: {
      containerId: sensor?.containerId || undefined,
      name: sensor?.name,
      latitude: sensor?.latitude,
      longitude: sensor?.longitude,
    },
  });

  console.log(getValues());

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

  useEffect(() => {
    if (!latitude) return;
    setValue("latitude", latitude);
  }, [latitude, setValue]);

  useEffect(() => {
    if (!longitude) return;
    setValue("longitude", longitude);
  }, [longitude, setValue]);

  useEffect(() => {
    if (!isLoading) return;
    toast({
      title: "Updating sensor...",
      severity: "loading",
    });
  }, [isLoading, toast]);

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
