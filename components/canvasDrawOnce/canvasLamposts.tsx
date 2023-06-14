import { useCallback, useEffect, useRef } from "react";
import skyColours from "../../utils/skyColours";
import getCurrentSkyGradient from "../../utils/getCurrentSkyGradient";
import drawLampposts from "../../utils/drawLampposts";
import randomIntFromInterval from "../../utils/randomIntFromInterval";

type CanvasSky = {
  data: any;
  width: number;
  height: number;
};

type lamppost = {
  start: number;
  end: number;
  gap: number;
  height: number;
  width: number;
  postColour: string;
  lightColour: string;
};

export default function CanvasSky({ data, width, height }: CanvasSky) {
  // canvas element ref'd here
  const canvasEl = useRef<HTMLCanvasElement>(null);

  // set lamppost data here
  const lamppost: lamppost = {
    start: randomIntFromInterval(0, 30),
    end: randomIntFromInterval(0, 30),
    gap: randomIntFromInterval(150, 180),
    height: 45,
    width: 2,
    postColour: "#393a3b",
    lightColour: "#f0dfa899",
  };

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
        lamppost.start,
        lamppost.end,
        lamppost.gap,
        lamppost.height,
        lamppost.width,
        lamppost.postColour,
        lamppost.lightColour
      );
    },
    [
      height,
      lamppost.end,
      lamppost.gap,
      lamppost.height,
      lamppost.lightColour,
      lamppost.postColour,
      lamppost.start,
      lamppost.width,
      width,
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
      const paintbrush: CanvasRenderingContext2D = ctx;
      paintbrush.clearRect(0, 0, width, height);
      paintbrush.beginPath();
      draw(paintbrush);
    }
  }, [draw]);

  return <canvas ref={canvasEl} height={height} width={width}></canvas>;
}
