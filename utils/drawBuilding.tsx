import drawAntenna from "./drawAntenna";
import drawBuildingWindows from "./drawBuildingWindows";
import drawCrane from "./drawCrane";
import drawRailing from "./drawRailing";

export default function drawBuilding(
  paintbrush: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  width: number,
  height: number,
  fill: string,
  randomBuildingId: number,
  randomBuildingId2: number,
  scaleAdjust: number
) {
  // draw a rectangle with curved top edges only slightly
  let radius = 5;
  paintbrush.beginPath();
  paintbrush.fillStyle = fill;
  paintbrush.beginPath();
  paintbrush.moveTo(startX + radius, startY);
  paintbrush.lineTo(startX + width - radius, startY);
  paintbrush.quadraticCurveTo(
    startX + width,
    startY,
    startX + width,
    startY + radius
  );
  paintbrush.lineTo(startX + width, startY + height);
  paintbrush.lineTo(startX, startY + height);
  paintbrush.quadraticCurveTo(
    startX,
    startY + height,
    startX,
    startY + height - radius
  );
  paintbrush.lineTo(startX, startY + radius);
  paintbrush.quadraticCurveTo(startX, startY, startX + radius, startY);
  paintbrush.closePath();
  paintbrush.fill();

  // draw windows
  let windowWidth: number;
  let windowHeight: number;
  // random window sizes using randomBuildingId
  // using randomBuildingId2 for any other randomness needed
  if (randomBuildingId > 0.95) {
    // random chance for bay windows
    windowWidth = 6 + Math.floor(5 * randomBuildingId2);
    windowHeight = 9 + Math.floor(7 * randomBuildingId2);
  } else {
    windowWidth = 5 + Math.floor(8 * randomBuildingId2);
    windowHeight = 2 + Math.floor(5 * randomBuildingId2);
  }
  // gep between windows
  const windowGapX: number = 6 + Math.floor(6 * randomBuildingId2);
  const windowGapY: number = 4 + Math.floor(6 * randomBuildingId2);
  // gap between window and building
  let windowBuildingGapX: number = 10;
  let windowBuildingGapY: number = 10;
  const windowColour: string = "#6e92ff44";
  const windowLitColour: string = "#fdd48a";

  drawBuildingWindows(
    paintbrush,
    width,
    height,
    startX,
    startY,
    windowWidth * scaleAdjust,
    windowHeight * scaleAdjust,
    windowGapX * scaleAdjust,
    windowGapY * scaleAdjust,
    windowBuildingGapX * scaleAdjust,
    windowBuildingGapY * scaleAdjust,
    windowColour,
    windowLitColour,
    randomBuildingId,
    randomBuildingId2
  );

  // add antenna randomly to buildings thinner than 200
  if (width < 100 && randomBuildingId > 0.7) {
    drawAntenna(paintbrush, startX, startY, fill, width, randomBuildingId2);
  }
  // randomly draw railing on top
  else if (randomBuildingId > 0.2 && randomBuildingId < 0.7) {
    drawRailing(paintbrush, startX, startY, fill, width, radius);
  }
  // randomly draw crane on top
  else if (randomBuildingId < 0.1) {
    drawCrane(paintbrush, startX, startY, fill, width, randomBuildingId2);
  }

  // maybe if skyscraper add tower top with antenna?
}
