import buildingLayer from "./buildingLayer";
import rgbToHex from "./rgbToHex";
import shadeHexColor from "./shadeHexColor";

export default function buildingsSetup(
  building: any,
  buildings: any,
  horizon: number,
  width: number,
  currentSkyLight: string,
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
      minWMod: 1.066,
      maxWMod: 1.066,
      minHMod: 1.066,
      maxHMod: 1.066,
      minGMod: 0.65,
      maxGMod: 0.65,
      heightAdjust: horizon * 0.33,
      scaleAdjust: 0.65,
      colour: "rgba(0,0,0,0.65)",
    },
    {
      minWMod: 1.033,
      maxWMod: 1.033,
      minHMod: 1.033,
      maxHMod: 1.033,
      minGMod: 0.85,
      maxGMod: 0.85,
      heightAdjust: horizon * 0.66,
      scaleAdjust: 0.85,
      colour: "rgba(0,0,0,0.85)",
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
    // check the current sky colour isnt night, nadir or nightend, otherwise it needs to be lightened
    let checkNight: string[] = ["nauticalDusk", "night", "nadir", "nightEnd"];
    const blackSky = checkNight.includes(currentSkyLight);
    // getting correct -1 starting point for light colours, it shouldnt go past -1
    const hexAdjust = 17; //amount to adjust, lower num for more contrast between layers
    const hexChange = -1 + layerNum / hexAdjust;
    buildingLayers.forEach((layer, index) => {
      // convert to hex to use hexchange (i could use rgb change or something but thats for later)
      // so filter the rgb, brackets and space out, then map to convert the strings to numbers for the rgb function
      const buildingColourRGBArray: number[] = buildingColour
        .replace(/[()'rgb']/g, " ")
        .replaceAll(" ", "")
        .split(",")
        .map((x) => parseInt(x));
      const buildingColourToHex = rgbToHex(
        buildingColourRGBArray[0],
        buildingColourRGBArray[1],
        buildingColourRGBArray[2]
      );
      // if black sky, want the number to go from -0.6 up to -1, -1 being darkest, but anymore it goes wierd
      const shadeChange = blackSky
        ? -0.6 - (layerNum - index) / 10
        : hexChange - index / hexAdjust;
      // maybe -0.05 for nadir? check if nadir, then do -0.05, becuase its just too damn black
      const shadeChangeNadir = 0.01 * (layerNum - index);
      // console.log(currentSkyLight === "nadir");
      layer.colour = shadeHexColor(
        buildingColourToHex,
        currentSkyLight === "nadir"
          ? shadeChangeNadir
          : Number(shadeChange.toFixed(2))
      );
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
