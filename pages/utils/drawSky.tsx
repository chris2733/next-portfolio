import randomIntFromInterval from "./randomIntFromInterval";

export default function drawSky(
  paintbrush: CanvasRenderingContext2D,
  width: number,
  height: number,
  currentSkyLight: string,
  currentSkyLightGradients?: { stop: number; color: string }[]
) {
  paintbrush.beginPath();
  paintbrush.rect(0, 0, width, height);
  // add linear gradient
  var grd = paintbrush.createLinearGradient(width / 2, height, width / 2, 0);
  currentSkyLightGradients?.forEach((element: any) => {
    element.stop &&
      element.color &&
      grd.addColorStop(element.stop, element.color);
  });
  paintbrush.fillStyle = grd;
  paintbrush.fill();
  // draw stars if sky dark
  let startX: number = -20;
  let starSpaceMin: number = 7;
  let starSpaceMax: number = 15;
  let starColour: string = "#ffffff99";
  let checkNight: string[] = ["nauticalDusk", "night", "nadir", "nightEnd"];
  if (checkNight.includes(currentSkyLight)) {
    for (
      let xPos = startX;
      xPos < width;
      xPos += randomIntFromInterval(starSpaceMin, starSpaceMax)
    ) {
      let randomY = height * Math.random();
      paintbrush.fillStyle = starColour;
      paintbrush.fillRect(xPos, randomY, 1, 1);
    }
  }
}
