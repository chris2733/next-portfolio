import { useCallback, useEffect, useMemo, useRef } from "react";
import drawBuilding from "../../utils/drawBuilding";
import buildingsSetup from "../../utils/buildingsSetup";
import skyColours from "../../utils/skyColours";
import getCurrentSkyGradient from "../../utils/getCurrentSkyGradient";

// Settings types here
// Setting each building layer in an array to be looped over when drawing
type CanvasBuildings = {
  data: any;
  width: number;
  height: number;
  horizon: number;
  frameRate: number;
  onlyRenderOnce: boolean;
};
type BuildingLayer = {
  start: number;
  width: number;
  height: number;
};
type BuildingSizing = {
  minW: number;
  maxW: number;
  minH: number;
  maxH: number;
  minG: number;
  maxG: number;
};
type Buildings = {
  buildingsArray: BuildingLayer[];
  heightAdjust: number;
  scaleAdjust: number; //scaleadjust used to make windows smaller, giving illusion of distance away
  colour: string;
};

export default function CanvasBuildings({
  data,
  width,
  height,
  horizon,
  frameRate = 1,
  onlyRenderOnce = false,
}: CanvasBuildings) {
  // canvas element ref'd here
  const canvasEl = useRef<HTMLCanvasElement>(null);

  // getting & setting sky gradient colours
  const currentSkyLightGradients = getCurrentSkyGradient(
    data.currentSkyLight,
    data.nextSkyLight,
    data.skyProgress,
    skyColours
  );

  // Generating buildings here
  const buildings: Buildings[] = useMemo(() => [], []);
  // each building layer pushed here with a height adjusted up in y
  // building constraints setup here
  const building: BuildingSizing = {
    minW: 50,
    maxW: 130,
    minH: 70,
    maxH: 200,
    minG: 2,
    maxG: 10,
  };
  buildingsSetup(
    building,
    buildings,
    horizon,
    width,
    data.currentSkyLight,
    currentSkyLightGradients && currentSkyLightGradients[0].color
  );

  // draw on canvas here
  const draw = useCallback(
    (paintbrush: CanvasRenderingContext2D) => {
      // draw each building layer here
      buildings.forEach(
        ({ buildingsArray, heightAdjust, scaleAdjust, colour }) => {
          // if height heightAdjust, add bar of colour underneath to cover the background
          let heightFix = 0;
          if (heightAdjust) {
            heightFix = heightAdjust;
            paintbrush.beginPath();
            paintbrush.fillStyle = colour;
            paintbrush.fillRect(0, height - heightAdjust, width, height);
          }
          buildingsArray &&
            buildingsArray.forEach((building: any) => {
              drawBuilding(
                paintbrush,
                building.start,
                height - building.height - heightFix,
                building.width,
                building.height,
                colour,
                building.randomBuildingId,
                building.randomBuildingId2,
                scaleAdjust
              );
            });
        }
      );
    },
    [buildings, height, width]
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
    if (onlyRenderOnce) {
      if (canvasEl.current) {
        const canvas: HTMLCanvasElement = canvasEl.current;
        const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
        if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) {
          return;
        }
        const paintbrush: CanvasRenderingContext2D = ctx;
        paintbrush.clearRect(0, 0, width, height);
        paintbrush.beginPath();

        draw(paintbrush);
      }
    } else {
      if (canvasEl.current) {
        const canvas: HTMLCanvasElement = canvasEl.current;
        const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
        if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) {
          return;
        }
        const paintbrush: CanvasRenderingContext2D = ctx;
        paintbrush.clearRect(0, 0, width, height);
        paintbrush.beginPath();

        const startRendering = () => {
          let lastRenderTime: number = 0;
          const frameDelay: number = 1000 / frameRate;

          const renderLoop = (timestamp: number) => {
            if (timestamp - lastRenderTime >= frameDelay) {
              frameLoop();
              paintbrush.clearRect(0, 0, width, height);
              paintbrush.beginPath();
              draw(paintbrush);
              lastRenderTime = timestamp;
            }
            animationFrameId.current = requestAnimationFrame(renderLoop);
          };
          animationFrameId.current = requestAnimationFrame(renderLoop);
        };
        const stopRendering = () => {
          if (animationFrameId.current !== undefined) {
            cancelAnimationFrame(animationFrameId.current);
          }
        };

        startRendering();

        return () => {
          stopRendering();
        };
      }
    }

    // call draw here, so its reloaded on each draw
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draw]);

  return <canvas ref={canvasEl} height={height} width={width}></canvas>;
}
