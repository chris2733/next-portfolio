import { useCallback, useEffect, useRef } from "react";
import randomIntFromInterval from "../..//utils/randomIntFromInterval";
import drawRain from "../..//utils/drawRain";

type CanvasRain = {
  width: number;
  height: number;
  frameRate: number;
};

type RainSettings = {
  amount: number;
  dropLength: number;
  dropWidth: number;
  dropColour: string;
  heightAdjust: number;
};

export default function CanvasRain({
  width,
  height,
  frameRate = 1,
}: CanvasRain) {
  // canvas element ref'd here
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  // set rain amount here
  const rain: RainSettings = {
    amount: Math.ceil(width / 100),
    dropLength: 15,
    dropWidth: 0.5,
    dropColour: "rgba(255,255,255,0.7)",
    heightAdjust: 0 - height / 7,
  };

  const rainDrops = (rainAmount: number) => {
    const rainEach: {
      startPos: [number, number];
      speed: number;
      start: number;
    }[] = [];
    for (let index: number = 0; index < rainAmount; index++) {
      const startPos: [number, number] = [
        randomIntFromInterval(0, width),
        rain.heightAdjust * randomIntFromInterval(0, 9),
      ];
      const speed: number = randomIntFromInterval(4, 10);
      rainEach.push({ startPos, speed, start: 0 });
    }
    return rainEach;
  };
  const rainDropsArray = rainDrops(rain.amount);

  // draw on canvas here
  const draw = useCallback(
    (paintbrush: CanvasRenderingContext2D) => {
      drawRain(
        paintbrush,
        width,
        height,
        rainDropsArray,
        rain.dropWidth,
        rain.dropLength,
        rain.dropColour,
        rain.heightAdjust
      );
    },
    [
      width,
      height,
      rainDropsArray,
      rain.dropWidth,
      rain.dropLength,
      rain.dropColour,
      rain.heightAdjust,
    ]
  );

  let previousTimeRef: React.MutableRefObject<number | undefined> = useRef();
  let animationFrameId: React.MutableRefObject<number | undefined> = useRef();

  const frameLoop = (time?: number) => {
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
      const ctx: CanvasRenderingContext2D | null =
        canvasEl.current.getContext("2d");
      if (!ctx || !(ctx instanceof CanvasRenderingContext2D) || ctx === null) {
        return;
      }
      const paintbrush: CanvasRenderingContext2D = ctx;
      paintbrush.clearRect(0, 0, width, height);
      paintbrush.beginPath();

      let lastRenderTime: number = 0;
      const startRendering = (timestamp: number) => {
        const frameDelay: number = 1000 / frameRate;

        if (timestamp - lastRenderTime >= frameDelay) {
          paintbrush.clearRect(0, 0, width, height);
          paintbrush.beginPath();
          draw(paintbrush);
          lastRenderTime = timestamp;
          paintbrush.closePath();
        }
        frameLoop(timestamp);
        animationFrameId.current = requestAnimationFrame(startRendering);
      };

      animationFrameId.current = requestAnimationFrame(startRendering);

      return () => {
        paintbrush.clearRect(0, 0, width, height);
        if (animationFrameId.current !== undefined) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
    }
    // call draw here, so its reloaded on each draw
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draw]);

  return <canvas ref={canvasEl} height={height} width={width}></canvas>;
}
