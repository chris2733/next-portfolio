export default function drawAntenna(
  paintbrush: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fill: string,
  width: number,
  randomBuildingId2: number
) {
  // add to the centerish
  const x: number = startX + (width * 0.4 + randomBuildingId2 * (width * 0.4));
  // random height around 50ish
  const height: number = 20 + randomBuildingId2 * 30;
  const antennaWidth: number = 3;
  paintbrush.beginPath();
  paintbrush.fillStyle = fill;
  paintbrush.fillRect(x, startY, antennaWidth, -height);
  // 2/3 chance to have a little one next door
  if (randomBuildingId2 > 0.3) {
    // place smaller antenna to side furthest from edge
    const antennaSpace: number = 10;
    const smallAntennaX: number =
      x > width / 2 ? x - antennaSpace : x + antennaSpace;
    // random height around 20ish
    const smallAntennaHeight: number = 10 + randomBuildingId2 * 16;
    paintbrush.beginPath();
    paintbrush.fillStyle = fill;
    paintbrush.fillRect(
      smallAntennaX,
      startY,
      antennaWidth,
      -smallAntennaHeight
    );
  }
}
