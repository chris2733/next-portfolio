import axios from "axios";
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz";
import { getUnixTime } from "date-fns";

export default async function CurrentWeather(
  useTestData: boolean,
  testData: Object,
  testDataTime: number
) {
  // HEEREEE is where we set the right timezone
  const currentUnix =
    getUnixTime(utcToZonedTime(new Date(), "Europe/London")) * 1000;

  try {
    if (useTestData === true) {
      const apiDataConverted = SuccessfulResult(testData, testDataTime);
      // console.log("testdata: ", apiDataConverted);
      return apiDataConverted;
      // return api result is ok
    } else {
      // this may look like it's calling twice in dev, but thats because of strictmode - if this is set to false in next.config.js it only happens once
      if (localStorage.getItem("apiData") === null) {
        const newData = await getData();
        // console.log(
        //   "Getting api data first time: ",
        //   SuccessfulResult(newData?.data, currentUnix)
        // );
        return SuccessfulResult(newData?.data, currentUnix);
      } else if (
        localStorage.getItem("apiData") !== null &&
        typeof localStorage.getItem("apiData") === "string"
      ) {
        // check if the expiry time has gone by, if not, use the existing data stored in localstorage
        if (
          localStorage.getItem("expiry") !== null &&
          new Date().getTime() > Number(localStorage.getItem("expiry"))
        ) {
          getData().then((data) => {
            // console.log("Expiry date gone by, getting new data: ", data?.data);
            return SuccessfulResult(data?.data, currentUnix);
          });
        } else {
          const dataGrabbed: string = localStorage.getItem("apiData")!;
          // console.log("api on cooldown: ", dataGrabbed); // works
          return SuccessfulResult(JSON.parse(dataGrabbed).data, currentUnix);
        }
      } else {
        console.log("Error getting data");
      }
    }
  } catch (error) {
    console.log("getcurrentweather error: ", error);
  }
}

function SuccessfulResult(data: any, currentUnix: number) {
  // console.log("formatting succesful result: ", data);
  // weather data
  interface weatherData {
    name: string;
    lat: number;
    lon: number;
    time: number;
    sunrise: number;
    sunset: number;
    temperature: number;
    visibility?: number;
  }
  /* If some of these don't appear, its because they arent happenning, so check for them */
  const weather: weatherData = {
    name: data.name,
    lat: data.coord.lat,
    lon: data.coord.lon,
    time: currentUnix,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    temperature: data.main.temp,
    ...("visibliity" in data && { Visibility: data.visibility }),
    ...("wind" in data && { Visibility: data.wind.speed }),
    ...("clouds" in data && { Visibility: data.clouds.all }),
    ...("rain" in data && { Visibility: data.rain }),
    ...("snow" in data && { Visibility: data.snow }),
    ...("clouds" in data && { Visibility: data.clouds.all }),
  };
  // getting sun position with suncalc
  const SunCalc = require("suncalc");

  // need to pass in the right timezone thing here
  const skyLightTypes = SunCalc.getTimes(
    weather.time,
    weather.lat,
    weather.lon
  );
  // get current type of light in sky
  // sort sky times into an ordered array of arrays
  const skyLightTypesSort = Object.entries(skyLightTypes).sort(
    (a: [string, any], b: [string, any]) => {
      return a[1] - b[1];
    }
  );
  // converting time to unix here since i cant figure out map without typescript being alittle bitch
  let skyLightTypesSortUnix = new Array();
  skyLightTypesSort.forEach((el: [string, any]) => {
    skyLightTypesSortUnix.push([el[0], el[1].getTime()]);
  });
  // set the index of the current and next light here, 0 for now
  let skyLightCurrentIndex: number = 0;
  skyLightTypesSortUnix.forEach((each: [string, any], index) => {
    if (weather.time > each[1]) {
      skyLightCurrentIndex = index;
    }
  });
  const currentSkyLight: string =
    skyLightTypesSortUnix[skyLightCurrentIndex][0];
  // set the next skylight to the next index, if its at the end, its 0
  const skyLightNextIndex: number =
    skyLightCurrentIndex === skyLightTypesSortUnix.length - 1
      ? 0
      : skyLightCurrentIndex + 1;
  const nextSkyLight: string = skyLightTypesSortUnix[skyLightNextIndex][0];
  // set the current progression of the current skylight here, how far through that section it is
  const currentSkyLightStart = formatInTimeZone(
    new Date(skyLightTypesSortUnix[skyLightCurrentIndex][1]),
    "Europe/London",
    "HHmm"
  );
  /*
    adding a check here, since sometimes night & nightEnd return NaN, not sure why yet, but moving to the next skylight until it finds a non NaN works for now
    TODO: Get a better fix with a loop, or find root issue
   */
  let currentSkyLightEnd;
  if (isNaN(skyLightTypesSortUnix[skyLightNextIndex][1])) {
    currentSkyLightEnd = formatInTimeZone(
      new Date(skyLightTypesSortUnix[0][1]),
      "Europe/London",
      "HHmm"
    );
  } else {
    currentSkyLightEnd = formatInTimeZone(
      new Date(skyLightTypesSortUnix[skyLightNextIndex][1]),
      "Europe/London",
      "HHmm"
    );
  }

  // need to make sure date is set to gmt - that was a wierd fucking bug
  let timeNow = formatInTimeZone(weather.time, "Europe/London", "HHmm");
  // progress here - time since the start of current sky light segment, as a percentage of the size of current sky light segment
  // now... if the start sky light is less than the current, say if its rolling over from midnight it fucks everything up - have to convert something like 2am to a 24hr clock so my maths works out
  if (Number(timeNow) < Number(currentSkyLightStart)) {
    currentSkyLightEnd = String(Number(currentSkyLightEnd) + 2400);
    timeNow = String(Number(timeNow) + 2400);
  }
  const skyProgress =
    (parseInt(timeNow) - parseInt(currentSkyLightStart)) /
    Math.abs(parseInt(currentSkyLightEnd) - parseInt(currentSkyLightStart));

  // sun and moon position got here
  const sunPosition = SunCalc.getPosition(
    weather.time,
    weather.lat,
    weather.lon
  );
  const moonPosition = SunCalc.getMoonPosition(
    weather.time,
    weather.lat,
    weather.lon
  );

  // distance of moon from earth
  const moonDistance = moonPosition.distance;
  // moon illumination, phase and angle, see docs
  const moonIllumination = SunCalc.getMoonIllumination(weather.time);

  // degrees calculated from the right of a circle - adding 90 on so its from the horizon, otherwise canvas draws it from the top
  const sunDegrees = (sunPosition.azimuth * 180) / Math.PI;
  const moonDegrees = (moonPosition.azimuth * 180) / Math.PI;

  return {
    weather,
    sunDegrees,
    moonDegrees,
    currentSkyLight,
    nextSkyLight,
    skyProgress,
  };
}

async function getData() {
  try {
    const data = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?id=2653822&appid=${process.env.NEXT_PUBLIC_OPENMAP_API}&units=metric`
    );
    // handle success
    // console.log("Openmap weather api GREAET SUCCESS:", data);
    // console.log(response.data);
    // set local storage to contain response and cooldown
    localStorage.setItem("apiData", JSON.stringify(data));
    // set expiry on localStorage, with new Date().getTime();
    // set minutes by mins * 60000, to get away from milliseconds
    const expiry = String(new Date().getTime() + 1 * 60000);
    localStorage.setItem("expiry", expiry);

    // return data here
    // console.log("fetching new data: ", data);
    return data;
  } catch (error) {
    console.log("Openmap weather api: " + error);
  }
}
