import { useCallback, useEffect, useRef } from "react";
import skyColours from "pages/utils/skyColours";
import getCurrentSkyGradient from "pages/utils/getCurrentSkyGradient";
import drawLampposts from "pages/utils/drawLampposts";
import randomIntFromInterval from "pages/utils/randomIntFromInterval";

export default function CanvasSky({
  data,
  width,
  height,
}: {
  data: any;
  width: number;
  height: number;
}) {
  // canvas element ref'd here
  const canvasEl = useRef<HTMLCanvasElement>(null);

  // set lamppost data here
  const lamppostStart = randomIntFromInterval(0, 30);
  const lamppostEnd = randomIntFromInterval(0, 30);
  const lamppostSpace = randomIntFromInterval(150, 180);
  const lampostLightColour: string = "#f0dfa899";

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
      // draw lampposts, similar setup to buildinglayer
      drawLampposts(
        paintbrush,
        width,
        height,
        lamppostStart,
        lamppostEnd,
        lamppostSpace,
        25,
        2,
        "black",
        lampostLightColour
      );
    },
    [height, lamppostEnd, lamppostSpace, lamppostStart, width]
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
