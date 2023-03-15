export const sensorToFillLevel = (sensorValue: number): number => {
  // TODO: Implement this function
  return Math.round((sensorValue / 1023) * 100);
};
