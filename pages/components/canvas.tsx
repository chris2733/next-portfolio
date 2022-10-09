import { useEffect, useRef, useState } from "react";

export default function Canvas({ data }: { data: any }) {
	// set height and width of window at states
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	// canvas element ref'd here
	const canvasEl = useRef<HTMLCanvasElement>(null);
	// set the position of the horizon, and also the last layer of buildings in background
	const horizon = 150;
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
		buildingsArray: [...buildingLayer(width)],
		heightAdjust: horizon,
		colour: "rgba(0,0,0,0.5)",
	});
	buildings.push({
		buildingsArray: [...buildingLayer(width)],
		heightAdjust: horizon * 0.5,
		colour: "rgba(0,0,0,0.75)",
	});
	buildings.push({
		buildingsArray: [...buildingLayer(width)],
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
						colour
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
	fill: string
) {
	paintbrush.beginPath();
	paintbrush.fillStyle = fill;
	paintbrush.fillRect(startX, startY, width, height);
}

// function for setting up a building buildingLayer, generating random buildings across the screen at a set height
// this needs to not have anything passed to it ideally, width should be there already somehow
function buildingLayer(width: number) {
	let array = [];
	// set the starter points here, so its drawn correctly in draw, not randomly readded
	// both are random numbers between 0-100 from the edge of canvas
	const start: number = -randomIntFromInterval(0, 100);
	const end: number = width + randomIntFromInterval(0, 100);
	for (let x: number = start; x < end; x++) {
		const randomBuildingWidth = randomIntFromInterval(60, 150);
		const randomBuildingHeight = randomIntFromInterval(50, 250);
		array.push({
			start: x,
			width: randomBuildingWidth,
			height: randomBuildingHeight,
		});
		// add random gap between buildings
		x += randomIntFromInterval(20, 80) + randomBuildingWidth;
	}
	return [...array];
}