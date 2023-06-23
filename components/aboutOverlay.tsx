import RoundedLinks from "elements/roundedlinks";
import AnimateIn from "./animateIn";
import LetterSplitter from "./letterSplitter";
import WordSplitter from "./workSplitter";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export default function AboutOverlay({
  content,
  canvasText,
  dataTimeOptions,
  useTestData,
  rerenderCanvas,
  setTestDataTime,
  testDataTime,
}: {
  content: any;
  canvasText: any;
  dataTimeOptions: any;
  useTestData: boolean;
  rerenderCanvas: any;
  setTestDataTime: any;
  testDataTime: any;
}) {
  const [hideText, setHideText] = useState<boolean>(false);
  const [canvasTextContent, setcanvasTextContent] = useState<string[]>([
    canvasText,
  ]);
  const [showModal, setshowModal] = useState<boolean>(false);

  const buttonClasses = "text-black font-bold text-sm";

  useEffect(() => {
    if (canvasText && canvasText?.toLowerCase().includes("[canvas]")) {
      const splitArray = canvasText.split("[canvas]");
      setcanvasTextContent(splitArray);
    }
  }, []);

  return (
    <div className="relative z-20 py-5 lg:py-10 !max-w-2xl">
      <AnimatePresence>
        {showModal && !hideText && (
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] z-40 bg-white px-10 py-12 text-center rounded-lg"
            variants={{
              hidden: {
                opacity: 0,
              },
              visible: {
                opacity: 0.9,
              },
              exit: {
                opacity: 0,
              },
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <CloseButton closeFunction={setshowModal} state={showModal} />
            {useTestData === true && (
              <>
                <p>Choose a time of day to set the backgoround:</p>
                <select
                  name="time"
                  id=""
                  onChange={(el) => {
                    rerenderCanvas(undefined, Number(el.target.value));
                    setTestDataTime(Number(el.target.value));
                  }}
                  value={testDataTime}
                >
                  {dataTimeOptions.map((el: any, id: any) => (
                    <option value={el.time} key={`timeoption${id}`}>
                      {el.name}
                    </option>
                  ))}
                </select>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <ShowTextButton hideText={hideText} setHideText={setHideText} />
      <AnimatePresence>
        {hideText === false && (
          <motion.div
            animate={{
              opacity: 0.85,
              scale: 1,
              translateY: "0",
              transition: { duration: 0.1 },
            }}
            initial={{
              opacity: 0,
              scale: 0.98,
              translateY: "-1vh",
            }}
            exit={{ opacity: 0, translateY: "-1vh", scale: 0.98 }}
            transition={{ duration: 0.1 }}
            className="container py-16 text-center rounded-lg bg-white px-12 sm:p-16 shadow-[0px_0px_56px_-2px_rgba(255,255,255,0.75)] z-30 relative"
          >
            <CloseButton closeFunction={setHideText} state={hideText} />
            <h1 className="inline-block overflow-hidden leading-5 mb-4">
              <LetterSplitter
                text={"about"}
                initialDelay={0}
                letterDelay={0.03}
                letterClass="text-lg uppercase duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] cursor-default inline-block font-medium"
              />
            </h1>
            <div className="mx-auto max-w-[730px]">
              <div className="pb-5 markdownstyle">
                <AnimateIn delay={0.7} duration={0.6}>
                  <ReactMarkdown>{content}</ReactMarkdown>
                  <div>
                    {canvasTextContent.length > 1 ? (
                      <OptionsModalTrigger
                        textArray={canvasTextContent}
                        setshowModal={setshowModal}
                      />
                    ) : (
                      canvasTextContent.join(" ")
                    )}
                  </div>
                </AnimateIn>
              </div>
              <div className="mt-2 flex items-center justify-center gap-3">
                <AnimateIn delay={1} duration={0.6}>
                  <RoundedLinks
                    link="/"
                    buttonClasses={buttonClasses}
                    strokeColour="black"
                  >
                    home
                  </RoundedLinks>
                </AnimateIn>
                <AnimateIn delay={1.1} duration={0.6}>
                  <RoundedLinks
                    link="/work"
                    buttonClasses={buttonClasses}
                    strokeColour="black"
                  >
                    work
                  </RoundedLinks>
                </AnimateIn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OptionsModalTrigger({
  textArray,
  setshowModal,
}: {
  textArray: string[];
  setshowModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <p>
      {textArray[0]}
      <button
        className="highlightedlink __singlelink"
        onClick={() => setshowModal(true)}
      >
        canvas
      </button>
      {textArray[1] === "." ? " ." : "."}
    </p>
  );
}

function ShowTextButton({
  hideText,
  setHideText,
}: {
  hideText: boolean;
  setHideText: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className={`absolute top-0 left-1/2 -translate-x-1/2 duration-500`}>
      <button
        className={`bg-white px-5 py-[4px] rounded-br-full rounded-bl-full shadow-[0px_0px_56px_-2px_rgba(255,255,255,0.75)] uppercase text-xs tracking-wider align-top font-medium duration-300 ${
          hideText
            ? "opacity-50 hover:opacity-90 translate-y-0"
            : "opacity-0 -translate-y-1"
        }`}
        onClick={() => setHideText(!hideText)}
        disabled={!hideText}
      >
        Show text
      </button>
    </div>
  );
}

function CloseButton({
  closeFunction,
  state,
}: {
  closeFunction: (value: boolean) => void;
  state: boolean;
}) {
  return (
    <div className="absolute top-0 right-0">
      <button
        className="p-5 uppercase text-xs align-top font-medium duration-300 !text-[0px]"
        onClick={() => closeFunction(!state)}
      >
        <XMarkIcon className=" stroke-black h-5 w-5" />
        close
      </button>
    </div>
  );
}
