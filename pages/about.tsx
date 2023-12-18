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
import OutstaticTitleContent from "types/outstaticTitleContent";
import OutstaticContent from "types/outstaticContent";
import rainJS from "public/rain.js";

const About = ({
  pageContent,
  canvasText,
}: {
  pageContent: OutstaticTitleContent;
  canvasText: OutstaticContent;
}) => {
  const [apiDataRecieved, setApiDataRecieved] = useState({});
  const [apiResponseOk, setApiResponseOk] = useState(false);
  const [useTestData, setUseTestData] = useState(true);
  const [showCanvas, setShowCanvas] = useState(true);
  const [testDataTime, setTestDataTime] = useState<number>(
    dataTimeOptions.filter((el) => el.name === "Dusk")[0].time
  ); // set default test data time to dusk - is nice (but using the previous skylight to get the next, dusk)
  const [hideRain, sethideRain] = useState<boolean>(false);

  // function startRainJS() {
  //   rainJS(300);
  // }

  useEffect(() => {
    rerenderCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      )
        .then((data) => {
          // console.log("Retreived current weather: ", data);
          if (data !== undefined && Object.keys(data).length !== 0) {
            setApiDataRecieved(data);
            setApiResponseOk(true);
          }
        })
        .then(() => {
          setShowCanvas(true);
          setTimeout(() => {
            rainJS(300);
          }, 500);
        });
    }, 1200);
  }

  return (
    <>
      <NextSeo title="About" />
      <PageTransitionWrapper classes="min-h-screen relative grid place-items-center grid-cols-1">
        {/* <div className="fixed w-auto top-0 left-0 z-30 flex flex-col gap-2">
          <button
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
          </button>
          <button
            className="bg-white opacity-50"
            onClick={() => sethideRain(!hideRain)}
          >
            Toggle Rain
          </button>
        </div> */}
        {apiResponseOk && (
          <AnimatePresence>
            {showCanvas === true && (
              <>
                <CanvasWrapper
                  apiDataRecieved={apiDataRecieved}
                  hideRain={hideRain}
                />
              </>
            )}
          </AnimatePresence>
        )}
        {/* canvas here to test without api call */}
        {/* <Canvas /> */}
        <AboutOverlay
          content={pageContent?.content}
          canvasText={canvasText?.content}
          dataTimeOptions={dataTimeOptions}
          useTestData={useTestData}
          rerenderCanvas={rerenderCanvas}
          setTestDataTime={setTestDataTime}
          testDataTime={testDataTime}
        />
      </PageTransitionWrapper>
    </>
  );
};

export default About;

export const getStaticProps = async () => {
  const pageContent = getDocumentBySlug("abouts", "profile", [
    "title",
    "content",
  ]);
  const canvasText = getDocumentBySlug("abouts", "canvaslink", ["content"]);
  return {
    props: { pageContent, canvasText },
  };
};
