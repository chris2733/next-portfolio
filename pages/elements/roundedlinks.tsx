import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
			// button widths and heights here -3, due to the stroke and that the svg is 97% of the total element
			const buttonWidth: number = buttonEl.current.offsetWidth - 3;
			const buttonHeight: number = buttonEl.current.offsetHeight - 3;
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
					onMouseOver={() => setDashoffset(pathLength - pathLengthHover)}
					onMouseLeave={() => setDashoffset(0)}
				>
					<span ref={textEl}>{children}</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="absolute w-[100%] h-[100%] scale-y-[-1] left-[0%] top-[0%]"
					>
						<rect
							rx="15"
							y="0.5"
							x="1"
							fill="none"
							strokeWidth="2"
							pathLength={pathLength}
							strokeDasharray={pathLength * 1.05} // adding 5% to avoid gap on mobile
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
