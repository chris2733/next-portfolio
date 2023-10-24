function setCanvasReady(
  rainAmount = 300,
  // rain settings here
  rainDropLength = 20,
  rainVelocityMin = 1,
  rainVelocityMax = 6,
  splashRadiusMin = 4,
  splashRadiusMax = 8
) {
  const canvas = document.getElementById("canvasrainEl");
  if (!canvas) {
    return;
  }

  // setting window sizes in vars
  const windowWidth = document.getElementById(
    "canvasrainElWrapper"
  ).offsetWidth;
  const windowHeight = document.getElementById(
    "canvasrainElWrapper"
  ).offsetHeight;
  // setting canvas params
  canvas.width = windowWidth;
  canvas.height = windowHeight;
  // settings for canvas sizes stored here for later
  const canvasWidth = windowWidth;
  const canvasHeight = windowHeight;

  // function to get a random number between 2 digits
  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  // start drawing
  const paintbrush = canvas.getContext("2d");

  // setting initial splash settings here
  // il be honest I don't remember what these do
  const splashStartLeft = 0;
  const splashEndLeft = 0.1;
  const splashStartRight = 1;
  const splashEndRight = 1.1;

  // js object to provide all shapes
  function shapeGenerate(x, y, dy, length, splashRadius, rainColour) {
    this.x = x;
    this.y = y;
    this.dy = dy;
    this.length = length;
    // raindrops stuff
    this.raindropColour = rainColour;
    this.splashColour = rainColour;
    this.splashStartLeft = splashStartLeft;
    this.splashEndLeft = splashEndLeft;
    this.splashStartRight = splashStartRight;
    this.splashEndRight = splashEndRight;
    this.splashRadius = splashRadius;
    this.splashSpeed = 0.05;

    // draw line
    this.draw = function () {
      paintbrush.beginPath();
      paintbrush.moveTo(this.x, this.y);
      paintbrush.lineTo(this.x, this.y + this.length);
      paintbrush.strokeStyle = this.raindropColour;
      paintbrush.stroke();
    };

    // update drawing of line
    this.update = function () {
      // if meets edge of canvas
      if (this.y + this.length > canvasHeight) {
        this.dy = 0;
        this.splash();
        // this.redraw();
      }
      // get moving in first place
      this.y += this.dy;
      // speed up movement due to gravity acceleration
      this.dy += this.dy * 0.02;
      // draw called each time it updates, so it reappears
      this.draw();
    };

    // redraw line starting at 0
    this.redraw = function () {
      this.y = y;
      this.dy = dy;
      // set raindrop to iniital value now it resets
      this.raindropColour = rainColour;
      this.update();
    };

    // triggering splash function when raindrop hits floor
    this.splash = function () {
      // make raindrop invisible while its on the 'floor'
      this.raindropColour = "transparent";
      // splash to the left...
      paintbrush.beginPath();
      paintbrush.arc(
        this.x - this.splashRadius,
        canvasHeight,
        this.splashRadius,
        Math.PI * this.splashStartLeft,
        Math.PI * this.splashEndLeft
      );
      paintbrush.strokeStyle = this.splashColour;
      paintbrush.stroke();
      // ... splash to the right
      paintbrush.beginPath();
      paintbrush.arc(
        this.x + this.splashRadius,
        canvasHeight,
        this.splashRadius,
        Math.PI * this.splashStartRight,
        Math.PI * this.splashEndRight
      );
      paintbrush.strokeStyle = this.splashColour;
      paintbrush.stroke();
      // increase splash distance with each loop, going by splash speed intervals
      this.splashStartLeft -= this.splashSpeed;
      this.splashEndLeft -= this.splashSpeed;
      this.splashStartRight += this.splashSpeed;
      this.splashEndRight += this.splashSpeed;

      if (this.splashStartRight >= 2) {
        // to reset rain motion, and restart whole drawing
        this.splashStartLeft = splashStartLeft;
        this.splashEndLeft = splashEndLeft;
        this.splashStartRight = splashStartRight;
        this.splashEndRight = splashEndRight;
        this.y = 0;
        this.redraw();
      }
    };
  }

  // array of items
  let shapeArray = [];
  for (let i = 0; i < rainAmount; i++) {
    // get randomised numbers
    // start point (randomised), y starts above screen at a random height multiplied by canvas height
    const x = Math.random() * canvasWidth;
    const y = 0 - rainDropLength - Math.random() * canvasHeight;
    // x velocity (randomised)
    const randVelocity = getRandom(rainVelocityMin, rainVelocityMax);
    // max splash radius
    const splashRadius = getRandom(splashRadiusMin, splashRadiusMax);
    shapeArray.push(
      new shapeGenerate(
        x,
        y,
        randVelocity,
        rainDropLength,
        splashRadius,
        "rgba(255, 255, 255, 0.6)"
      )
    );
  }

  // animation loop, keeps on goin and goin
  function animate() {
    requestAnimationFrame(animate);
    // clear canvas after every frame
    paintbrush.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let i = 0; i < shapeArray.length; i++) {
      shapeArray[i].update();
    }
  }

  animate();
}

// setCanvasReady(300);
export default setCanvasReady;
