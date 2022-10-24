import { useEffect, useRef, useState } from "react";

// **********
// todo
// cars randomly coming accross
// make canvas render with less frames per second
// maybe make sun/moon/sky/change with time, on a really slow cycle
// can use paintbrush.filter = "blur(5px)"; to blur gradient background but it almost destroyed chrome.. so only do it on page loadComponents, not on each draw() ** DOESNT WORK IN SAFARI

export default function Canvas({ data }: { data: any }) {
	// console.log(data);

	// set height and width of window at states
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	// canvas element ref'd here
	const canvasEl = useRef<HTMLCanvasElement>(null);
	// set the position of the horizon, and also the last layer of buildings in background
	const horizon = 100;
	// adjustment of -90 degrees, since the start of an arc in canvas seems to start at the centre right of it (east)
	let radianAdjust = degToRadian(90);

	// set the colour stops for different times, from suncalc
	const currentSkyLight: string = data.currentSkyLight;
	interface skyColourEach {
		stop: number;
		color: string;
	}
	interface skyColourTypes {
		sunrise?: skyColourEach[]; // sunrise (top edge of the sun appears on the horizon)
		sunriseEnd?: skyColourEach[]; // sunrise ends (bottom edge of the sun touches the horizon)
		goldenHourEnd?: skyColourEach[]; // morning golden hour (soft light, best time for photography) ends
		solarNoon?: skyColourEach[]; // solar noon (sun is in the highest position)
		goldenHour?: skyColourEach[]; // evening golden hour starts
		sunsetStart?: skyColourEach[]; // sunset starts (bottom edge of the sun touches the horizon)
		sunset?: skyColourEach[]; // sunset (sun disappears below the horizon, evening civil twilight starts)
		dusk?: skyColourEach[]; // dusk (evening nautical twilight starts)
		nauticalDusk?: skyColourEach[]; // nautical dusk (evening astronomical twilight starts)
		night?: skyColourEach[]; // night starts (dark enough for astronomical observations)
		nadir?: skyColourEach[]; // nadir (darkest moment of the night, sun is in the lowest position)
		nightEnd?: skyColourEach[]; // night ends (morning astronomical twilight starts)
		nauticalDawn?: skyColourEach[]; // nautical dawn (morning nautical twilight starts)
		dawn?: skyColourEach[]; // dawn (morning nautical twilight ends, morning civil twilight starts)
	}
	const skyColours: skyColourTypes = {
		sunrise: [
			{ stop: 0, color: "#f7a607" },
			{ stop: 0.2, color: "#f4b514" },
			{ stop: 0.35, color: "#f3c167" },
			{ stop: 0.5, color: "#b3ae90" },
			{ stop: 0.75, color: "#6c7277" },
		],
		sunriseEnd: [
			{ stop: 0, color: "#f7a607" },
			{ stop: 0.1, color: "#f4b514" },
			{ stop: 0.15, color: "#f3c167" },
			{ stop: 0.2, color: "#b3ae90" },
			{ stop: 0.4, color: "#6c7277" },
		],
		goldenHourEnd: [
			{ stop: 0, color: "#e2daaf" },
			{ stop: 0.3, color: "#d0d9cf" },
			{ stop: 0.5, color: "#8fa9b0" },
			{ stop: 0.65, color: "#506c85" },
		],
		solarNoon: [
			{ stop: 0, color: "#84aec4" },
			{ stop: 0.2, color: "#549dc4" },
			{ stop: 0.4, color: "#0f7baf" },
		],
		goldenHour: [
			{ stop: 0, color: "#e2daaf" },
			{ stop: 0.3, color: "#d0d9cf" },
			{ stop: 0.5, color: "#8fa9b0" },
			{ stop: 0.65, color: "#506c85" },
		],
		sunsetStart: [
			{ stop: 0, color: "#f7a607" },
			{ stop: 0.1, color: "#f4b514" },
			{ stop: 0.15, color: "#f3c167" },
			{ stop: 0.2, color: "#b3ae90" },
			{ stop: 0.4, color: "#6c7277" },
		],
		sunset: [
			{ stop: 0, color: "#f7a607" },
			{ stop: 0.2, color: "#f4b514" },
			{ stop: 0.35, color: "#f3c167" },
			{ stop: 0.5, color: "#b3ae90" },
			{ stop: 0.75, color: "#6c7277" },
		],
		dusk: [
			{ stop: 0, color: "#c67501" },
			{ stop: 0.1, color: "#e49805" },
			{ stop: 0.2, color: "#be9948" },
			{ stop: 0.3, color: "#a38c62" },
			{ stop: 0.5, color: "#807864" },
			{ stop: 0.7, color: "#304149" },
			{ stop: 0.8, color: "#142934" },
			{ stop: 1, color: "#142934" },
		],
		nauticalDusk: [
			{ stop: 0, color: "#5e4b41" },
			{ stop: 0.2, color: "#5b5c70" },
			{ stop: 0.5, color: "#253d65" },
			{ stop: 0.8, color: "#0c1734" },
			{ stop: 1, color: "#030a17" },
		],
		night: [
			{ stop: 0, color: "#5b5c70" },
			{ stop: 0.1, color: "#253d65" },
			{ stop: 0.3, color: "#0c1734" },
			{ stop: 1, color: "#030a17" },
		],
		nadir: [
			{ stop: 0, color: "#000000" },
			{ stop: 1, color: "#000000" },
		],
		nightEnd: [
			{ stop: 0, color: "#5e4b41" },
			{ stop: 0.2, color: "#5b5c70" },
			{ stop: 0.5, color: "#253d65" },
			{ stop: 0.8, color: "#0c1734" },
			{ stop: 1, color: "#030a17" },
		],
		nauticalDawn: [
			{ stop: 0, color: "#c67501" },
			{ stop: 0.1, color: "#e49805" },
			{ stop: 0.2, color: "#be9948" },
			{ stop: 0.3, color: "#a38c62" },
			{ stop: 0.5, color: "#807864" },
			{ stop: 0.7, color: "#304149" },
			{ stop: 0.8, color: "#142934" },
			{ stop: 1, color: "#142934" },
		],
		dawn: [
			{ stop: 0, color: "#d88c1f" },
			{ stop: 0.2, color: "#d4b366" },
			{ stop: 0.6, color: "#888b85" },
			{ stop: 1, color: "#5e6f77" },
		],
	};
	// get the right colour from skycolours, setup properly in typescript
	// setting the string currentSkyLight as a definite type, in this case being a string that is equal to one of the keys in the object
	type ObjectKey = keyof typeof skyColours;
	const currentSkyLightGradients = skyColours[currentSkyLight as ObjectKey];

	// setting each building layer in an array to be looped over when drawing
	type BuildingLayerType = {
		start: number;
		width: number;
		height: number;
	};
	let buildings: {
		buildingsArray: BuildingLayerType[];
		heightAdjust: number;
		scaleAdjust: number; //scaleadjust used to make windows smaller, giving illusion of distance away
		colour: string;
	}[] = [];
	// each building layer pushed here with a height adjusted up in y
	// building constraints setup here
	const building: {
		minW: number;
		maxW: number;
		minH: number;
		maxH: number;
		minG: number;
		maxG: number;
	} = {
		minW: 60,
		maxW: 150,
		minH: 70,
		maxH: 250,
		minG: 10,
		maxG: 40,
	};
	buildingsSetup(
		building,
		buildings,
		horizon,
		width,
		currentSkyLightGradients && currentSkyLightGradients[0].color
	);

	// set lamppost data here
	const lamppostStart = randomIntFromInterval(0, 30);
	const lamppostEnd = randomIntFromInterval(0, 30);
	const lamppostSpace = randomIntFromInterval(150, 180);

	const drawOnce = (paintbrush: any) => {
		// draw sky
		drawSky(paintbrush, width, height, currentSkyLightGradients);
		// sun/moon positioning
		drawSunMoon(paintbrush, data, width, height, horizon, radianAdjust);
	};

	// draw on canvas here
	const draw = (paintbrush: any, frameCount: any) => {
		// horizon
		// paintbrush.beginPath();
		// paintbrush.moveTo(0, height - horizon);
		// paintbrush.lineTo(width, height - horizon);
		// paintbrush.strokeStyle = "red";
		// paintbrush.stroke();

		// draw each building layer here
		buildings.forEach(
			({ buildingsArray, heightAdjust, scaleAdjust, colour }) => {
				// if height heightAdjust, add bar of colour underneath to cover the background
				let heightFix = 0;
				if (heightAdjust !== undefined) {
					heightFix = heightAdjust;
					paintbrush.beginPath();
					paintbrush.fillStyle = colour;
					paintbrush.fillRect(0, height - heightAdjust, width, height);
				}
				buildingsArray &&
					buildingsArray.forEach((building: any) => {
						drawBuilding(
							paintbrush,
							building.start,
							height - building.height - heightFix,
							building.width,
							building.height,
							colour,
							building.randomBuildingId,
							building.randomBuildingId2,
							scaleAdjust
						);
					});
			}
		);

		// draw lampposts, similar setup to buildinglayer
		drawLampposts(
			paintbrush,
			width,
			height,
			lamppostStart,
			lamppostEnd,
			lamppostSpace,
			25,
			2,
			"black",
			"white"
		);
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
			drawOnce(paintbrush);

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
}

function drawSky(
	paintbrush: any,
	width: number,
	height: number,
	currentSkyLightGradients?: { stop: number; color: string }[]
) {
	paintbrush.rect(0, 0, width, height);
	// add linear gradient
	var grd = paintbrush.createLinearGradient(width / 2, height, width / 2, 0);
	currentSkyLightGradients?.forEach((element: any) => {
		element.stop &&
			element.color &&
			grd.addColorStop(element.stop, element.color);
	});
	paintbrush.fillStyle = grd;
	paintbrush.fill();
}

function drawSunMoon(
	paintbrush: any,
	data: any,
	width: number,
	height: number,
	horizon: number,
	radianAdjust: number
) {
	// position in radians from a point on a circle, converted from degrees to radians
	const sunRadians = degToRadian(data.sunDegrees);
	const moonRadians = degToRadian(data.moonDegrees);
	const orbitCentreX: number = width * 0.5;
	const orbitCentreY: number = height - horizon;
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
		sunColour,
		radianAdjust,
		width,
		height,
		horizon
	);
	// moon position
	const moon = sunMoonPosition(
		paintbrush,
		moonRadians,
		orbitCentreX,
		orbitCentreY,
		orbitRadius,
		moonRadius,
		moonColour,
		radianAdjust,
		width,
		height,
		horizon
	);
}

