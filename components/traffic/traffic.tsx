import shadeHexColor from "utils/shadeHexColor";
import Car from "./car";
import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import randomIntFromInterval from "utils/randomIntFromInterval";
import Vehicle from "./vehicle";

type Traffic = {
  volume: number;
};

type Vehicles = {
  svg: JSX.Element;
  speed: number;
  delay: number;
};

function randomColour() {
  return shadeHexColor(
    "#" + Math.floor(Math.random() * 16777215).toString(16),
    -0.3
  );
}

const Traffic = ({ volume }: { volume: number }) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    // set canvas to full screen size
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    // call draw here, so its reloaded on each draw
  }, []);

  let vehicles: Vehicles[] = [];
  for (let index: number = 0; index < volume; index++) {
    vehicles.push({
      svg: (
        <Car body={randomColour()} headlight="#F2AE00" rearlight="#FF0404" />
      ),
      speed: randomIntFromInterval(2, 7),
      delay: randomIntFromInterval(2, 10),
    });
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
