import { useState, useEffect } from "react";
import Vehicle from "./vehicle";
import VehicleMotion from "types/vehicleMotion";
import newVehicle from "utils/newVehicle";

const Traffic = () => {
  const [width, setWidth] = useState(0);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
    // set volume as a ratio of screen width, 6 cars per 200 px, multipled by 3
    setVolume(Math.ceil(width / 200) * 3);
  }, [width]);

  let vehicles: VehicleMotion[] = [];
  for (let index: number = 0; index < volume; index++) {
    vehicles.push(newVehicle());
  }

  return (
    <div className="absolute bottom-0 left-0 h-16 overflow-hidden z-10 w-full">
      {vehicles &&
        vehicles.map((vehicle, index) => (
          <Vehicle vehicle={vehicle} width={width} key={index} />
        ))}
    </div>
  );
};

export default Traffic;
