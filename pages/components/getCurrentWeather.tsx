import { Get } from "react-axios";
import {
	ReactElement,
	JSXElementConstructor,
	ReactFragment,
	ReactPortal,
} from "react";

export default function CurrentWeather() {
	const currentTime = new Date().getTime();
	return (
		<Get
			url={`http://api.openweathermap.org/data/2.5/weather?id=2653822&appid=${process.env.NEXT_PUBLIC_OPENMAP_API}&units=metric`}
		>
			{(
				error: {
					message:
						| string
						| number
						| boolean
						| ReactElement<any, string | JSXElementConstructor<any>>
						| ReactFragment
						| ReactPortal
						| null
						| undefined;
				},
				response: {
					data: {
						message:
							| string
							| number
							| boolean
							| ReactElement<any, string | JSXElementConstructor<any>>
							| ReactFragment
							| ReactPortal
							| null
							| undefined;
					};
				} | null,
				isLoading: any,
				makeRequest: (arg0: {
					params: { reload: boolean } | { refresh: boolean };
				}) => void,
				axios: any
			) => {
				if (error) {
					return (
						<div>
							Something bad happened: {error.message}{" "}
							<button onClick={() => makeRequest({ params: { reload: true } })}>
								Retry
							</button>
						</div>
					);
				} else if (isLoading) {
					return <div>Loading...</div>;
				} else if (response !== null) {
					console.log(response.data);
					return (
						<div>
							<SuccessfulResult
								data={response.data}
								currentTime={currentTime}
							/>

							<button
								onClick={() => makeRequest({ params: { refresh: true } })}
							>
								Refresh
							</button>
						</div>
					);
				}
				return <div>Default message before request is made.</div>;
			}}
		</Get>
	);
}

const SuccessfulResult = ({
	data,
	currentTime,
}: {
	data: Object;
	currentTime: any;
}) => {
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
	const sunriseDegrees = (sunPosition.azimuth * 180) / Math.PI;
	const moonDegrees = (moonPosition.azimuth * 180) / Math.PI;

	console.log(sunriseDegrees, moonDegrees);
	return (
		<div className="">
			<p>{weather.name}</p>
		</div>
	);
};

// const Canvas = () => {
//   return (

//   )
// }
