// get the end point of an arc as coords
export default function getPoint(
  c1: number,
  c2: number,
  radius: number,
  angle: number
) {
  return [c1 + Math.cos(angle) * radius, c2 + Math.sin(angle) * radius];
}
