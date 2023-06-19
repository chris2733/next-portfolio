import shadeHexColor from "./shadeHexColor";

export default function randomColour() {
  return shadeHexColor(
    "#" + Math.floor(Math.random() * 16777215).toString(16),
    -0.2
  );
}
