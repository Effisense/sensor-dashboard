import capitalize from "@/utils/capitalize";
import { Label } from "@radix-ui/react-label";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { Textarea } from "./Textarea";
import Subtle from "./typography/Subtle";

type FormTextareaProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  errorMessage?: string;
  id: Path<T>;
  label: string;
};

/**
 * Form component for textarea fields using React Hook Form.
 *
 * The component is generic, allowing you to specify the type of the form values.
 *
 * @example <FormInput label="Name" errorMessage={errors.name?.message} id="name" register={register} />
 *
 * @param params is an object containing the necessary parameters for the component.
 * @returns a form textarea component.
 */
const FormTextarea = <T extends FieldValues>({
  register,
  errorMessage,
  id,
  label,
}: FormTextareaProps<T>) => {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-2">
      <Label htmlFor={id}>{capitalize(label)}</Label>
      <Textarea
        className="bg-white"
        placeholder={capitalize(label)}
        {...register(id)}
      />
      <Subtle className="h-4 w-full text-red-500">{errorMessage}</Subtle>
    </div>
  );
};

export default FormTextarea;
