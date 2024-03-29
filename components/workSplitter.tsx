import { motion } from "framer-motion";
import { useState } from "react";

export default function WordSplitter({
  text,
  boldText,
  boldTextClass,
  initialDelay,
  wordDelay,
  wordClass,
  speed = "duration-300",
}: {
  text?: string;
  boldText?: string;
  boldTextClass?: boolean;
  initialDelay?: number;
  wordDelay?: number;
  wordClass?: string;
  speed?: string;
}) {
  const [boldTextLoaded, setboldTextLoaded] = useState<boolean>(false);
  // check over this, needed to check if text was undefined so it didnt throw a non iterable error
  // and theres some repetition
  const splittext: string[] =
    text !== undefined ? text.trim().split(/\s+/) : [""];

  const splitboldtext: string[] =
    boldText !== undefined ? boldText.trim().split(/\s+/) : [""];

  // delay normal text if bold text is present - delay by boldtext length
  const boldTextModifier =
    boldText !== undefined ? boldText.length * (wordDelay ? wordDelay : 0) : 0;

  // TODO: add types here
  const boldTextArray =
    splitboldtext &&
    splitboldtext.map((el, i, arr) => (
      <span key={`boldwordsplitter${i}`}>
        <span className="overflow-hidden inline-block">
          <motion.span
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {
                y: "100%",
              },
              visible: {
                y: "0",
                transition: {
                  delay:
                    i * (wordDelay ? wordDelay : 0.2) +
                    (initialDelay ? initialDelay + boldTextModifier : 0),
                },
              },
            }}
            className={`${speed} inline-block mr-[0.2em] font-medium ${wordClass} ${boldTextClass}`}
            onAnimationComplete={() => {
              if (i + 1 === arr.length) {
                setboldTextLoaded(true);
              }
            }}
          >
            {`${el} `}
          </motion.span>
        </span>
      </span>
    ));

  const normalTextArray =
    splittext &&
    splittext.map((el, i, arr) => (
      <span className="overflow-hidden inline-block" key={`wordsplitter${i}`}>
        <motion.span
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {
              y: "100%",
            },
            visible: {
              y: "0",
              transition: {
                delay:
                  i * (wordDelay ? wordDelay : 0.2) +
                  (initialDelay ? initialDelay + boldTextModifier : 0),
              },
            },
          }}
          className={`${speed} inline-block ${
            i !== arr.length - 1 && "mr-[0.2em]"
          } ${wordClass && wordClass}`}
        >
          {`${el} `}
        </motion.span>
      </span>
    ));

  return (
    <div className={`px-1 group hover:px-0 highlightedlink-parent ${speed}`}>
      {splitboldtext !== undefined && boldText !== undefined && (
        <span className={`highlightedlink ${boldTextLoaded && "__visible"}`}>
          {boldTextArray}
        </span>
      )}
      {splitboldtext !== undefined && splittext !== undefined && (
        <span className="overflow-hidden inline-block">
          <motion.span
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {
                y: "100%",
              },
              visible: {
                y: "0",
                transition: {
                  delay:
                    splitboldtext.length * (wordDelay ? wordDelay : 0.2) +
                    (initialDelay ? initialDelay + boldTextModifier : 0),
                },
              },
            }}
            className={`${speed} inline-block mr-[0.2em] font-medium px-0 group-hover:px-1 ${wordClass} ${boldTextClass}`}
          >
            {` - `}
          </motion.span>
        </span>
      )}
      {splittext !== undefined && normalTextArray}
    </div>
  );
}
