import { useCallback, useEffect, useMemo, useRef } from "react";
import drawBuilding from "../../utils/drawBuilding";
import buildingsSetup from "../../utils/buildingsSetup";
import skyColours from "../../utils/skyColours";
import getCurrentSkyGradient from "../../utils/getCurrentSkyGradient";

export default function CanvasBuildings({
  data,
  width,
  height,
  horizon,
  frameRate = 1,
}: {
  data: any;
  width: number;
  height: number;
  horizon: number;
  frameRate: number;
}) {
  // canvas element ref'd here
  const canvasEl = useRef<HTMLCanvasElement>(null);

  // getting & setting sky gradient colours
  type ObjectKey = keyof typeof skyColours;
  let currentSkyLightGradients = skyColours[data.currentSkyLight as ObjectKey];
  currentSkyLightGradients = getCurrentSkyGradient(
    data.currentSkyLight,
    data.nextSkyLight,
    data.skyProgress,
    skyColours
  );

  // Settings types here
  // Setting each building layer in an array to be looped over when drawing
  type BuildingLayerType = {
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

  // Generating buildings here
  const buildings: {
    buildingsArray: BuildingLayerType[];
    heightAdjust: number;
    scaleAdjust: number; //scaleadjust used to make windows smaller, giving illusion of distance away
    colour: string;
  }[] = useMemo(() => [], []);
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
          if (heightAdjust !== undefined) {
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

  let previousTimeRef: any = useRef();
  let animationFrameId: any = useRef();

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

      const startRendering = () => {
        let lastRenderTime = 0;
        const frameDelay = 1000 / frameRate;

        const renderLoop = (timestamp: any) => {
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
        cancelAnimationFrame(animationFrameId);
      };

      startRendering();

      return () => {
        stopRendering();
      };
    }
    // call draw here, so its reloaded on each draw
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draw]);

  return <canvas ref={canvasEl} height={height} width={width}></canvas>;
}
