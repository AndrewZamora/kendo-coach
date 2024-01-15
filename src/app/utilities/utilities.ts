type coordinates = number[];

function calculateMidAngle(first: coordinates, mid: coordinates, end: coordinates) {
  const [x1, y1] = first;
  const [x2, y2] = mid;
  const [x3, y3] = end;

  // Calculate vectors AB and BC
  const ABx = x2 - x1;
  const ABy = y2 - y1;
  const BCx = x3 - x2;
  const BCy = y3 - y2;

  // Calculate dot product of AB and BC
  const dotProduct = ABx * BCx + ABy * BCy;

  // Calculate magnitudes of vectors AB and BC
  const magnitudeAB = Math.sqrt(ABx ** 2 + ABy ** 2);
  const magnitudeBC = Math.sqrt(BCx ** 2 + BCy ** 2);

  // Calculate cosine of the angle
  const cosTheta = dotProduct / (magnitudeAB * magnitudeBC);

  // Calculate angle in radians
  const thetaRad = Math.acos(cosTheta);

  // Convert angle to degrees
  const thetaDegrees = (thetaRad * 180) / Math.PI;

  return thetaDegrees;
}

export default calculateMidAngle;