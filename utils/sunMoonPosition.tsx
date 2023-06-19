import getPoint from "./getPoint";
import resetShadows from "./resetShadows";

// set position of the sun/moon
export default function sunMoonPosition(
  paintbrush: CanvasRenderingContext2D,
  radians: number,
  centreX: number,
  centreY: number,
  orbitRadius: number,
  circleRadius: number,
  fillColour: string,
  radianAdjust: number,
  width: number,
  height: number,
  horizon: number,
  isSun?: boolean
) {
  // start drawing the arc to set the position
  paintbrush.beginPath();
  paintbrush.arc(
    centreX,
    centreY,
    orbitRadius,
    0 - radianAdjust,
    radians - radianAdjust
  );
  paintbrush.strokeStyle = "transparent";
  paintbrush.stroke();
  // get the end of the arc in coords
  let sunMoonPosition = getPoint(
    centreX,
    centreY,
    orbitRadius,
    radians - radianAdjust
  );
  // work out how high the sun/moon is by using width of screen/2 (its height in the sky)
  // then if this is a less than the height of the whole canvas, so if its too low, get the ratio of the difference and bump it up a tad
  if (width / 2 / (height - horizon) < 1) {
    const ratio = width / 2 / (height - horizon);
    // since its drawn from top screenLeft, get the differnce between sunMoonPosition y pos and horizon, multiply that by the ratio and minus it from sunMoonPosition y pos, so it will still sit on the horizon later
    // ...or should
    const yAdjust = (height - horizon - sunMoonPosition[1]) * ratio;
    sunMoonPosition[1] -= yAdjust;
  }

  // draw circle on sunMoonposition
  paintbrush.beginPath();
  paintbrush.arc(
    sunMoonPosition[0],
    sunMoonPosition[1],
    circleRadius,
    0,
    Math.PI + (Math.PI * 2) / 2
  );
  // fill itt
  // if isSun...
  if (isSun) {
    paintbrush.shadowColor = fillColour;
    paintbrush.shadowBlur = 15;
    paintbrush.fillStyle = fillColour;
    paintbrush.fill();
    resetShadows(paintbrush);
  } else {
    paintbrush.fillStyle = fillColour;
    paintbrush.fill();
  }
}