function buildingsSetup(
	building: any,
	buildings: any,
	horizon: number,
	width: number,
	buildingColour?: string
) {
	// building layers set here
	const buildingLayers: {
		minWMod: number;
		maxWMod: number;
		minHMod: number;
		maxHMod: number;
		minGMod: number;
		maxGMod: number;
		heightAdjust: number;
		scaleAdjust: number;
		colour: string;
	}[] = [
		{
			minWMod: 1.1,
			maxWMod: 1.1,
			minHMod: 1.1,
			maxHMod: 1.1,
			minGMod: 0.5,
			maxGMod: 0.5,
			heightAdjust: horizon,
			scaleAdjust: 0.5,
			colour: "rgba(0,0,0,0.5)",
		},
		{
			minWMod: 1.05,
			maxWMod: 1.05,
			minHMod: 1.05,
			maxHMod: 1.05,
			minGMod: 0.7,
			maxGMod: 0.7,
			heightAdjust: horizon * 0.5,
			scaleAdjust: 0.8,
			colour: "rgba(0,0,0,0.75)",
		},
		{
			minWMod: 1,
			maxWMod: 1,
			minHMod: 1,
			maxHMod: 1,
			minGMod: 1,
			maxGMod: 1,
			heightAdjust: 0,
			scaleAdjust: 1,
			colour: "rgba(0,0,0,1)",
		},
	];

	// if buildingColour supplied, go through layers and amend colour for each building
	// if not, all blackkk
	if (buildingColour) {
		// then see if its night, it will be lightened
		const layerNum = buildingLayers.length;
		// check the current sky colour isnt just black for night, otherwise it needs to be lightened
		const blackSky = buildingColour === "#000000";
		// getting correct -1 starting point for light colours, it shouldnt go past -1
		const hexChange = blackSky ? 0.02 : -1 + layerNum / 10;
		buildingLayers.forEach((layer, index) => {
			// if night then multiply the change, otherwise take it away - looks better visually
			const shadeChange = blackSky
				? hexChange * (layerNum - index)
				: hexChange - index / 10;
			layer.colour = shadeHexColor(buildingColour, shadeChange);
		});
	}

	buildingLayers.forEach((layer) => {
		buildings.push({
			buildingsArray: [
				...buildingLayer(
					width,
					0,
					100,
					0,
					100,
					building.minW * layer.minWMod,
					building.maxW * layer.maxWMod,
					building.minH * layer.minHMod,
					building.maxH * layer.maxHMod,
					building.minG * layer.minGMod,
					building.maxG * layer.maxGMod
				),
			],
			heightAdjust: layer.heightAdjust,
			scaleAdjust: layer.scaleAdjust,
			colour: layer.colour,
		});
	});
}

