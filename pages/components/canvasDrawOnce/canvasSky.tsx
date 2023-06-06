import { useCallback, useEffect, useRef } from "react";
import drawSunMoon from "pages/utils/drawSunMoon";
import drawSky from "pages/utils/drawSky";
import skyColours from "pages/utils/skyColours";
import getCurrentSkyGradient from "pages/utils/getCurrentSkyGradient";

export default function CanvasSky({
  data,
  width,
  height,
  horizon,
  radianAdjust,
}: {
  data: any;
  width: number;
  height: number;
  horizon: number;
  radianAdjust: number;
}) {
  // canvas element ref'd here
  const canvasEl = useRef<HTMLCanvasElement>(null);

  // colours
  const sunColour: string = "#eabc2c99";
  const moonColour: string = "grey";

  // getting & setting sky gradient colours
  type ObjectKey = keyof typeof skyColours;
  let currentSkyLightGradients = skyColours[data.currentSkyLight as ObjectKey];
  currentSkyLightGradients = getCurrentSkyGradient(
    data.currentSkyLight,
    data.nextSkyLight,
    data.skyProgress,
    skyColours
  );

  // draw on canvas here
  const draw = useCallback(
    (paintbrush: CanvasRenderingContext2D) => {
      // horizon
      // paintbrush.beginPath();
      // paintbrush.moveTo(0, height - horizon);
      // paintbrush.lineTo(width, height - horizon);
      // paintbrush.strokeStyle = "red";
      // paintbrush.stroke();

      // draw sky
      drawSky(
        paintbrush,
        width,
        height,
        data.currentSkyLight,
        currentSkyLightGradients
      );
      // sun/moon positioning
      drawSunMoon(
        paintbrush,
        data,
        width,
        height,
        horizon,
        radianAdjust,
        sunColour,
        moonColour
      );
    },
    [currentSkyLightGradients, data, height, radianAdjust, width, horizon]
  );

  useEffect(() => {
    // check it isnt null - thanks typescript
    if (canvasEl.current) {
      const canvas = canvasEl.current;
      const ctx = canvas.getContext("2d");
      if (!ctx || !(ctx instanceof CanvasRenderingContext2D) || ctx === null) {
        return;
      }
      const paintbrush: CanvasRenderingContext2D = ctx;
      paintbrush.clearRect(0, 0, width, height);
      paintbrush.beginPath();
      draw(paintbrush);
    }
  }, [draw]);

  return <canvas ref={canvasEl} height={height} width={width}></canvas>;
}
