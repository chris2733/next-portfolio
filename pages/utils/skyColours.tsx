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
    { stop: 0, color: "rgb(247, 166, 7)" },
    { stop: 0.2, color: "rgb(244, 181, 20)" },
    { stop: 0.35, color: "rgb(243, 193, 103)" },
    { stop: 0.5, color: "rgb(179, 174, 144)" },
    { stop: 0.75, color: "rgb(108, 114, 119)" },
  ],
  sunriseEnd: [
    { stop: 0, color: "rgb(247, 166, 7)" },
    { stop: 0.1, color: "rgb(244, 181, 20)" },
    { stop: 0.15, color: "rgb(243, 193, 103)" },
    { stop: 0.2, color: "rgb(179, 174, 144)" },
    { stop: 0.4, color: "rgb(108, 114, 119)" },
  ],
  goldenHourEnd: [
    { stop: 0, color: "rgb(226, 218, 175)" },
    { stop: 0.3, color: "rgb(208, 217, 207)" },
    { stop: 0.5, color: "rgb(143, 169, 176)" },
    { stop: 0.65, color: "rgb(80, 108, 133)" },
    { stop: 1, color: "rgb(80, 108, 133)" },
  ],
  solarNoon: [
    { stop: 0, color: "rgb(132, 174, 196)" },
    { stop: 0.2, color: "rgb(84, 157, 196)" },
    { stop: 0.4, color: "rgb(15, 123, 175)" },
    { stop: 0.7, color: "rgb(15, 123, 175)" },
    { stop: 1, color: "rgb(15, 123, 175)" },
  ],
  goldenHour: [
    { stop: 0, color: "rgb(226, 218, 175)" },
    { stop: 0.3, color: "rgb(208, 217, 207)" },
    { stop: 0.5, color: "rgb(143, 169, 176)" },
    { stop: 0.65, color: "rgb(80, 108, 133)" },
    { stop: 1, color: "rgb(80, 108, 133)" },
  ],
  sunsetStart: [
    { stop: 0, color: "rgb(247, 166, 7)" },
    { stop: 0.1, color: "rgb(244, 181, 20)" },
    { stop: 0.15, color: "rgb(243, 193, 103)" },
    { stop: 0.2, color: "rgb(179, 174, 144)" },
    { stop: 0.4, color: "rgb(108, 114, 119)" },
  ],
  sunset: [
    { stop: 0, color: "rgb(198, 117, 1)" },
    { stop: 0.35, color: "rgb(247, 166, 7)" },
    { stop: 0.5, color: "rgb(243, 193, 103)" },
    { stop: 0.75, color: "rgb(179, 174, 144)" },
    { stop: 1, color: "rgb(108, 114, 119)" },
  ],
  dusk: [
    { stop: 0, color: "rgb(125, 75, 2)" },
    { stop: 0.1, color: "rgb(94, 75, 65)" },
    { stop: 0.2, color: "rgb(91, 92, 112)" },
    { stop: 0.5, color: "rgb(37, 61, 101)" },
    { stop: 1, color: "rgb(20, 41, 52)" },
  ],
  nauticalDusk: [
    { stop: 0, color: "rgb(94, 75, 65)" },
    { stop: 0.2, color: "rgb(91, 92, 112)" },
    { stop: 0.5, color: "rgb(37, 61, 101)" },
    { stop: 0.8, color: "rgb(12, 23, 52)" },
    { stop: 1, color: "rgb(3, 10, 23)" },
  ],
  night: [
    { stop: 0, color: "rgb(91, 92, 112)" },
    { stop: 0.1, color: "rgb(37, 61, 101)" },
    { stop: 0.3, color: "rgb(12, 23, 52)" },
    { stop: 0.8, color: "rgb(3, 10, 23)" },
    { stop: 1, color: "rgb(3, 10, 23)" },
  ],
  nadir: [
    { stop: 0, color: "rgb(0, 0, 0)" },
    { stop: 0.25, color: "rgb(0, 0, 0)" },
    { stop: 0.5, color: "rgb(0, 0, 0)" },
    { stop: 0.75, color: "rgb(0, 0, 0)" },
    { stop: 1, color: "rgb(0, 0, 0)" },
  ],
  nightEnd: [
    { stop: 0, color: "rgb(94, 75, 65)" },
    { stop: 0.2, color: "rgb(91, 92, 112)" },
    { stop: 0.5, color: "rgb(37, 61, 101)" },
    { stop: 0.8, color: "rgb(12, 23, 52)" },
    { stop: 1, color: "rgb(3, 10, 23)" },
  ],
  nauticalDawn: [
    { stop: 0, color: "rgb(198, 117, 1)" },
    { stop: 0.1, color: "rgb(228, 152, 5)" },
    { stop: 0.2, color: "rgb(190, 153, 72)" },
    { stop: 0.5, color: "rgb(128, 120, 100)" },
    { stop: 1, color: "rgb(20, 41, 52)" },
  ],
  dawn: [
    { stop: 0, color: "rgb(216, 140, 31)" },
    { stop: 0.2, color: "rgb(212, 179, 102)" },
    { stop: 0.6, color: "rgb(136, 139, 133)" },
    { stop: 0.8, color: "rgb(94, 111, 119)" },
    { stop: 1, color: "rgb(94, 111, 119)" },
  ],
};

export default function skyColoursObj() {
  return skyColours;
}
