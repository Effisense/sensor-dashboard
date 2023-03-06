import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function to merge tailwind classes with clsx.
 *
 * @param inputs is a list of tailwind classes and clsx classes.
 * @returns a string of merged tailwind classes and clsx classes.
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
