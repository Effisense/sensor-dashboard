import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormProps, useForm } from "react-hook-form";
import { z } from "zod";

/**
 * Wrapper around React Hook Form's `useForm` that uses Zod for validation.
 *
 * @param props the props to pass to `useForm`, with the addition of a `schema` prop
 * @returns the form
 */
const useZodForm = <TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema;
  },
) => {
  const form = useForm<TSchema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  });

  return form;
};

export default useZodForm;
