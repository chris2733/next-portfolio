import { NextSeo } from "next-seo";
import PageTransitionWrapper from "components/pageTransition";
import { useEffect, useState } from "react";
import CurrentWeather from "utils/getCurrentWeather";
import { AnimatePresence } from "framer-motion";
import CanvasWrapper from "components/canvasWrapper";
import AboutOverlay from "components/aboutOverlay";
import { testData, dataTimeOptions } from "utils/testData";
import Traffic from "components/traffic/traffic";
import {
  getDocuments,
  getCollections,
  getDocumentBySlug,
} from "outstatic/server";

const About = ({ pageContent }: { pageContent: any }) => {
  const [apiDataRecieved, setApiDataRecieved] = useState({});
  const [apiResponseOk, setApiResponseOk] = useState(false);
  const [useTestData, setUseTestData] = useState(true);
  const [showCanvas, setShowCanvas] = useState(true);
  const [testDataTime, setTestDataTime] = useState<number>(
    dataTimeOptions.filter((el) => el.name === "Dusk")[0].time
  ); // set default test data time to dusk - is nice (but using the previous skylight to get the next, dusk)
  const [hideRain, sethideRain] = useState<boolean>(true);

  useEffect(() => {
    rerenderCanvas();
  }, []);

  function rerenderCanvas(
    useTestDataTrue?: boolean,
    setTestDataTimeNumber?: number
  ) {
    setShowCanvas(false);
    useTestDataTrue && setUseTestData(useTestDataTrue);
    setTestDataTimeNumber && setTestDataTime(setTestDataTimeNumber);
    setTimeout(() => {
      CurrentWeather(
        useTestDataTrue ? useTestDataTrue : useTestData,
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

  console.log(pageContent.content);

  return (
    <>
      <NextSeo title="About" />
      <PageTransitionWrapper classes="min-h-screen relative overflow-hidden">
        <div className="fixed w-auto top-0 left-0 z-30 flex flex-col gap-2">
          {/* <button
            className="bg-white opacity-50"
            onClick={() => rerenderCanvas(true, testDataTime)}
          >
            use Test data
          </button>
          <button
            className="bg-white opacity-50"
            onClick={() => rerenderCanvas(false)}
          >
            Use live api data
          </button> */}
          <button
            className="bg-white opacity-50"
            onClick={() => sethideRain(!hideRain)}
          >
            Toggle Rain
          </button>
          {useTestData === true && (
            <select
              name="time"
              id=""
              onChange={(el) => {
                rerenderCanvas(undefined, Number(el.target.value));
                setTestDataTime(Number(el.target.value));
              }}
              value={testDataTime}
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
              <>
                <CanvasWrapper
                  apiDataRecieved={apiDataRecieved}
                  hideRain={hideRain}
                />
                {/* <Traffic /> */}
              </>
            )}
          </AnimatePresence>
        )}
        {/* canvas here to test without api call */}
        {/* <Canvas /> */}
        <AboutOverlay content={pageContent?.content} />
      </PageTransitionWrapper>
    </>
  );
};

export default About;

export const getStaticProps = async () => {
  const pageContent = getDocumentBySlug("abouts", "profile", [
    "title",
    "publishedAt",
    "slug",
    "author",
    "content",
    "coverImage",
  ]);
  return {
    props: { pageContent },
  };
};
