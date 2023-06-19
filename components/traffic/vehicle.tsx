import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import newVehicle from "utils/newVehicle";

type Vehicle = {
  vehicle: any;
  width: any;
  flip: boolean;
};

const Vehicle = ({ vehicle, width, flip }: Vehicle) => {
  const [animationKey, setAnimationKey] = useState(0);
  const vehicleOffset = 120; // how far off screen to push it

  const handleAnimationComplete = () => {
    // generate new Car, speed etc on each animation finishing
    Object.assign(vehicle, newVehicle);
    setAnimationKey((prevKey) => prevKey + 1);
  };

  const motionType = {
    normal: {
      initial: { left: -vehicleOffset },
      animate: { left: width + vehicleOffset },
    },
    flipped: {
      initial: { right: -vehicleOffset },
      animate: { right: width + vehicleOffset },
    },
  };

  const { initial, animate } = flip ? motionType.normal : motionType.flipped;

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={animationKey}
          transition={{
            duration: width / vehicle.speed,
            ease: "linear",
            delay: vehicle.delay,
          }}
          initial={initial}
          animate={animate}
          onAnimationComplete={handleAnimationComplete}
          className={`absolute bottom-0 ${!flip && "scale-x-[-1]"}`}
        >
          {vehicle.svg}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Vehicle;
