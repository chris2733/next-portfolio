import skyColours, { skyColourEach, skyColourTypes } from "./skyColours";

export default function getCurrentSkyGradient(
  currentSkyLight: string,
  nextSkyLight: string,
  skyProgress: number,
  skyColours: skyColourTypes
) {
  // set the colour stops for different times, from suncalc

  // get the right colour from skycolours, setup properly in typescript
  // setting the string currentSkyLight as a definite type, in this case being a string that is equal to one of the keys in the object
  type ObjectKey = keyof typeof skyColours;
  let currentSkyLightGradients = skyColours[currentSkyLight as ObjectKey];
  const nextSkyLightGradients = skyColours[nextSkyLight as ObjectKey];
  // re-set the sky gradients according to skyProgress, between currentSkyLight and nextSkyLight
  let newSky: { stop: number; color: string }[] = [];
  currentSkyLightGradients &&
    nextSkyLightGradients &&
    currentSkyLightGradients.forEach(
      (gradient: skyColourEach, index: number) => {
        // get stop difference
        let stopDifference = nextSkyLightGradients[index].stop - gradient.stop;
        let stop = parseFloat(
          ((gradient.stop + stopDifference) * skyProgress).toFixed(2)
        );
        // get rgb difference
        let rgbCurrent: number[] = gradient.color
          .replace(/[()'rgb']/g, " ")
          .replaceAll(" ", "")
          .split(",")
          .map((x: string) => parseInt(x));
        let rgbNext: number[] = nextSkyLightGradients[index].color
          .replace(/[()'rgb']/g, " ")
          .replaceAll(" ", "")
          .split(",")
          .map((x) => parseInt(x));
        let rgbNew: number[] = [];
        rgbCurrent.forEach((rgb, index) => {
          let rgbChange = rgbNext[index] - rgb;
          rgbNew.push(Number((rgb + rgbChange * skyProgress).toFixed()));
        });
        newSky.push({ stop: stop, color: `rgb(${rgbNew})` });
      }
    );
  return newSky;
}
