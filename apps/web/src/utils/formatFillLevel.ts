const formatFillLevel = (fillLevel?: number | null): "N/A" | string => {
  if (fillLevel === undefined || fillLevel === null) return "N/A";
  return `${fillLevel.toFixed(1)} %`;
};

export default formatFillLevel;
