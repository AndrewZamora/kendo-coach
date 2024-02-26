type coordinates = number[];

function calculateMidAngle(first: coordinates, mid: coordinates, end: coordinates) {
  const [x1, y1] = first;
  const [x2, y2] = mid;
  const [x3, y3] = end;
  const angle = (Math.atan2(y1 - y2, x1 - x2) - Math.atan2(y3 - y2, x3 - x2)) * (180 / Math.PI);
  return Math.abs(angle)
}

export { calculateMidAngle };