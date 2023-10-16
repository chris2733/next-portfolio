import randomIntFromInterval from "./randomIntFromInterval";

export default function drawRain(
  paintbrush: CanvasRenderingContext2D,
  width: number,
  height: number,
  rainDropsArray: {
    startPos: [number, number];
    speed: number;
    start: number;
  }[],
  rainDropWidth: number,
  rainDropLength: number,
  rainDropColour: string,
  rainHeightAdjust: number
) {
  rainDropsArray.forEach((drop, index) => {
    if (drop.startPos[1] > height) {
      rainDropsArray[index].startPos[1] = rainHeightAdjust;
      rainDropsArray[index].startPos[0] = randomIntFromInterval(0, width);
      rainDropsArray[index].speed = randomIntFromInterval(8, 16);
    } else {
      rainDropsArray[index].speed += drop.speed * 0.02;
      rainDropsArray[index].startPos[1] += drop.speed;
    }
    paintbrush.beginPath();
    paintbrush.moveTo(drop.startPos[0], drop.startPos[1]);
    paintbrush.lineTo(drop.startPos[0], drop.startPos[1] + rainDropLength);
    paintbrush.strokeStyle = rainDropColour;
    paintbrush.lineWidth = rainDropWidth;
    paintbrush.stroke();
  });
}
