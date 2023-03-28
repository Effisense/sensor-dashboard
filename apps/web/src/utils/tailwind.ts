import { Severity } from "@/types";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { green, red, slate, blue, yellow } from "tailwindcss/colors";

/**
 * A utility function to merge tailwind classes with clsx.
 *
 * @param inputs is a list of tailwind classes and clsx classes.
 * @returns a string of merged tailwind classes and clsx classes.
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const severityToTailwindColor = (severity?: Severity) => {
  switch (severity) {
    case "success":
      return green["500"];
    case "error":
      return red["500"];
    case "info":
      return blue["500"];
    case "warning":
      return yellow["500"];
    default:
      return slate["100"];
  }
};
