import randomIntFromInterval from "./randomIntFromInterval";

// function for setting up a building buildingLayer, generating random buildings across the screen at a set height
export default function buildingLayer(
  width: number,
  startPointMin: number,
  startPointMax: number,
  endPointMin: number,
  endPointMax: number,
  widthMin: number,
  widthMax: number,
  heightMin: number,
  heightMax: number,
  gapMin: number,
  gapMax: number
) {
  let array = [];
  // set the starter points here, so its drawn correctly in draw, not randomly readded
  // both are random numbers between 0-100 from the edge of canvas
  const start: number = -randomIntFromInterval(startPointMin, startPointMax);
  const end: number = width + randomIntFromInterval(endPointMin, endPointMax);
  for (let x: number = start; x < end; x++) {
    const randomBuildingWidth = randomIntFromInterval(widthMin, widthMax);
    const randomBuildingHeight = randomIntFromInterval(heightMin, heightMax);
    array.push({
      start: x,
      width: randomBuildingWidth,
      height: randomBuildingHeight,
      randomBuildingId: Math.random(),
      randomBuildingId2: Math.random(),
    });
    // add random gap between buildings
    x += randomIntFromInterval(gapMin, gapMax) + randomBuildingWidth;
  }
  return [...array];
}
