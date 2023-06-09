import { useCallback, useEffect, useRef } from "react";
import randomIntFromInterval from "../..//utils/randomIntFromInterval";
import drawRain from "../..//utils/drawRain";

export default function CanvasRain({
  width,
  height,
  frameRate = 1,
}: {
  width: number;
  height: number;
  frameRate: number;
}) {
  // canvas element ref'd here
  const canvasEl = useRef<HTMLCanvasElement>(null);

  // set rain amount here
  const rainAmount = Math.ceil(width / 100);
  const rainDropLength = 15;
  const rainDropWidth = 0.5;
  const rainDropColour = "rgba(255,255,255,0.7)";
  const rainHeightAdjust = 0 - height / 7;

  const rainDrops = (rainAmount: number) => {
    const rain: { startPos: [number, number]; speed: number; start: number }[] =
      [];
    for (let index = 0; index < rainAmount; index++) {
      const startPos: [number, number] = [
        randomIntFromInterval(0, width),
        rainHeightAdjust * randomIntFromInterval(0, 9),
      ];
      const speed: number = randomIntFromInterval(4, 10);
      rain.push({ startPos, speed, start: 0 });
    }
    return rain;
  };
  const rainDropsArray = rainDrops(rainAmount);

  // draw on canvas here
  const draw = useCallback(
    (paintbrush: CanvasRenderingContext2D) => {
      drawRain(
        paintbrush,
        width,
        height,
        rainDropsArray,
        rainDropWidth,
        rainDropLength,
        rainDropColour,
        rainHeightAdjust
      );
    },
    [height, rainDropsArray, rainHeightAdjust, width]
  );

  let previousTimeRef = useRef<any>();
  let animationFrameId = useRef<any>();

  const frameLoop = (time?: any) => {
    // loop through animation frames Headers, setting the time to check with later
    if (canvasEl.current) {
      previousTimeRef.current = time;
      animationFrameId.current = requestAnimationFrame(frameLoop);
    }
  };

  useEffect(() => {
    // check if canvas context isnt null.. then add it to paintbrush
    // seems to be the only way to make ts happy without using any
    if (canvasEl.current) {
      const canvas = canvasEl.current;
      const ctx = canvas.getContext("2d");
      if (!ctx || !(ctx instanceof CanvasRenderingContext2D) || ctx === null) {
        return;
      }
      const paintbrush: CanvasRenderingContext2D = ctx;
      paintbrush.clearRect(0, 0, width, height);
      paintbrush.beginPath();

      let lastRenderTime = 0;
      const startRendering = (timestamp: any) => {
        const frameDelay = 1000 / frameRate;

        if (timestamp - lastRenderTime >= frameDelay) {
          paintbrush.clearRect(0, 0, width, height);
          paintbrush.beginPath();
          draw(paintbrush);
          lastRenderTime = timestamp;
        }
        frameLoop(timestamp);
        animationFrameId.current = requestAnimationFrame(startRendering);
      };

      animationFrameId.current = requestAnimationFrame(startRendering);

      return () => {
        paintbrush.clearRect(0, 0, width, height);
        cancelAnimationFrame(animationFrameId.current);
      };
    }
    // call draw here, so its reloaded on each draw
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draw]);

  return <canvas ref={canvasEl} height={height} width={width}></canvas>;
}