// degrees to radian calc - although this can be fixed later in the api to recieve measurements in radians instead
function degToRadian(num: number) {
	return num * (Math.PI / 180);
}

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
	fillColour: string,
	radianAdjust: number,
	width: number,
	height: number,
	horizon: number
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
	let sunMoonPosition = getPoint(
		centreX,
		centreY,
		orbitRadius,
		radians - radianAdjust
	);
	// work out how high the sun/moon is by using width of screen/2 (its height in the sky)
	// then if this is a less than the height of the whole canvas, so if its too low, get the ratio of the difference and bump it up a tad
	if (width / 2 / (height - horizon) < 1) {
		const ratio = width / 2 / (height - horizon);
		// since its drawn from top screenLeft, get the differnce between sunMoonPosition y pos and horizon, multiply that by the ratio and minus it from sunMoonPosition y pos, so it will still sit on the horizon later
		// ...or should
		const yAdjust = (height - horizon - sunMoonPosition[1]) * ratio;
		sunMoonPosition[1] -= yAdjust;
	}

	// draw circle on sunMoonposition
	paintbrush.beginPath();
	paintbrush.arc(
		sunMoonPosition[0],
		sunMoonPosition[1],
		circleRadius,
		0,
		Math.PI + (Math.PI * 2) / 2,
		1
	);
	// fill itt
	paintbrush.fillStyle = fillColour;
	paintbrush.fill();
}

