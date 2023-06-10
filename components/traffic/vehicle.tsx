import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import newVehicle from "utils/newVehicle";

const Vehicle = ({ vehicle, width }: { vehicle: any; width: any }) => {
  const [animationKey, setAnimationKey] = useState(0);
  const vehicleOffset = 120; // how far off screen to push it

  const handleAnimationComplete = () => {
    // generate new Car, speed etc on each animation finishing
    Object.assign(vehicle, newVehicle);
    setAnimationKey((prevKey) => prevKey + 1);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          transition={{
            duration: width / vehicle.speed,
            ease: "linear",
            delay: vehicle.delay,
          }}
          key={animationKey}
          initial={{ left: -vehicleOffset }}
          animate={{ left: width + vehicleOffset }}
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
