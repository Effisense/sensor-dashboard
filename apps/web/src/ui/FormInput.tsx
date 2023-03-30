import capitalize from "@/utils/capitalize";
import { Label } from "@radix-ui/react-label";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { Input } from "./Input";
import Subtle from "./typography/Subtle";

type FormInputProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  errorMessage?: string;
  id: Path<T>;
  label: string;
  valueAsNumber?: boolean;
  defaultValue?: string | number | null;
};

/**
 * Form component for input fields using React Hook Form.
 *
 * The component is generic, allowing you to specify the type of the form values.
 *
 * @example <FormInput label="Name" errorMessage={errors.name?.message} id="name" register={register} />
 *
 * @param params is an object containing the necessary parameters for the component.
 * @returns a form input component.
 */
const FormInput = <T extends FieldValues>({
  register,
  errorMessage,
  id,
  label,
  valueAsNumber,
  defaultValue,
}: FormInputProps<T>) => {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-2">
      <Label htmlFor={id}>{capitalize(label)}</Label>
      <Input
        className="bg-white"
        placeholder={capitalize(label)}
        {...register(id, {
          valueAsNumber: valueAsNumber || false,
        })}
        defaultValue={defaultValue || undefined}
      />
      <Subtle className="h-4 w-full text-red-500">{errorMessage}</Subtle>
    </div>
  );
};

export default FormInput;
