import { useState, useEffect } from "react";
import axios from "axios";
import { formatInTimeZone } from "date-fns-tz";

export default function CurrentWeather({
  passDataToParent,
  useTestData,
}: {
  passDataToParent: Function;
  useTestData: boolean;
}) {
  const [apiData, setapiData] = useState({});
  const [apiCallOk, setApiCallOk] = useState(false);
  const [weatherData, setWeatherData] = useState<any>({});
  const currentUnix = new Date().getTime();

  // test data to show night and day
  const testDataCardiff: object = {
    coord: {
      lon: -3.18,
      lat: 51.48,
    },
    weather: [
      {
        id: 803,
        main: "Clouds",
        description: "broken clouds",
        icon: "04n",
      },
    ],
    base: "stations",
    main: {
      temp: 7.04,
      feels_like: 4.58,
      temp_min: 5.57,
      temp_max: 8.4,
      pressure: 1022,
      humidity: 82,
    },
    visibility: 10000,
    wind: {
      speed: 3.6,
      deg: 360,
    },
    clouds: {
      all: 63,
    },
    dt: 1665447422,
    sys: {
      type: 2,
      id: 2045739,
      country: "GB",
      sunrise: 1665469764,
      sunset: 1665509356,
    },
    timezone: 3600,
    id: 2653822,
    name: "Cardiff",
    cod: 200,
  };

  useEffect(() => {
    if (useTestData === true) {
      console.log("use test data");
      // set test data instead
      // const apiDataConverted = SuccessfulResult(testDataCardiff, 1665442803000); //night
      const apiDataConverted = SuccessfulResult(testDataCardiff, 1665497241000); //day
      setWeatherData(apiDataConverted);
      passDataToParent(apiDataConverted);
      setApiCallOk(true);
    } else {
      // this may look like it's calling twice in dev, but thats because of strictmode - if this is set to false in next.config.js it only happens once
      if (localStorage.getItem("apiData") === null) {
        console.log("Getting api data first time");
        getData();
      } else if (
        localStorage.getItem("apiData") !== null &&
        typeof localStorage.getItem("apiData") === "string"
      ) {
        // check if the expiry time has gone by, if not, use the existing data stored in localstorage
        if (
          localStorage.getItem("expiry") !== null &&
          new Date().getTime() > Number(localStorage.getItem("expiry"))
        ) {
          console.log("expiry date gone by, getting new data");
          getData();
        } else {
          console.log("api on cooldown");
          const dataGrabbed: string = localStorage.getItem("apiData")!;
          setapiData(JSON.parse(dataGrabbed).data);
        }
      } else {
        console.log("Error getting data");
      }
    }

    function getData() {
      const response = axios
        .get(
          `http://api.openweathermap.org/data/2.5/weather?id=2653822&appid=${process.env.NEXT_PUBLIC_OPENMAP_API}&units=metric`
        )
        .then(function (response) {
          // handle success
          console.log("Openmap weather api GREAET SUCCESS");
          setapiData(response.data);
          // console.log(response.data);
          // set local storage to contain response and cooldown
          localStorage.setItem("apiData", JSON.stringify(response));
          // set expiry on localStorage, with new Date().getTime();
          // set minutes by mins * 60000, to get away from milliseconds
          const expiry = String(new Date().getTime() + 5 * 60000);
          localStorage.setItem("expiry", expiry);
        })
        .catch(function (error) {
          // handle error
          console.log("Openmap weather api " + error.message);
          return;
        });
    }
  }, [useTestData]);

  useEffect(() => {
    if (Object.keys(apiData).length !== 0) {
      const apiDataConverted = SuccessfulResult(apiData, currentUnix);
      setWeatherData(apiDataConverted);
      passDataToParent(apiDataConverted);
      setApiCallOk(true);
    }
  }, [apiData]);

  return (
    <div className="">
      {apiCallOk && (
        <p>
          Current location: {""}
          {weatherData.weather.name !== undefined && weatherData.weather.name}
        </p>
      )}
    </div>
  );
}

function SuccessfulResult(data: any, currentUnix: number) {
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

  // get sky light colours from mooncalc
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
  const currentSkyLightStartDate = new Date(
    skyLightTypesSortUnix[skyLightCurrentIndex][1]
  );
  const currentSkyLightEndDate = new Date(
    skyLightTypesSortUnix[skyLightNextIndex][1]
  );
  const currentSkyLightStart = `${currentSkyLightStartDate.getHours()}${String(
    currentSkyLightStartDate.getMinutes()
  ).padStart(2, "0")}`;
  let currentSkyLightEnd = `${currentSkyLightEndDate.getHours()}${String(
    currentSkyLightEndDate.getMinutes()
  ).padStart(2, "0")}`;
  // need to make sure date is set to gmt - that was a wierd fucking bug
  let timeNow = formatInTimeZone(weather.time, "Europe/Dublin", "HHmm");
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

  // degrees calculated from like top of a circle i think
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
