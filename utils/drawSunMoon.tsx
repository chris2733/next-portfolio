import degToRadian from "./degToRadian";
import sunMoonPosition from "./sunMoonPosition";

export default function drawSunMoon(
  paintbrush: CanvasRenderingContext2D,
  data: any,
  width: number,
  height: number,
  horizon: number,
  radianAdjust: number,
  sunColour: string,
  moonColour: string
) {
  // position in radians from a point on a circle, converted from degrees to radians
  const sunRadians = degToRadian(data.sunDegrees);
  const moonRadians = degToRadian(data.moonDegrees);
  const orbitCentreX: number = width * 0.5;
  const orbitCentreY: number = height - horizon;
  // set orbit radius to width of the screen, only if its smaller than the screen height (for super fucking wide screens), otherwise use height
  const orbitRadius: number = width < height ? width * 0.48 : height * 0.48;
  const sunRadius: number = 25;
  const moonRadius: number = 15;
  // sun position
  const sun = sunMoonPosition(
    paintbrush,
    sunRadians,
    orbitCentreX,
    orbitCentreY,
    orbitRadius,
    sunRadius,
    sunColour,
    radianAdjust,
    width,
    height,
    horizon,
    true
  );
  // moon position
  const moon = sunMoonPosition(
    paintbrush,
    moonRadians,
    orbitCentreX,
    orbitCentreY,
    orbitRadius,
    moonRadius,
    moonColour,
    radianAdjust,
    width,
    height,
    horizon
  );
}
