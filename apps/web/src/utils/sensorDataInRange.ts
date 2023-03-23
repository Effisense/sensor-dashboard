export const getScale = (arr: number[][], height: number, offset: number) => {
  const medianValue = getMedianValue(arr);
  const maxScaleValue = height - offset;
  const difference = Math.abs(medianValue - offset);

  // Calculate the scale from 0 - 100%
  const scale = Math.max(
    0,
    Math.min(100, ((maxScaleValue - difference) / maxScaleValue) * 100),
  );
  return scale;
};

const arrayIsSquare = (arr: number[][]) => {
  return arr.length === arr[0]?.length;
};

const getMedianValue = (array: number[][]) => {
  const middlePoints = [];

  // Check if the input array is square
  if (!arrayIsSquare(array)) {
    throw new Error("Array must be square");
  }

  // Get the middle points of the array
  for (let i = 1; i < array.length - 1; i++) {
    for (let j = 1; j < array.length - 1; j++) {
      const row = array[i];
      if (!row) continue;

      const col = row[j];
      if (!col) continue;

      middlePoints.push(col);
    }
  }

  // Sort the middle points
  middlePoints.sort((a, b) => a - b);

  // Get the median value
  const medianIndex = Math.floor(middlePoints.length / 2);
  const medianValue = middlePoints[medianIndex];

  if (!medianValue) {
    throw new Error("Median value is undefined");
  }

  return medianValue;
};