// get a random number
function randomIntFromInterval(min: number, max: number) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

// drawing buildings
function drawBuilding(
	paintbrush: any,
	startX: number,
	startY: number,
	width: number,
	height: number,
	fill: string,
	randomBuildingId: number,
	randomBuildingId2: number,
	scaleAdjust: number
) {
	// draw a rectangle with curved top edges only slightly
	let radius = 5;
	paintbrush.beginPath();
	paintbrush.fillStyle = fill;
	paintbrush.beginPath();
	paintbrush.moveTo(startX + radius, startY);
	paintbrush.lineTo(startX + width - radius, startY);
	paintbrush.quadraticCurveTo(
		startX + width,
		startY,
		startX + width,
		startY + radius
	);
	paintbrush.lineTo(startX + width, startY + height);
	paintbrush.lineTo(startX, startY + height);
	paintbrush.quadraticCurveTo(
		startX,
		startY + height,
		startX,
		startY + height - radius
	);
	paintbrush.lineTo(startX, startY + radius);
	paintbrush.quadraticCurveTo(startX, startY, startX + radius, startY);
	paintbrush.closePath();
	paintbrush.fill();

	// draw windows
	let windowWidth: number;
	let windowHeight: number;
	// random window sizes using randomBuildingId
	// using randomBuildingId2 for any other randomness needed
	if (randomBuildingId > 0.9) {
		// random chance for bay windows
		windowWidth = 7 + Math.floor(5 * randomBuildingId2);
		windowHeight = 11 + Math.floor(7 * randomBuildingId2);
	} else {
		windowWidth = 7 + Math.floor(8 * randomBuildingId2);
		windowHeight = 3 + Math.floor(5 * randomBuildingId2);
	}
	// gep between windows
	const windowGapX: number = 4 + Math.floor(8 * randomBuildingId2);
	const windowGapY: number = 4 + Math.floor(8 * randomBuildingId2);
	// gap between window and building
	let windowBuildingGapX: number = 10;
	let windowBuildingGapY: number = 10;
	const windowColour: string = "#6e92ff44";
	const windowLitColour: string = "#fdd48a";

	drawBuildingWindows(
		paintbrush,
		width,
		height,
		startX,
		startY,
		windowWidth * scaleAdjust,
		windowHeight * scaleAdjust,
		windowGapX * scaleAdjust,
		windowGapY * scaleAdjust,
		windowBuildingGapX * scaleAdjust,
		windowBuildingGapY * scaleAdjust,
		windowColour,
		windowLitColour,
		randomBuildingId,
		randomBuildingId2
	);

	// add antenna randomly to buildings thinner than 200
	if (width < 100 && randomBuildingId > 0.7) {
		drawAntenna(paintbrush, startX, startY, fill, width, randomBuildingId2);
	}
	// randomly draw railing on top
	else if (randomBuildingId > 0.2 && randomBuildingId < 0.7) {
		drawRailing(paintbrush, startX, startY, fill, width, radius);
	}
	// randomly draw crane on top
	else if (randomBuildingId < 0.15) {
		drawCrane(paintbrush, startX, startY, fill, width, randomBuildingId2);
	}

	// maybe if skyscraper add tower top with antenna?
}

