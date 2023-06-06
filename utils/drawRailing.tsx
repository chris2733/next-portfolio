export default function drawRailing(
  paintbrush: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fill: string,
  width: number,
  radius: number
) {
  let railingsWidth: number = width - radius * 2;
  let railingsStartX: number = startX + (width - railingsWidth) / 2;
  let railingHeight: number = 6;
  let railingsStartY: number = startY - railingHeight;
  let railingThickness: number = 2;
  let railingGap: number = 9;
  paintbrush.beginPath();
  paintbrush.fillStyle = fill;
  paintbrush.fillRect(
    railingsStartX,
    railingsStartY,
    railingsWidth,
    railingThickness
  );
  // railings with gap and width, get the remainder of this from width, so they all fit perfectly - flexible gap ofc
  const railings: number = railingGap + railingThickness;
  const railingsNum: number = railingsWidth / railings;
  // calc the gap at the end, usually some space left, add it to the gap + railing thickness for an accurate spacing
  const remainingGap: number = railingsWidth % railings;
  const space: number =
    railingGap + railingThickness + remainingGap / railingsNum;
  // const space = railingsWidth / railingsNum;
  for (let i = 0; i <= railingsWidth; i += space) {
    paintbrush.beginPath();
    paintbrush.fillStyle = fill;
    paintbrush.fillRect(railingsStartX + i, railingsStartY, 2, railingHeight);
  }
}
