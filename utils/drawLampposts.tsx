import resetShadows from "./resetShadows";

export default function drawLampposts(
  paintbrush: CanvasRenderingContext2D,
  width: number,
  height: number,
  startPoint: number,
  endPoint: number,
  gap: number,
  postHeight: number,
  postWidth: number,
  fill: string,
  lightFill: string
) {
  // set the starter points here, so its drawn correctly in draw, not randomly readded
  // both are random numbers between 0-100 from the edge of canvas
  const start: number = -startPoint;
  const end: number = width + endPoint;
  for (let x: number = start; x < end; x += gap) {
    paintbrush.beginPath();
    resetShadows(paintbrush);
    paintbrush.fillStyle = fill;
    paintbrush.fillRect(x, height, postWidth, -postHeight);
    paintbrush.shadowColor = lightFill;
    paintbrush.shadowOffsetX = 2;
    paintbrush.shadowOffsetY = 2;
    paintbrush.shadowBlur = 15;
    paintbrush.fillRect(x, height - postHeight, 8, 2);
    resetShadows(paintbrush);
    // light at end
    paintbrush.shadowColor = lightFill;
    paintbrush.shadowOffsetX = 2;
    paintbrush.shadowOffsetY = 4;
    paintbrush.shadowBlur = 8;
    paintbrush.fillStyle = lightFill;
    paintbrush.fillRect(x + 3, height - postHeight + 2, 5, 2);
    resetShadows(paintbrush);
  }
}