// function for setting up a building buildingLayer, generating random buildings across the screen at a set height
function buildingLayer(
	width: number,
	startPointMin: number,
	startPointMax: number,
	endPointMin: number,
	endPointMax: number,
	widthMin: number,
	widthMax: number,
	heightMin: number,
	heightMax: number,
	gapMin: number,
	gapMax: number
) {
	let array = [];
	// set the starter points here, so its drawn correctly in draw, not randomly readded
	// both are random numbers between 0-100 from the edge of canvas
	const start: number = -randomIntFromInterval(startPointMin, startPointMax);
	const end: number = width + randomIntFromInterval(endPointMin, endPointMax);
	for (let x: number = start; x < end; x++) {
		const randomBuildingWidth = randomIntFromInterval(widthMin, widthMax);
		const randomBuildingHeight = randomIntFromInterval(heightMin, heightMax);
		array.push({
			start: x,
			width: randomBuildingWidth,
			height: randomBuildingHeight,
			randomBuildingId: Math.random(),
			randomBuildingId2: Math.random(),
		});
		// add random gap between buildings
		x += randomIntFromInterval(gapMin, gapMax) + randomBuildingWidth;
	}
	return [...array];
}

function drawBuildingWindows(
	paintbrush: any,
	width: number,
	height: number,
	startX: number,
	startY: number,
	windowWidth: number,
	windowHeight: number,
	windowGapX: number,
	windowGapY: number,
	windowBuildingGapX: number,
	windowBuildingGapY: number,
	windowColour: string,
	windowLitColour: string,
	randomBuildingId: number,
	randomBuildingId2: number
) {
	// boolean if window lit
	let windowLit: boolean = false;
	// space to put windows
	const spaceForWindowsX: number = width - windowGapX * 2;
	const spaceForWindowsY: number = height - windowGapY * 2; // more gap at bottom of building
	// number of windows...
	const windowNumX: number = Math.floor(
		spaceForWindowsX / (windowWidth + windowGapX)
	);
	const windowNumY: number = Math.floor(
		spaceForWindowsY / (windowHeight + windowGapY)
	);
	// ...get accurate pixel gap between now windows and edge of building, windowgapx added again to add space to other side - otherwise its only adding window+windowgap each time, missing one at end
	windowBuildingGapX =
		((width % ((windowWidth + windowGapX) * windowNumX)) + windowGapX) / 2;
	windowBuildingGapY =
		((height % ((windowHeight + windowGapY) * windowNumY)) + windowGapY) / 2;
	const startWindowX: number = startX + windowBuildingGapX;
	const startWindowY: number = startY + windowBuildingGapY;
	// ...then loop through them to set the window
	for (let xloop = 0; xloop < windowNumX; xloop++) {
		const x = startWindowX + xloop * (windowWidth + windowGapX);
		let y = startWindowY;
		// style window and if lit add shadow
		drawWindow(
			paintbrush,
			windowWidth,
			windowHeight,
			windowColour,
			windowLitColour,
			windowLit,
			x,
			y
		);
		// adding a random column gap here, by skipping a loop
		// only if randomBuildingId is a multple of 4, then picking a random num from windowNumY
		if ((randomBuildingId * 100) % 4) {
			const randomWindow = Math.ceil(randomBuildingId2 * windowNumX);
			xloop === randomWindow && xloop++;
		}
		for (let yloop = 1; yloop < windowNumY; yloop++) {
			y = startWindowY + yloop * (windowHeight + windowGapY);
			// style window and if lit add shadow
			drawWindow(
				paintbrush,
				windowWidth,
				windowHeight,
				windowColour,
				windowLitColour,
				windowLit,
				x,
				y
			);
		}
	}
	function drawWindow(
		paintbrush: any,
		windowWidth: number,
		windowHeight: number,
		windowColour: string,
		windowLitColour: string,
		windowLit: boolean,
		x: number,
		y: number
	) {
		// but random lit window.. havent figured it out exactly, but this seems to look pretty random
		const dateDigits = parseInt(String(new Date().getSeconds()));
		const randomLoopDigits = parseInt(
			String((x + y) * randomBuildingId2).slice(-2)
		);
		// flip state of window lit randomly
		if (dateDigits === randomLoopDigits) {
			windowLit = !windowLit;
		}
		if (windowLit) {
			paintbrush.shadowColor = windowLitColour;
			paintbrush.shadowOffsetX = 0;
			paintbrush.shadowOffsetY = 0;
			paintbrush.shadowBlur = 6;
			paintbrush.fillStyle = windowColour;
			paintbrush.fillRect(x, y, windowWidth, windowHeight);
			paintbrush.shadowColor = "transparent";
			paintbrush.shadowOffsetX = 0;
			paintbrush.shadowOffsetY = 0;
			paintbrush.shadowBlur = 0;
		} else {
			paintbrush.fillStyle = windowColour;
			paintbrush.fillRect(x, y, windowWidth, windowHeight);
		}
	}
}

