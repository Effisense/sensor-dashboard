export function getScale(
  arr: number[][],
  height: number,
  offset: number,
): number {
  const medianValue = getMedianValue(arr);
  // Calculate the maximum value of the scale based on the height and offset
  const maxScaleValue = height - offset;
  // Calculate the difference between the median value and the offset
  const diff = Math.abs(medianValue - offset);
  // Calculate the scale from 0-100
  const scale = Math.max(
    0,
    Math.min(100, ((maxScaleValue - diff) / maxScaleValue) * 100),
  );
  return scale;
}

function getMedianValue(arr: number[][]): number {
  const n = arr.length;
  const middlePoints = [];
  // Check if the input array is square
  if (n !== arr[0].length) {
    throw new Error("Input array must be square");
  }
  // Get the middle points of the array
  for (let i = 1; i < n - 1; i++) {
    for (let j = 1; j < n - 1; j++) {
      middlePoints.push(arr[i][j]);
    }
  }
  // Sort the middle points
  middlePoints.sort((a, b) => a - b);
  // Get the median value
  const medianIndex = Math.floor(middlePoints.length / 2);
  const medianValue = middlePoints[medianIndex];

  return medianValue;
}
