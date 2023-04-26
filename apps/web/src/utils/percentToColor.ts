type PercentToColorProps = "emerald" | "amber" | "orange" | "rose" | "neutral";

type PercentToColorPropsHex =
  | "#10b981"
  | "#f59e0b"
  | "#f97316"
  | "#f43f5e"
  | "#cbd5e1";

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

export function percentToColorHex(
  input: number | null,
): PercentToColorPropsHex {
  if (input === null) return "#cbd5e1";
  if (input >= 0 && input < 50) return "#10b981";
  if (input >= 50 && input < 75) return "#f59e0b";
  if (input >= 75 && input <= 90) return "#f97316";
  if (input >= 90 && input <= 100) return "#f43f5e";
  return "#cbd5e1";
}
