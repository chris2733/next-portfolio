import { motion } from "framer-motion";
import CanvasSky from "./canvasDrawOnce/canvasSky";
import { useEffect, useState } from "react";
import degToRadian from "../utils/degToRadian";
import CanvasBuildings from "./canvasDrawLoop/canvasBuildings";
import CanvasLamposts from "./canvasDrawOnce/canvasLamposts";
import CanvasRain from "./canvasDrawLoop/canvasRain";

export default function CanvasWrapper({
  apiDataRecieved,
}: {
  apiDataRecieved: Object;
}) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  // set the position of the horizon, and also the last layer of buildings in background
  const horizon = 100;
  // adjustment of -90 degrees, since the start of an arc in canvas seems to start at the centre right of it (east)
  const radianAdjust = degToRadian(90);

  useEffect(() => {
    // set canvas to full screen size
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    // call draw here, so its reloaded on each draw
  }, []);

  /* eslint-disable react/jsx-key */
  const canvases = [
    <CanvasSky
      data={apiDataRecieved}
      width={width}
      height={height}
      horizon={horizon}
      radianAdjust={radianAdjust}
    />,
    <CanvasBuildings
      data={apiDataRecieved}
      width={width}
      height={height}
      horizon={horizon}
      /**
       * TODO: change framerate depending on screen width - higher value for smaller screens, so more likely to happens
       **/
      frameRate={3}
    />,
    <CanvasLamposts data={apiDataRecieved} width={width} height={height} />,
    <CanvasRain width={width} height={height} frameRate={60} />,
  ];
  /* eslint-enable react/jsx-key */

  return (
    <div className="absolute top-0 left-0 w-full h-full z-10 bg-white bg-opacity-80">
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