function drawRailing(
	paintbrush: any,
	startX: number,
	startY: number,
	fill: string,
	width: number,
	radius: number
) {
	let railingsWidth: number = width - radius * 2;
	let railingsStartX: number = startX + (width - railingsWidth) / 2;
	let railingHeight: number = 6;
	let railingsStartY: number = startY - railingHeight;
	let railingThickness: number = 2;
	let railingGap: number = 9;
	paintbrush.beginPath();
	paintbrush.fillStyle = fill;
	paintbrush.fillRect(
		railingsStartX,
		railingsStartY,
		railingsWidth,
		railingThickness
	);
	// railings with gap and width, get the remainder of this from width, so they all fit perfectly - flexible gap ofc
	const railings: number = railingGap + railingThickness;
	const railingsNum: number = railingsWidth / railings;
	// calc the gap at the end, usually some space left, add it to the gap + railing thickness for an accurate spacing
	const remainingGap: number = railingsWidth % railings;
	const space: number =
		railingGap + railingThickness + remainingGap / railingsNum;
	// const space = railingsWidth / railingsNum;
	for (let i = 0; i <= railingsWidth; i += space) {
		paintbrush.beginPath();
		paintbrush.fillStyle = fill;
		paintbrush.fillRect(railingsStartX + i, railingsStartY, 2, railingHeight);
	}
}

function drawAntenna(
	paintbrush: any,
	startX: number,
	startY: number,
	fill: string,
	width: number,
	randomBuildingId2: number
) {
	// add to the centerish
	const x: number = startX + (width * 0.4 + randomBuildingId2 * (width * 0.4));
	// random height around 50ish
	const height: number = 20 + randomBuildingId2 * 30;
	const antennaWidth: number = 3;
	paintbrush.beginPath();
	paintbrush.fillStyle = fill;
	paintbrush.fillRect(x, startY, antennaWidth, -height);
	// 2/3 chance to have a little one next door
	if (randomBuildingId2 > 0.3) {
		// place smaller antenna to side furthest from edge
		const antennaSpace: number = 10;
		const smallAntennaX: number =
			x > width / 2 ? x - antennaSpace : x + antennaSpace;
		// random height around 20ish
		const smallAntennaHeight: number = 10 + randomBuildingId2 * 16;
		paintbrush.beginPath();
		paintbrush.fillStyle = fill;
		paintbrush.fillRect(
			smallAntennaX,
			startY,
			antennaWidth,
			-smallAntennaHeight
		);
	}
}

