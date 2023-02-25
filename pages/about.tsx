import { NextSeo } from "next-seo";
import PageTransitionWrapper from "./components/pageTransition";
import { useEffect, useState } from "react";
import CurrentWeather from "./utils/getCurrentWeather";
import { AnimatePresence } from "framer-motion";
import CanvasWrapper from "./components/canvasWrapper";
import AboutOverlay from "./components/aboutOverlay";

const About = () => {
  const [apiDataRecieved, setApiDataRecieved] = useState({});
  const [apiResponseOk, setApiResponseOk] = useState(false);
  const [useTestData, setUseTestData] = useState(false);
  const [showCanvas, setShowCanvas] = useState(true);
  const [testDataTime, setTestDataTime] = useState(1665497241000);

  // test data to show night and day
  const testData: object = {
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
    rain: {
      "1h": 3.16,
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
    rerenderCanvas();
  }, []);

  const dataTimeOptions: { name: string; time: number }[] = [
    {
      name: "Noon",
      time: 1665497241000,
    },
    {
      name: "Golden hour",
      time: 1671375859222,
    },
    {
      name: "Sunset start",
      time: 1671379286041,
    },
    {
      name: "Sunset",
      time: 1671379549141,
    },
    {
      name: "Dusk",
      time: 1671381963915,
    },
    {
      name: "Nautical dusk",
      time: 1671384551447,
    },
    {
      name: "Night",
      time: 1665442803000,
    },
    {
      name: "Nadir",
      time: 1671322233274,
    },
    {
      name: "Night end",
      time: 1671343869509,
    },
    {
      name: "Nautical dawn",
      time: 1671346315101,
    },
    {
      name: "Dawn",
      time: 1671348902633,
    },
    {
      name: "Sunrise",
      time: 1671351317407,
    },
    {
      name: "Sunrise end",
      time: 1671351580506,
    },
    {
      name: "Golden hour end",
      time: 1671355007325,
    },
  ];

  function rerenderCanvas(
    useTestDataTrue?: boolean,
    setTestDataTimeNumber?: number
  ) {
    setShowCanvas(false);
    setTimeout(() => {
      useTestDataTrue && setUseTestData(useTestDataTrue);
      setTestDataTimeNumber && setTestDataTime(setTestDataTimeNumber);
      CurrentWeather(
        useTestData,
        testData,
        setTestDataTimeNumber ? setTestDataTimeNumber : testDataTime
      ).then((data) => {
        // console.log("Retreived current weather: ", data);
        if (data !== undefined && Object.keys(data).length !== 0) {
          setApiDataRecieved(data);
          setApiResponseOk(true);
        }
      });
      setShowCanvas(true);
    }, 500);
  }

  return (
    <>
      <NextSeo title="About" />
      <PageTransitionWrapper classes="min-h-screen relative overflow-hidden">
        <div className="fixed w-auto top-0 left-0 z-30 flex flex-col gap-2">
          <button
            className="bg-white opacity-50"
            onClick={() => rerenderCanvas(true)}
          >
            use Test data
          </button>
          <button
            className="bg-white opacity-50"
            onClick={() => rerenderCanvas(false)}
          >
            Use live api data
          </button>
          {useTestData === true && (
            <select
              name="time"
              id=""
              onChange={(el) => {
                rerenderCanvas(undefined, Number(el.target.value));
              }}
            >
              {dataTimeOptions.map((el, id) => (
                <option value={el.time} key={`timeoption${id}`}>
                  {el.name}
                </option>
              ))}
            </select>
          )}
        </div>
        {apiResponseOk && (
          <AnimatePresence>
            {showCanvas === true && (
              <CanvasWrapper apiDataRecieved={apiDataRecieved} />
            )}
          </AnimatePresence>
        )}
        {/* canvas here to test without api call */}
        {/* <Canvas /> */}
        <AboutOverlay />
      </PageTransitionWrapper>
    </>
  );
};

export default About;
