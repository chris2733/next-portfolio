import RoundedLinks from "pages/elements/roundedlinks";
import AnimateIn from "./animateIn";
import LetterSplitter from "./letterSplitter";
import WordSplitter from "./workSplitter";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";

export default function AboutOverlay() {
  const [hideText, setHideText] = useState(false);
  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-20">
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 duration-500`}>
        <button
          className={`bg-white px-5 py-[4px] rounded-br-full rounded-bl-full shadow-[0px_0px_112px_-2px_rgba(255,255,255,0.75)] uppercase text-xs tracking-wider align-top font-medium duration-300 ${
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
            className="container py-24 sm:py-32 text-center rounded-lg bg-white !max-w-2xl p-8 shadow-[0px_0px_112px_-2px_rgba(255,255,255,0.75)] z-30 relative"
          >
            <div className="absolute top-0 right-0">
              <button
                className="p-5 uppercase text-xs align-top font-medium duration-300"
                onClick={() => setHideText(!hideText)}
              >
                <XMarkIcon className=" stroke-black h-5 w-5" />
              </button>
            </div>
            <h1 className="inline-block overflow-hidden leading-5 mb-4">
              <LetterSplitter
                text={"about"}
                initialDelay={0}
                letterDelay={0.03}
                letterClass="text-lg uppercase duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] cursor-default inline-block font-medium"
              />
            </h1>
            <div className="mx-auto max-w-[730px]">
              <div className="pb-5">
                <WordSplitter
                  text="About me here"
                  initialDelay={0.2}
                  wordDelay={0.002}
                  wordClass=""
                />
              </div>
              <div className="mt-2 flex items-center justify-center gap-3">
                <AnimateIn delay={1} duration={0.6}>
                  <RoundedLinks
                    link="/"
                    buttonClasses="text-black font-bold text-sm"
                    strokeColour="black"
                  >
                    home
                  </RoundedLinks>
                </AnimateIn>
                <AnimateIn delay={1.1} duration={0.6}>
                  <RoundedLinks
                    link="/work"
                    buttonClasses="text-black font-bold text-sm"
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