function drawCrane(
	paintbrush: any,
	startX: number,
	startY: number,
	fill: string,
	width: number,
	randomBuildingId2: number
) {
	// start near the centreish
	const x: number = startX + (width * 0.4 + randomBuildingId2 * (width * 0.4));
	// randomly choose the direction of crane
	const direction: string = randomBuildingId2 > 0.5 ? "left" : "right";
	const legHeight: number = 5;
	const legWidth: number = 2;
	const bodyHeight: number = 6;
	const bodyWidth: number = 16;
	const neckLength: number = 6 + Math.floor(randomBuildingId2 * 5); // random neck length, to be looped over
	const neckWidth: number = 2;
	const neckHeight: number = 3; //height of each neck segment
	paintbrush.beginPath();
	paintbrush.fillStyle = fill;
	paintbrush.fillRect(x, startY, legWidth, -legHeight); // legs
	paintbrush.fillRect(
		x - bodyWidth / 2,
		startY - legHeight,
		bodyWidth,
		-bodyHeight
	); // body
	// draw the neck
	const neckStart = startY - legHeight - bodyHeight + 1;
	for (let i = 0; i < neckLength; i++) {
		paintbrush.beginPath();
		paintbrush.fillStyle = fill;
		// move each neck segment up by 2*i, to the side by a neckwidth
		// direction picks if its added or taken away
		const directionX: number =
			direction === "left" ? x - i * neckWidth : x + i * neckWidth;
		paintbrush.fillRect(directionX, neckStart - i * 2, 2, -neckHeight);
	}
	// add the dangly bit
	const craneDangleLength: number = neckLength * 2 + 8 * randomBuildingId2;
	const craneDangleX: number =
		direction === "left"
			? x - neckLength * neckWidth
			: x + neckLength * neckWidth;
	paintbrush.fillRect(
		craneDangleX,
		neckStart - neckLength * 2,
		2,
		craneDangleLength
	);
	// little end bit
	paintbrush.fillRect(
		craneDangleX - 2,
		neckStart - neckLength * 2 + craneDangleLength,
		6,
		2
	);
}

function drawLampposts(
	paintbrush: any,
	width: number,
	height: number,
	startPoint: number,
	endPoint: number,
	gap: number,
	postHeight: number,
	postWidth: number,
	fill: string,
	lightFill: string
) {
	// set the starter points here, so its drawn correctly in draw, not randomly readded
	// both are random numbers between 0-100 from the edge of canvas
	const start: number = -startPoint;
	const end: number = width + endPoint;
	for (let x: number = start; x < end; x += gap) {
		paintbrush.beginPath();
		paintbrush.fillStyle = fill;
		paintbrush.shadowColor = lightFill;
		paintbrush.shadowOffsetX = 2;
		paintbrush.shadowOffsetY = 2;
		paintbrush.shadowBlur = 21;
		paintbrush.fillRect(x, height, postWidth, -postHeight);
		paintbrush.fillRect(x, height - postHeight, 8, 2);
		// light at end
		paintbrush.shadowColor = lightFill;
		paintbrush.shadowOffsetX = 2;
		paintbrush.shadowOffsetY = 4;
		paintbrush.shadowBlur = 8;
		paintbrush.fillStyle = lightFill;
		paintbrush.fillRect(x + 3, height - postHeight - 2, 5, 2);
		paintbrush.shadowColor = "transparent";
		paintbrush.shadowOffsetX = 0;
		paintbrush.shadowOffsetY = 0;
		paintbrush.shadowBlur = 0;
	}
}

// function hexToRgb(hex: string) {
// 	if (!hex.includes("#")) {
// 		return null;
// 	}
// 	hex = hex.replaceAll("#", "");
// 	if (hex.length != 6) {
// 		return null;
// 	}

// 	const aRgbHex: any = hex.match(/.{1,2}/g);
// 	const aRgb = [
// 		parseInt(aRgbHex[0], 16),
// 		parseInt(aRgbHex[1], 16),
// 		parseInt(aRgbHex[2], 16),
// 	];
// 	return aRgb;
// }

// shade colour light or dark, from 1.0 to -1.0 respectively
function shadeHexColor(color: string, percent: number) {
	var f = parseInt(color.slice(1), 16),
		t = percent < 0 ? 0 : 255,
		p = percent < 0 ? percent * -1 : percent,
		R = f >> 16,
		G = (f >> 8) & 0x00ff,
		B = f & 0x0000ff;
	return (
		"#" +
		(
			0x1000000 +
			(Math.round((t - R) * p) + R) * 0x10000 +
			(Math.round((t - G) * p) + G) * 0x100 +
			(Math.round((t - B) * p) + B)
		)
			.toString(16)
			.slice(1)
	);
}

// lighten colour, colour to and from, c0 and c1 respectively
// function blendHexColors(c0: string, c1: string, p:number) {
// 	var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
// 	return "#"+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
// }
