import { useEffect, useRef, useState } from "react";

// **********
// todo
// add lamposts
// cars randomly coming accross

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

	// setting each building layer in an array to be looped over when drawing
	type BuildingLayerType = {
		start: number;
		width: number;
		height: number;
	};
	let buildings: {
		buildingsArray: BuildingLayerType[];
		heightAdjust: number;
		colour: string;
	}[] = [];
	// each building layer pushed here with a height adjusted up in y
	buildings.push({
		buildingsArray: [
			...buildingLayer(width, 0, 100, 0, 100, 60, 150, 50, 250, 20, 80),
		],
		heightAdjust: horizon,
		colour: "rgba(0,0,0,0.5)",
	});
	buildings.push({
		buildingsArray: [
			...buildingLayer(width, 0, 100, 0, 100, 60, 150, 50, 250, 20, 80),
		],
		heightAdjust: horizon * 0.5,
		colour: "rgba(0,0,0,0.75)",
	});
	buildings.push({
		buildingsArray: [
			...buildingLayer(width, 0, 100, 0, 100, 60, 150, 50, 250, 20, 80),
		],
		heightAdjust: 0,
		colour: "rgba(0,0,0,1)",
	});

	// draw on canvas here
	const draw = (paintbrush: any, frameCount: any) => {
		// horizon
		paintbrush.beginPath();
		paintbrush.moveTo(0, height - horizon);
		paintbrush.lineTo(width, height - horizon);
		paintbrush.strokeStyle = "red";
		paintbrush.stroke();

		// whole background
		paintbrush.beginPath();
		paintbrush.fillStyle = "#2020f6";
		paintbrush.fillRect(0, 0, width, height);

		// sun/moon positioning
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
			radianAdjust
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
			radianAdjust
		);

		// draw each building layer here
		buildings.forEach(({ buildingsArray, heightAdjust, colour }) => {
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
						building.randomBuildingId
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
	radianAdjust: number
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
	randomBuildingId: number
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
	if (randomBuildingId > 0.9) {
		// random chance to bay windows
		windowWidth = 8;
		windowHeight = 14;
	} else {
		windowWidth = 10;
		windowHeight = 5;
	}
	// gep between windows
	const windowGapX: number = 8;
	const windowGapY: number = 10;
	// gap between window and building
	let windowBuildingGapX: number = 10;
	let windowBuildingGapY: number = 10;
	const windowColour: string = "blue";

	drawBuildingWindows(
		paintbrush,
		width,
		height,
		startX,
		startY,
		windowWidth,
		windowHeight,
		windowGapX,
		windowGapY,
		windowBuildingGapX,
		windowBuildingGapY,
		windowColour
	);

	// randomly draw railing on top

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
	windowColour: string
) {
	// space to put windows
	const spaceForWindowsX: number = width - windowGapX * 2;
	const spaceForWindowsY: number = height - windowGapY * 3; // more gap at bottom of building
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
		paintbrush.fillStyle = windowColour;
		paintbrush.fillRect(x, y, windowWidth, windowHeight);
		xloop === 5 && xloop++;
		for (let yloop = 0; yloop < windowNumY; yloop++) {
			y = startWindowY + yloop * (windowWidth + windowGapY);
			paintbrush.fillStyle = windowColour;
			paintbrush.fillRect(x, y, windowWidth, windowHeight);
		}
	}
}
