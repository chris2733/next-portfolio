import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import randomIntFromInterval from "../..//utils/randomIntFromInterval";
import drawRain from "../..//utils/drawRain";
import shadeHexColor from "utils/shadeHexColor";

export default function CanvasTraffic({
  width,
  height,
  frameRate,
  numCars,
}: {
  width: number;
  height: number;
  frameRate: number;
  numCars: number;
}) {
  // canvas element ref'd here
  const canvasEl = useRef<HTMLCanvasElement>(null);

  // cars array and size
  /*
   TODO: sort this cars type 
  */
  let cars: any = ([] = useMemo(() => [], []));
  const size = {
    wheelD: 3, // wheel diameter
    bodyW: 25,
    bodyH: 6,
    roofH: 6,
  };

  for (let index = 0; index < numCars; index++) {
    cars.push({
      start: {
        // start cars from random position in width
        x: width * Math.random(),
        y: height,
      },
      colour: shadeHexColor(
        "#" + Math.floor(Math.random() * 16777215).toString(16),
        -0.3
      ),
      size,
      flipDirection: Math.round(Math.random()) === 0,
    });
  }

  // draw on canvas here
  const draw = useCallback(
    (paintbrush: CanvasRenderingContext2D) => {
      cars.forEach((car: any) => {
        // smaller var names here for size and start
        const size = car.size;
        let start = car.start;
        // Get the car moving here
        if (start.x < 0 - size.bodyW || start.x > width + size.bodyW) {
          // restart car from offscreen and with new colour
          if (car.flipDirection) {
            car.start.x = width + size.bodyW * 2;
          } else {
            car.start.x = 0 - size.bodyW * 2;
          }
          car.colour = shadeHexColor(
            "#" + Math.floor(Math.random() * 16777215).toString(16),
            -0.3
          );
        } else {
          if (car.flipDirection) {
            car.start.x -= 15;
          } else {
            car.start.x += 5;
          }
        }

        // Draw car body
        paintbrush.fillStyle = car.colour;
        paintbrush.beginPath();
        paintbrush.fillRect(
          start.x,
          start.y - size.wheelD,
          size.bodyW,
          -size.bodyH
        );

        // Draw car roof
        paintbrush.fillStyle = car.colour;
        paintbrush.beginPath();
        paintbrush.moveTo(start.x, start.y - size.bodyH - size.wheelD);
        paintbrush.lineTo(
          start.x + size.bodyW * 0.33,
          start.y - size.bodyH - size.roofH - size.wheelD
        );
        paintbrush.lineTo(
          start.x + size.bodyW * 0.66,
          start.y - size.bodyH - size.roofH - size.wheelD
        );
        paintbrush.lineTo(
          start.x + size.bodyW,
          start.y - size.bodyH - size.wheelD
        );
        paintbrush.closePath();
        paintbrush.fill();

        // Draw car window
        paintbrush.fillStyle = shadeHexColor("#04528a", 0.5);
        paintbrush.beginPath();
        paintbrush.fillRect(
          start.x + size.bodyW * 0.33,
          start.y - size.bodyH * 0.9 - size.wheelD,
          size.bodyW * 0.3,
          -size.roofH * 0.6
        );

        // Draw car wheel
        paintbrush.fillStyle = "black";
        paintbrush.beginPath();
        paintbrush.arc(
          start.x + size.wheelD * 1.5,
          start.y - size.wheelD,
          size.wheelD,
          0,
          Math.PI * 2,
          false
        );
        paintbrush.closePath();
        paintbrush.fill();
        // Draw car other wheel
        paintbrush.beginPath();
        paintbrush.arc(
          start.x - size.wheelD * 1.5 + size.bodyW,
          start.y - size.wheelD,
          size.wheelD,
          0,
          Math.PI * 2,
          false
        );
        paintbrush.closePath();
        paintbrush.fill();
      });
    },
    [cars, width]
  );

  let previousTimeRef = useRef<any>();
  let animationFrameId = useRef<any>();
  const [framerate, setFramerate] = useState<number>(frameRate ? frameRate : 1);

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
        const frameDelay = 1000 / framerate;

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
