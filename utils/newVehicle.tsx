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

function getRandomColour() {
  const random = randomIntFromInterval(0, 100);
  if (random < 6) {
    // random
    return randomColour();
  } else if (random < 10) {
    // red
    var num = randomIntFromInterval(90, 255);
    return `rgb(${num},0,0)`;
  } else if (random < 32) {
    // blue
    var num = randomIntFromInterval(90, 255);
    return `rgb(0,0,${num})`;
  } else if (random < 49) {
    // white
    var num = randomIntFromInterval(220, 255);
    return `rgb(${num},${num},${num})`;
  } else if (random < 70) {
    // black
    var num = randomIntFromInterval(0, 50);
    return `rgb(${num},${num},${num})`;
  } else {
    // grey
    var num = randomIntFromInterval(70, 220);
    return `rgb(${num},${num},${num})`;
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
        body={getRandomColour()}
        headlight="#F2AE00"
        rearlight="#FF0404"
      />
    ),
    speed: speed,
    delay: randomIntFromInterval(1, 20),
  };
  return vehicle;
}
