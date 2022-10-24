import { useState, useEffect } from "react";
import axios from "axios";

export default function CurrentWeather({
	passDataToParent,
}: {
	passDataToParent: Function;
}) {
	const [apiData, setapiData] = useState({});
	const [apiCallOk, setApiCallOk] = useState(false);
	const [weatherData, setWeatherData] = useState<any>({});
	const currentTime = new Date().getTime();

	// test data to show night and day
	const testDataCardiff: object = {
		coord: {
			lon: -3.18,
			lat: 51.48,
		},
		weather: [
			{
				id: 803,
				main: "Clouds",
				description: "broken clouds",
				icon: "04n",
			},
		],
		base: "stations",
		main: {
			temp: 7.04,
			feels_like: 4.58,
			temp_min: 5.57,
			temp_max: 8.4,
			pressure: 1022,
			humidity: 82,
		},
		visibility: 10000,
		wind: {
			speed: 3.6,
			deg: 360,
		},
		clouds: {
			all: 63,
		},
		dt: 1665447422,
		sys: {
			type: 2,
			id: 2045739,
			country: "GB",
			sunrise: 1665469764,
			sunset: 1665509356,
		},
		timezone: 3600,
		id: 2653822,
		name: "Cardiff",
		cod: 200,
	};

	useEffect(() => {
		// this may look like it's calling twice in dev, but thats because of strictmode - if this is set to false in next.config.js it only happens once
		const response = axios
			.get(
				`http://api.openweathermap.org/data/2.5/weather?id=2653822&appid=${process.env.NEXT_PUBLIC_OPENMAP_API}&units=metric`
			)
			.then(function (response) {
				// handle success
				console.log("Openmanp weather api GREAET SUCCESS");
				setapiData(response.data);
				// console.log(response.data);
				return;
			})
			.catch(function (error) {
				// handle error
				console.log("Openmap weather api " + error.message);
				return;
			});

		// set test data instead
		// const apiDataConverted = SuccessfulResult(testDataCardiff, 1665446403000); //night
		// const apiDataConverted = SuccessfulResult(testDataCardiff, 1665497241000); //day
		// setWeatherData(apiDataConverted);
		// passDataToParent(apiDataConverted);
		// setApiCallOk(true);
	}, []);

	useEffect(() => {
		if (Object.keys(apiData).length !== 0) {
			const apiDataConverted = SuccessfulResult(apiData, currentTime);
			setWeatherData(apiDataConverted);
			passDataToParent(apiDataConverted);
			setApiCallOk(true);
		}
	}, [apiData]);

	return (
		<div className="">
			{apiCallOk && (
				<p>
					Current location: {""}
					{weatherData.weather.name !== undefined && weatherData.weather.name}
				</p>
			)}
		</div>
	);
}

function SuccessfulResult(data: any, currentTime: number) {
	// weather data
	interface weatherData {
		name: string;
		lat: number;
		lon: number;
		time: number;
		sunrise: number;
		sunset: number;
		temperature: number;
		visibility?: number;
	}
	/* If some of these don't appear, its because they arent happenning, so check for them */
	const weather: weatherData = {
		name: data.name,
		lat: data.coord.lat,
		lon: data.coord.lon,
		time: currentTime,
		sunrise: data.sys.sunrise,
		sunset: data.sys.sunset,
		temperature: data.main.temp,
		...("visibliity" in data && { Visibility: data.visibility }),
		...("wind" in data && { Visibility: data.wind.speed }),
		...("clouds" in data && { Visibility: data.clouds.all }),
		...("rain" in data && { Visibility: data.rain }),
		...("snow" in data && { Visibility: data.snow }),
		...("clouds" in data && { Visibility: data.clouds.all }),
	};
	// getting sun position with suncalc
	const SunCalc = require("suncalc");

	// get sky light colours from mooncalc
	const skyLightTypes = SunCalc.getTimes(
		weather.time,
		weather.lat,
		weather.lon
	);
	// get current type of light in sky
	let currentSkyLightLoop: any[] = ["emptyfornow", 0];
	let currentSkyLight: string;
	const timeNowHours = String(new Date().getHours());
	const timeNowMins = String(new Date().getMinutes()).padStart(2, "0");
	const timeNow = parseInt(`${timeNowHours}${timeNowMins}`);
	// loop through each from the mooncalc npm, get the closest time on the lower end
	Object.entries(skyLightTypes).forEach((value: any[]) => {
		const eachValueHours = String(value[1].getHours());
		const eachValueMins = String(value[1].getMinutes()).padStart(2, "0");
		const eachValue = parseInt(`${eachValueHours}${eachValueMins}`);
		// getting the current sky value to compare in each lookup, getting the most recent
		if (currentSkyLightLoop[1] !== 0 && timeNow > eachValue) {
			currentSkyLightLoop = value;
		}
	});

	// set the finalised figure here
	// if its basically just after midnight, need to select the first one
	if (currentSkyLightLoop[0] === "emptyfornow") {
		currentSkyLight = "night";
	} else {
		currentSkyLight = currentSkyLightLoop[0];
	}

	const sunPosition = SunCalc.getPosition(
		weather.time,
		weather.lat,
		weather.lon
	);

	const moonPosition = SunCalc.getMoonPosition(
		weather.time,
		weather.lat,
		weather.lon
	);

	// distance of moon from earth
	const moonDistance = moonPosition.distance;
	// moon illumination, phase and angle, see docs
	const moonIllumination = SunCalc.getMoonIllumination(weather.time);

	// degrees calculated from like top of a circle i think
	const sunDegrees = (sunPosition.azimuth * 180) / Math.PI;
	const moonDegrees = (moonPosition.azimuth * 180) / Math.PI;

	return { weather, sunDegrees, moonDegrees, currentSkyLight };
}
