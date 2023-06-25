type PercentToColorProps = "emerald" | "amber" | "orange" | "rose" | "neutral";

export default function percentToColorTremor(
  input: number | null,
): PercentToColorProps {
  if (input === null) return "neutral";
  if (input >= 0 && input < 50) return "emerald";
  if (input >= 50 && input < 75) return "amber";
  if (input >= 75 && input <= 90) return "orange";
  if (input >= 90 && input <= 100) return "rose";
  return "neutral";
}

export function percentToSeverity(
  input: number | null,
): "success" | "warning" | "error" | "neutral" {
  if (input === null) return "neutral";
  if (input >= 0 && input < 50) return "success";
  if (input >= 50 && input < 75) return "warning";
  if (input >= 75 && input <= 90) return "warning";
  if (input >= 90 && input <= 100) return "error";
  return "neutral";
}
