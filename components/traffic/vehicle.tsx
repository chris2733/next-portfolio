import { useAnimation, motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Car from "./car";
import shadeHexColor from "utils/shadeHexColor";
import randomIntFromInterval from "utils/randomIntFromInterval";

function randomColour() {
  return shadeHexColor(
    "#" + Math.floor(Math.random() * 16777215).toString(16),
    -0.3
  );
}

const Vehicle = ({ vehicle, width }: { vehicle: any; width: any }) => {
  const [animationKey, setAnimationKey] = useState(0);
  const handleAnimationComplete = () => {
    // generate new Car, speed etc on each animation finishing
    vehicle.svg = (
      <Car body={randomColour()} headlight="#F2AE00" rearlight="#FF0404" />
    );
    vehicle.speed = randomIntFromInterval(2, 7);
    vehicle.delay = randomIntFromInterval(2, 10);
    setAnimationKey((prevKey) => prevKey + 1);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          transition={{
            duration: vehicle.speed,
            ease: "linear",
            delay: vehicle.delay,
          }}
          key={animationKey}
          initial={{ left: -70 }}
          animate={{ left: width + 70 }}
          onAnimationComplete={handleAnimationComplete}
          className="absolute bottom-0"
        >
          {vehicle.svg}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Vehicle;
