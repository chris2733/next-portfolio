import { NextSeo } from "next-seo";
import AnimateIn from "./components/animateIn";
import LetterSplitter from "./components/letterSplitter";
import WordSplitter from "./components/workSplitter";
import PageTransitionWrapper from "./components/pageTransition";
import RoundedLinks from "./elements/roundedlinks";
import { useEffect, useRef, useState } from "react";
import CurrentWeather from "./components/getCurrentWeather";

const About = () => {
	const text = "About me here";

	const [apiDataRecieved, setApiDataRecieved] = useState({});
	const [apiResponseOk, setApiResponseOk] = useState(false);

	const passDataToParent = (data: Object) => {
		setApiDataRecieved(data);
		setApiResponseOk(true);
	};

	return (
		<>
			<NextSeo title="About" />
			<PageTransitionWrapper classes="min-h-screen flex items-center justify-center relative overflow-hidden">
				{/* {Object.keys(apiDataRecieved).length !== 0 && apiResponseOk && (
					<Canvas data={apiDataRecieved} />
				)} */}
				{/* canvas here to test without api call */}
				{/* <Canvas /> */}
				<div className="container py-24 sm:py-32 text-center rounded-3xl bg-white !max-w-2xl p-8 shadow-[0px_0px_112px_-2px_rgba(255,255,255,0.75)] z-20">
					<h1 className="inline-block overflow-hidden leading-5 mb-4">
						<LetterSplitter
							text={"about"}
							initialDelay={0.4}
							letterDelay={0.03}
							letterClass="text-lg uppercase duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] cursor-default inline-block font-medium"
						/>
					</h1>
					<div className="mx-auto max-w-[730px]">
						<div className="pb-5">
							<WordSplitter
								text={text}
								initialDelay={1}
								wordDelay={0.002}
								wordClass=""
							/>
						</div>
						{/* maybe comment this out when devving not to call is 2000 times a minute */}
						{/* <CurrentWeather passDataToParent={passDataToParent} /> */}
						<div className="mt-2 flex items-center justify-center gap-3">
							<AnimateIn delay={2} duration={0.6}>
								<RoundedLinks
									link="/"
									buttonClasses="text-black font-bold text-sm"
									strokeColour="black"
								>
									home
								</RoundedLinks>
							</AnimateIn>
							<AnimateIn delay={2.1} duration={0.6}>
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
				</div>
			</PageTransitionWrapper>
		</>
	);
};

export default About;

