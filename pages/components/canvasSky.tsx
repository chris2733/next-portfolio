import { useCallback, useEffect, useRef } from "react";
import drawSunMoon from "pages/utils/drawSunMoon";
import drawSky from "pages/utils/drawSky";
import skyColours from "pages/utils/skyColours";

export default function Canvas({
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
  // set the colour stops for different times, from suncalc
  const currentSkyLight: string = data.currentSkyLight;
  const nextSkyLight: string = data.nextSkyLight;
  const skyProgress: number = data.skyProgress;

  // get the right colour from skycolours, setup properly in typescript
  // setting the string currentSkyLight as a definite type, in this case being a string that is equal to one of the keys in the object
  type ObjectKey = keyof typeof skyColours;
  let currentSkyLightGradients = skyColours[currentSkyLight as ObjectKey];
  const nextSkyLightGradients = skyColours[nextSkyLight as ObjectKey];
  // re-set the sky gradients according to skyProgress, between currentSkyLight and nextSkyLight
  let newSky: { stop: number; color: string }[] = [];
  currentSkyLightGradients &&
    nextSkyLightGradients &&
    currentSkyLightGradients.forEach((gradient, index) => {
      // get stop difference
      let stopDifference = nextSkyLightGradients[index].stop - gradient.stop;
      let stop = parseFloat(
        ((gradient.stop + stopDifference) * skyProgress).toFixed(2)
      );
      // get rgb difference
      let rgbCurrent: number[] = gradient.color
        .replace(/[()'rgb']/g, " ")
        .replaceAll(" ", "")
        .split(",")
        .map((x) => parseInt(x));
      let rgbNext: number[] = nextSkyLightGradients[index].color
        .replace(/[()'rgb']/g, " ")
        .replaceAll(" ", "")
        .split(",")
        .map((x) => parseInt(x));
      let rgbNew: number[] = [];
      rgbCurrent.forEach((rgb, index) => {
        let rgbChange = rgbNext[index] - rgb;
        rgbNew.push(Number((rgb + rgbChange * skyProgress).toFixed()));
      });
      newSky.push({ stop: stop, color: `rgb(${rgbNew})` });
    });
  currentSkyLightGradients = newSky;

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
        currentSkyLight,
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
    [
      currentSkyLight,
      currentSkyLightGradients,
      data,
      height,
      radianAdjust,
      width,
      horizon,
    ]
  );

  useEffect(() => {
    // check it isnt null - thanks typescript
    if (canvasEl.current) {
      const canvas = canvasEl.current;
      const ctx = canvas.getContext("2d");
      if (!ctx || !(ctx instanceof CanvasRenderingContext2D) || ctx === null) {
        return;
      }

      if (canvasEl.current) {
        // check if canvas context isnt null.. then add it to paintbrush
        // seems to be the only way to make ts happy without using any
        const canvas = canvasEl.current;
        const ctx = canvas.getContext("2d");
        if (
          !ctx ||
          !(ctx instanceof CanvasRenderingContext2D) ||
          ctx === null
        ) {
          return;
        }
        const paintbrush: CanvasRenderingContext2D = ctx;
        paintbrush.clearRect(0, 0, width, height);
        paintbrush.beginPath();
        draw(paintbrush);
      }
    }
    // call draw here, so its reloaded on each draw
  }, [draw, height, width]);

  return <canvas ref={canvasEl} height={height} width={width}></canvas>;
}
