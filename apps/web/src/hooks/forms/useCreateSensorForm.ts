import { trpc } from "@/utils/trpc";
import { SensorSchema } from "@acme/api/src/schemas/sensor";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useToast } from "../toast/useToast";
import useZodForm from "../useZodForm";
import { useRouter } from "next/router";

type CreateSensorFormProps = {
  sensorId: string;
  collectionId: string;
  latitude?: number;
  longitude?: number;
};

/**
 * Handles logic related to creating a sensor.
 *
 * @returns all objects and handlers needed to create a sensor.
 */
const useCreateSensorForm = ({
  sensorId,
  collectionId,
  latitude,
  longitude,
}: CreateSensorFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { mutateAsync, isLoading } = trpc.sensor.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Successfully added sensor.",
        severity: "success",
      });

      router.push("/");
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

  useEffect(() => {
    if (!isLoading) return;
    toast({
      title: "Creating sensor...",
      severity: "loading",
    });
  }, [isLoading, toast]);

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
    await mutateAsync(data);
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
