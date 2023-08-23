const formatFillLevel = (fillLevel?: number | null): "N/A" | string => {
  if (fillLevel === undefined || fillLevel === null) return "N/A";
  return `${fillLevel.toFixed(0)} %`;
};

export default formatFillLevel;
