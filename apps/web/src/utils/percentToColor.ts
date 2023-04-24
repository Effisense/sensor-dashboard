type PercentToColorProps = "emerald" | "amber" | "orange" | "rose" | "neutral";

type PercentToColorPropsHex =
  | "#10b981"
  | "#f59e0b"
  | "#f97316"
  | "#f43f5e"
  | "#737373";

const noColor: PercentToColorProps = "neutral";
const noColorHex: PercentToColorPropsHex = "#737373";

export default function percentToColorTremor(
  input: number | null,
): PercentToColorProps {
  if (input === null) {
    return noColor;
  }

  let color: PercentToColorProps;

  if (input >= 0 && input < 50) {
    color = "emerald";
  } else if (input >= 50 && input < 75) {
    color = "amber";
  } else if (input >= 75 && input <= 90) {
    color = "orange";
  } else if (input >= 90 && input <= 100) {
    color = "rose";
  } else {
    color = "neutral";
  }

  return color;
}

export function percentToColorHex(
  input: number | null,
): PercentToColorPropsHex {
  if (input === null) {
    return noColorHex;
  }

  let color: PercentToColorPropsHex;

  if (input >= 0 && input < 50) {
    color = "#10b981";
  } else if (input >= 50 && input < 75) {
    color = "#f59e0b";
  } else if (input >= 75 && input <= 90) {
    color = "#f97316";
  } else if (input >= 90 && input <= 100) {
    color = "#f43f5e";
  } else {
    color = "#737373";
  }

  return color;
}
