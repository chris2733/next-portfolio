import DrawWindow from "./drawWindow";
import resetShadows from "./resetShadows";

export default function drawBuildingWindows(
  paintbrush: CanvasRenderingContext2D,
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
    DrawWindow(
      randomBuildingId,
      randomBuildingId2,
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
      DrawWindow(
        randomBuildingId,
        randomBuildingId2,
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
}
