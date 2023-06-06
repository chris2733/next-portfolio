import { useState } from "react";
import resetShadows from "./resetShadows";
import randomIntFromInterval from "./randomIntFromInterval";

export const DrawWindow = (
  randomBuildingId: number,
  randomBuildingId2: number,
  paintbrush: CanvasRenderingContext2D,
  windowWidth: number,
  windowHeight: number,
  windowColour: string,
  windowLitColour: string,
  windowLit: boolean,
  x: number,
  y: number
) => {
  // but random lit window.. havent figured it out exactly, but this seems to look pretty random
  const dateDigits = String(
    parseInt(String(new Date().getSeconds())) * randomBuildingId
  ).slice(-3);
  const randomLoopDigits = String((x + y) * randomBuildingId2 * 100).slice(-3);
  // flip state of window lit randomly
  if (Number(randomLoopDigits) > 500) {
    windowLit = !windowLit;
  }
  // flip windowlit randomly dpeening on loop this time
  if (Number(dateDigits) === randomIntFromInterval(99, 999)) {
    windowLit = !windowLit;
  }
  if (windowLit) {
    paintbrush.shadowColor = windowLitColour;
    paintbrush.shadowOffsetX = 0;
    paintbrush.shadowOffsetY = 0;
    paintbrush.shadowBlur = 6;
    paintbrush.fillStyle = windowColour;
    paintbrush.fillRect(x, y, windowWidth, windowHeight);
    resetShadows(paintbrush);
  } else {
    paintbrush.fillStyle = windowColour;
    paintbrush.fillRect(x, y, windowWidth, windowHeight);
  }
};

export default DrawWindow;
