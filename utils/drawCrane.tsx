export default function drawCrane(
  paintbrush: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fill: string,
  width: number,
  randomBuildingId2: number
) {
  // start near the centreish
  const x: number = startX + (width * 0.4 + randomBuildingId2 * (width * 0.4));
  // randomly choose the direction of crane
  const direction: string = randomBuildingId2 > 0.5 ? "left" : "right";
  const legHeight: number = 5;
  const legWidth: number = 2;
  const bodyHeight: number = 6;
  const bodyWidth: number = 16;
  const neckLength: number = 6 + Math.floor(randomBuildingId2 * 5); // random neck length, to be looped over
  const neckWidth: number = 2;
  const neckHeight: number = 3; //height of each neck segment
  paintbrush.beginPath();
  paintbrush.fillStyle = fill;
  paintbrush.fillRect(x, startY, legWidth, -legHeight); // legs
  paintbrush.fillRect(
    x - bodyWidth / 2,
    startY - legHeight,
    bodyWidth,
    -bodyHeight
  ); // body
  // draw the neck
  const neckStart = startY - legHeight - bodyHeight + 1;
  for (let i = 0; i < neckLength; i++) {
    paintbrush.beginPath();
    paintbrush.fillStyle = fill;
    // move each neck segment up by 2*i, to the side by a neckwidth
    // direction picks if its added or taken away
    const directionX: number =
      direction === "left" ? x - i * neckWidth : x + i * neckWidth;
    paintbrush.fillRect(directionX, neckStart - i * 2, 2, -neckHeight);
  }
  // add the dangly bit
  const craneDangleLength: number = neckLength * 2 + 8 * randomBuildingId2;
  const craneDangleX: number =
    direction === "left"
      ? x - neckLength * neckWidth
      : x + neckLength * neckWidth;
  paintbrush.fillRect(
    craneDangleX,
    neckStart - neckLength * 2,
    2,
    craneDangleLength
  );
  // little end bit
  paintbrush.fillRect(
    craneDangleX - 2,
    neckStart - neckLength * 2 + craneDangleLength,
    6,
    2
  );
}
