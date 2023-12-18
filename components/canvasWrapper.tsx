import { motion } from "framer-motion";
import CanvasSky from "./canvasDrawOnce/canvasSky";
import { RefObject, useEffect, useRef, useState } from "react";
import degToRadian from "../utils/degToRadian";
import CanvasLamposts from "./canvasDrawOnce/canvasLamposts";
import dynamic from "next/dynamic";
import Traffic from "./traffic/traffic";

const CanvasBuildings = dynamic(
  () => import("./canvasDrawLoop/canvasBuildings"),
  {
    ssr: false,
  }
);

export default function CanvasWrapper({
  apiDataRecieved,
  hideRain = false,
}: {
  apiDataRecieved: Object;
  hideRain?: boolean;
}) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  // set the position of the horizon, and also the last layer of buildings in background
  const horizon: number = 100;
  // adjustment of -90 degrees, since the start of an arc in canvas seems to start at the centre right of it (east)
  const radianAdjust: number = degToRadian(90);
  // use ref to get a full lvh height el, for that stupid addressbar in mob
  const heightRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    // set canvas to full screen size
    setWidth(window.innerWidth);
    if (heightRef.current === null) {
      setHeight(window.innerHeight);
    } else {
      setHeight(heightRef.current.clientHeight);
    }
  }, []);

  const canvases: JSX.Element[] = [
    <CanvasSky
      key="canvas-sky"
      data={apiDataRecieved}
      width={width}
      height={height}
      horizon={horizon}
      radianAdjust={radianAdjust}
    />,
    <CanvasBuildings
      key="canvas-buildings"
      data={apiDataRecieved}
      width={width}
      height={height}
      horizon={horizon}
      /**
       * TODO: change framerate depending on screen width - higher value for smaller screens, so more likely to happens
       **/
      frameRate={1}
      onlyRenderOnce={true}
    />,
    <CanvasLamposts
      key="canvas-lampposts"
      data={apiDataRecieved}
      width={width}
      height={height}
    />,
    // both of these are old, cant figure out how to get them working in react
    // <CanvasRain
    //   key="canvas-rain"
    //   width={width}
    //   height={height}
    //   frameRate={30}
    // />,
    // <CanvasTraffic
    //   key="canvas-traffic"
    //   width={width}
    //   height={height}
    //   frameRate={60}
    //   numCars={6}
    // />,
    <Traffic key="traffic" />,
    <div
      key="js-rain"
      data-rainwrapper="canvasrainElWrapper"
      className="absolute z-40 w-full h-full"
    >
      <canvas data-raincanvas="canvasrainEl"></canvas>
    </div>,
  ];

  return (
    <div
      className="fixed bottom-0 left-0 w-full h-full z-10 bg-white bg-opacity-80"
      style={{ height: "100lvh" }}
    >
      <div
        className=" -z-50 absolute top-0 left-0"
        style={{ height: "100lvh" }}
        ref={heightRef}
      ></div>
      <motion.div
        key="canvasel"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.3, delay: 0.3 },
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="z-10"
      >
        {canvases.map((element, index) => {
          if (element.key === "canvas-rain" && hideRain) return;
          return (
            <div
              className="absolute top-0 left-0 w-full h-full"
              key={index}
              style={{ zIndex: index }}
            >
              {element}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