const Canvas = ({ data }: { data: any }) => {
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	const canvasEl = useRef<HTMLCanvasElement>(null);

	// console.log(data);

	// functions here for use later
	// degrees to radian calc - although this can be fixed later in the api to recieve measurements in radians instead
	function degToRadian(num: number) {
		return num * (Math.PI / 180);
	}
	// adjustment of -90 degrees, since the start of an arc in canvas seems to start at the centre right of it (east)
	let radianAdjust = degToRadian(90);
	// get the end point of an arc as coords
	function getPoint(c1: number, c2: number, radius: number, angle: number) {
		return [c1 + Math.cos(angle) * radius, c2 + Math.sin(angle) * radius];
	}
	// set position of the sun/moon
	function sunMoonPosition(
		paintbrush: any,
		radians: number,
		centreX: number,
		centreY: number,
		orbitRadius: number,
		circleRadius: number,
		fillColour: string
	) {
		// start drawing the arc to set the position
		paintbrush.beginPath();
		paintbrush.arc(
			centreX,
			centreY,
			orbitRadius,
			0 - radianAdjust,
			radians - radianAdjust,
			0
		);
		paintbrush.strokeStyle = "transparent";
		paintbrush.stroke();
		// get the end of the arc in coords
		let sunPosition = getPoint(
			centreX,
			centreY,
			orbitRadius,
			radians - radianAdjust
		);
		// draw circle on sunposition
		paintbrush.beginPath();
		paintbrush.arc(
			sunPosition[0],
			sunPosition[1],
			circleRadius,
			0,
			Math.PI + (Math.PI * 2) / 2,
			1
		);
		// fill itt
		paintbrush.fillStyle = fillColour;
		paintbrush.fill();
	}

	// drawing buildings
	function drawBuilding(
		paintbrush: any,
		startX: number,
		startY: number,
		width: number,
		height: number,
		fill: string
	) {
		paintbrush.beginPath();
		paintbrush.fillStyle = fill;
		paintbrush.fillRect(startX, startY, width, height);
	}

	// randomly draw buildings between nums
	// set the starter points here, so its drawn correctly in draw, not randomly readded
	const start: number = -100;
	const end: number = width + 100;
	// function for setting up a building buildingLayer, generating random buildings across the screen at a set height
	function buildingLayer() {
		let array = [];
		for (let x: number = start; x < end; x++) {
			const randomBuildingWidth = Math.floor(Math.random() * 70) + 60;
			const randomBuildingHeight = Math.floor(Math.random() * 150) + 50;
			array.push({
				start: x,
				width: randomBuildingWidth,
				height: randomBuildingHeight,
			});
			// add random gap between buildings
			x += Math.floor(Math.random() * 60) + 20 + randomBuildingWidth;
		}
		return [...array];
	}
	// setting each building layer in an array to be looped over when drawing
	type BuildingLayerType = {
		start: number;
		width: number;
		height: number;
	};
	let buildings: {
		buildingsArray: BuildingLayerType[];
		heightAdjust: number;
	}[] = [];
	// each building layer pushed here with a height adjusted up in y
	buildings.push({ buildingsArray: [...buildingLayer()], heightAdjust: 0 });
	buildings.push({ buildingsArray: [...buildingLayer()], heightAdjust: 100 });
	buildings.push({ buildingsArray: [...buildingLayer()], heightAdjust: 200 });

	// draw on canvas here
	const draw = (paintbrush: any, frameCount: any) => {
		// horizon
		paintbrush.beginPath();
		paintbrush.moveTo(0, height - 200);
		paintbrush.lineTo(width, height - 200);
		paintbrush.strokeStyle = "red";
		paintbrush.stroke();

		// sun/moon positioning
		// position in radians from a point on a circle, converted from degrees to radians
		const sunRadians = degToRadian(data.sunDegrees);
		const moonRadians = degToRadian(data.moonDegrees);
		const orbitCentreX: number = width * 0.5;
		const orbitCentreY: number = height - 200;
		// set orbit radius to width of the screen, only if its smaller than the screen height (for super fucking wide screens), otherwise use height
		const orbitRadius: number = width < height ? width * 0.48 : height * 0.48;
		const sunRadius: number = 15;
		const moonRadius: number = 15;
		const sunColour: string = "yellow";
		const moonColour: string = "grey";
		// sun position
		const sun = sunMoonPosition(
			paintbrush,
			sunRadians,
			orbitCentreX,
			orbitCentreY,
			orbitRadius,
			sunRadius,
			sunColour
		);
		// moon position
		const moon = sunMoonPosition(
			paintbrush,
			moonRadians,
			orbitCentreX,
			orbitCentreY,
			orbitRadius,
			moonRadius,
			moonColour
		);

		buildings.forEach(({ buildingsArray, heightAdjust }) => {
			const heightFix = heightAdjust !== undefined ? heightAdjust : 0;
			buildingsArray &&
				buildingsArray.forEach((building: any) => {
					drawBuilding(
						paintbrush,
						building.start,
						height - building.height - heightFix,
						building.width,
						building.height,
						"rgba(0,0,0,0.75)"
					);
				});
		});
	};

	useEffect(() => {
		// set canvas to full screen size
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);
		// check it isnt null - thanks typescript
		if (canvasEl.current) {
			const canvas = canvasEl.current;
			const paintbrush = canvas.getContext("2d");

			let frameCount: number = 0;
			let animationFrameId: any;

			//Our draw came here
			const render = () => {
				frameCount++;
				draw(paintbrush, frameCount);
				animationFrameId = window.requestAnimationFrame(render);
			};
			render();

			return () => {
				window.cancelAnimationFrame(animationFrameId);
			};
		}
		// call draw here, so its reloaded on each draw
	}, [draw]);

	return (
		<div className="absolute top-0 left-0 w-full h-full z-30 bg-white bg-opacity-80">
			<canvas ref={canvasEl} height={height} width={width}></canvas>
		</div>
	);
};
