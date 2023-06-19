// test data to show night and day
export const testData: object = {
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
  rain: {
    "1h": 3.16,
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

export const dataTimeOptions: { name: string; time: number }[] = [
  {
    name: "Noon",
    time: 1665497241000,
  },
  {
    name: "Golden hour",
    time: 1671375859222,
  },
  {
    name: "Sunset start",
    time: 1671379286041,
  },
  {
    name: "Sunset",
    time: 1671379549141,
  },
  {
    name: "Dusk",
    time: 1671381963915,
  },
  {
    name: "Nautical dusk",
    time: 1671384551447,
  },
  {
    name: "Night",
    time: 1665442803000,
  },
  {
    name: "Nadir",
    time: 1671322233274,
  },
  {
    name: "Night end",
    time: 1671343869509,
  },
  {
    name: "Nautical dawn",
    time: 1671346315101,
  },
  {
    name: "Dawn",
    time: 1671348902633,
  },
  {
    name: "Sunrise",
    time: 1671351317407,
  },
  {
    name: "Sunrise end",
    time: 1671351580506,
  },
  {
    name: "Golden hour end",
    time: 1671355007325,
  },
];

export default testData;
