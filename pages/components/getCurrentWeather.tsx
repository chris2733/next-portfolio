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
				return;
			})
			.catch(function (error) {
				// handle error
				console.log("Openmap wather api " + error.message);
				return;
			});
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
	const times = SunCalc.getTimes(new Date(), weather.lat, weather.lon);
	const sunPosition = SunCalc.getPosition(new Date(), weather.lat, weather.lon);

	const moonPosition = SunCalc.getMoonPosition(
		new Date(),
		weather.lat,
		weather.lon
	);

	// distance of moon from earth
	const moonDistance = moonPosition.distance;
	// moon illumination, phase and angle, see docs
	const moonIllumination = SunCalc.getMoonIllumination(new Date());

	// degrees calculated from like top of a circle i think
	const sunDegrees = (sunPosition.azimuth * 180) / Math.PI;
	const moonDegrees = (moonPosition.azimuth * 180) / Math.PI;

	return { weather, sunDegrees, moonDegrees };
}
