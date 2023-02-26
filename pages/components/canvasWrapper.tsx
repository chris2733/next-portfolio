import { motion } from "framer-motion";
import CanvasSky from "./canvasSky";
import { useEffect, useState } from "react";
import degToRadian from "pages/utils/degToRadian";
import CanvasMotion from "./canvasMotion";

export default function CanvasWrapper({
  apiDataRecieved,
}: {
  apiDataRecieved: Object;
}) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  // set the position of the horizon, and also the last layer of buildings in background
  const [horizon, setHorizon] = useState(100);
  // adjustment of -90 degrees, since the start of an arc in canvas seems to start at the centre right of it (east)
  const [radianAdjust, setRadianAdjust] = useState(degToRadian(90));

  useEffect(() => {
    // set canvas to full screen size
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    // call draw here, so its reloaded on each draw
  }, []);

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
        <div className="absolute top-0 left-0 w-full h-full z-10">
          <CanvasSky
            data={apiDataRecieved}
            width={width}
            height={height}
            horizon={horizon}
            radianAdjust={radianAdjust}
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-full z-20">
          <CanvasMotion
            data={apiDataRecieved}
            width={width}
            height={height}
            horizon={horizon}
            radianAdjust={radianAdjust}
          />
        </div>
      </motion.div>
    </div>
  );
}
