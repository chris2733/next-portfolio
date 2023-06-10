import Car from "components/traffic/car";
import randomColour from "./randomColour";
import randomIntFromInterval from "./randomIntFromInterval";
import SportsCar from "components/traffic/sportsCar";
import Lorry from "components/traffic/lorry";
import VehicleMotion from "types/vehicleMotion";

function getRandomVehicle() {
  const random = randomIntFromInterval(0, 5);
  if (random < 1) {
    return SportsCar;
  } else if (random < 2) {
    return Lorry;
  } else {
    return Car;
  }
}

export default function newVehicle() {
  const RandomVehicle = getRandomVehicle();
  const speed =
    RandomVehicle === SportsCar
      ? randomIntFromInterval(80, 120)
      : randomIntFromInterval(50, 100);
  const vehicle: VehicleMotion = {
    svg: (
      <RandomVehicle
        body={randomColour()}
        headlight="#F2AE00"
        rearlight="#FF0404"
      />
    ),
    speed: speed,
    delay: randomIntFromInterval(1, 20),
  };
  return vehicle;
}
