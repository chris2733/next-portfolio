export default function resetShadows(paintbrush: CanvasRenderingContext2D) {
  // used to reset the shadows, you have to after each time
  paintbrush.shadowColor = "transparent";
  paintbrush.shadowOffsetX = 0;
  paintbrush.shadowOffsetY = 0;
  paintbrush.shadowBlur = 0;
}
