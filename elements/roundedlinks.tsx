import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function returnRoundedNumber(num: number) {
  return Number(num.toFixed(2));
}

export default function RoundedLinks({
  link,
  children,
  buttonClasses,
  borderClasses,
  strokeColour,
}: {
  link: string;
  children: React.ReactNode | React.ReactNode[];
  buttonClasses?: string;
  borderClasses?: string;
  strokeColour?: string;
}) {
  const [dashoffset, setDashoffset] = useState<number>(0);
  const [pathLength, setPathLength] = useState<number>(0);
  const [pathLengthHover, setPathLengthHover] = useState<number>(0);
  const textEl = useRef<HTMLInputElement>(null);
  const buttonEl = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (buttonEl.current !== null) {
      // getting the circumference of the whole button, using pi to calc the rounded edges
      // button widths and heights here +2 for adjustment
      const buttonWidth: number = buttonEl.current.offsetWidth + 2;
      const buttonHeight: number = buttonEl.current.offsetHeight + 2;
      const buttonRoundedCircum: number = buttonHeight * Math.PI;

      const buttonCircum =
        (buttonWidth - buttonHeight) * 2 + buttonRoundedCircum;
      // maybe catch this so its not 16 decimal points, while making sure its a number
      buttonEl.current !== null && setPathLength(buttonCircum);
    }

    textEl.current !== null && setPathLengthHover(textEl.current.offsetWidth);
    // set pathlength here as width of text, so it can be offset accurately everytime(ish)
  }, []);

  return (
    <>
      {/* i think this was causing errors if left not with a default option, not sure though, or sure of best fix */}
      <Link href={link ? link : "/"}>
        <span
          ref={buttonEl}
          className={`px-[12px] py-[4px] inline-block rounded-full relative opacity-80 outlinehover uppercase ${buttonClasses}`}
          onMouseOver={() =>
            setDashoffset(returnRoundedNumber(pathLength - pathLengthHover))
          }
          onMouseLeave={() => setDashoffset(0)}
        >
          <span ref={textEl} className=" align-text-top">
            {children}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute w-[100%] h-[90%] scale-y-[-1] left-[0%] top-[5%]"
          >
            <rect
              rx="15"
              y="0.5"
              x="1"
              fill="none"
              strokeWidth="2"
              pathLength={pathLength}
              strokeDasharray={returnRoundedNumber(
                pathLength * (dashoffset === 0 ? 1.03 : 1)
              )} // adding 5% to avoid gap on mobile
              strokeDashoffset={dashoffset}
              stroke={strokeColour ? strokeColour : "white"}
              width="95%"
              height="95%"
              className={`duration-[0.4s] ease-in-out ${borderClasses}`}
            ></rect>
          </svg>
        </span>
      </Link>
    </>
  );
}
