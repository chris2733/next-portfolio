import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import drawSunMoon from "pages/utils/drawSunMoon";
import drawSky from "pages/utils/drawSky";
import randomIntFromInterval from "pages/utils/randomIntFromInterval";
import drawBuilding from "pages/utils/drawBuilding";
import buildingsSetup from "pages/utils/buildingsSetup";
import drawLampposts from "pages/utils/drawLampposts";
import skyColours from "pages/utils/skyColours";
import drawRain from "pages/utils/drawRain";

export default function Canvas({
  data,
  width,
  height,
  horizon,
  radianAdjust,
  frameRate,
}: {
  data: any;
  width: number;
  height: number;
  horizon: number;
  radianAdjust: number;
  frameRate: number;
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

  // set rain amount here
  const [rainAmount, setRainAmount] = useState(200);
  const rainDropLength = 15;
  const rainDropWidth = 0.5;
  const rainDropColour = "rgba(255,255,255,0.7)";
  const rainHeightAdjust = 0 - height / 7;

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

  // setting each building layer in an array to be looped over when drawing
  type BuildingLayerType = {
    start: number;
    width: number;
    height: number;
  };
  const buildings: {
    buildingsArray: BuildingLayerType[];
    heightAdjust: number;
    scaleAdjust: number; //scaleadjust used to make windows smaller, giving illusion of distance away
    colour: string;
  }[] = useMemo(() => [], []);
  // each building layer pushed here with a height adjusted up in y
  // building constraints setup here
  const building: {
    minW: number;
    maxW: number;
    minH: number;
    maxH: number;
    minG: number;
    maxG: number;
  } = {
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
    currentSkyLight,
    currentSkyLightGradients && currentSkyLightGradients[0].color
  );

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

  // set lamppost data here
  const lamppostStart = randomIntFromInterval(0, 30);
  const lamppostEnd = randomIntFromInterval(0, 30);
  const lamppostSpace = randomIntFromInterval(150, 180);
  const lampostLightColour: string = "#f0dfa899";

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
    [
      buildings,
      currentSkyLight,
      currentSkyLightGradients,
      data,
      height,
      horizon,
      lamppostEnd,
      lamppostSpace,
      lamppostStart,
      radianAdjust,
      rainDropsArray,
      rainHeightAdjust,
      width,
    ]
  );

  // const requestRef: any = useRef();
  let previousTimeRef: any = useRef();
  let animationFrameId: any = useRef();
  const [Framerate, setFramerate] = useState<number>(frameRate ? frameRate : 1);

  const frameLoop = (time?: any) => {
    // loop through animation frames Headers, setting the time to check with later
    if (canvasEl.current) {
      previousTimeRef.current = time;
      animationFrameId.current = requestAnimationFrame(frameLoop);
    }
  };

  useEffect(() => {
    // set rain amount here according to width
    setRainAmount(Math.ceil(width / 100));
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
        const frameDelay = 1000 / Framerate;

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
  }, [draw]);

  return <canvas ref={canvasEl} height={height} width={width}></canvas>;
}
