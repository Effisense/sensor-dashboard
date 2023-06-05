const formatFillLevel = (fillLevel?: number | null): "N/A" | string => {
  if (!fillLevel) return "N/A";
  return `${fillLevel} %`;
};

export default formatFillLevel;
